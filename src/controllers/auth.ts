import { NextFunction, Request, Response } from "express";
import {
  generateRandomNumbers,
  returnJSONError,
  returnJSONSuccess,
  sendEmail,
} from "../utils/functions";
import { prisma } from "../prisma";
import { BadRequest } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { validateRegData, validateSellerRegData } from "../schema/users";
import { hashSync } from "bcrypt";
import { InternalException } from "../exceptions/internal-exception";
import { NotFound } from "../exceptions/not-found";

export const accountStatus = (req: Request, res: Response) => {
  res.json(req.user);
};
export const register = async (req: Request, res: Response) => {
  validateRegData.parse(req.body);
  const findUser = await prisma.user.findFirst({
    where: { email: req.body.email },
  });
  if (!findUser) {
    let user = await prisma.user.create({
      data: {
        ...req.body,
        password: hashSync(req.body.password, 10),
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    const id = await sendOtp(user.id, user.email);
    if (id) {
      return returnJSONSuccess(res, { userId: id });
    }
    throw new InternalException(
      "Couldnt send mail",
      ErrorCode.MAIL_ERROR,
      null
    );
  } else {
    new BadRequest("User already exist", ErrorCode.USER_ALREADY_EXIST);
  }
};
export const registerSeller = async (req: Request, res: Response) => {
  validateSellerRegData.parse(req.body);
  const findUser = await prisma.user.findFirst({
    where: { email: req.body.email },
  });
  if (!findUser) {
    let user = await prisma.user.create({
      data: {
        email: req.body.email as string,
        fullname: req.body.fullname,
        accountType: "SELLER",
        country: req.body.country,
        telephone: req.body.telephone,
        password: hashSync(req.body.password, 10),

        store: {
          create: {
            name: req.body.companyNam,
            description: "",
            location: req.body.country,
          },
        },
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });
    const id = await sendOtp(user.id, user.email);
    if (id) {
      return returnJSONSuccess(res, { userId: id });
    }
    throw new InternalException(
      "Couldnt send mail",
      ErrorCode.MAIL_ERROR,
      null
    );
  } else {
    new BadRequest("User already exist", ErrorCode.USER_ALREADY_EXIST);
  }
};

export const loginAuthError = (req: Request, res: Response) => {
  let message = req.flash("error");
  res.status(message[1] ? +message[1] : 401).json({
    status: false,
    message: message[0] ? message[0] : "Something went wrong",
    errorCode: message[2] ? +message[2] : ErrorCode.BAD_REQUEST,
  });
};
export const googleAuthError = (req: Request, res: Response) => {
  let message = req.flash("error");
  res.status(401).json({
    status: false,
    message: message[0],
  });
};
const sendOtp = async (id: string, email: string) => {
  const otp = generateRandomNumbers(5);
  let minuteToExpire = 300000; // 5 mins
  if (id) {
    const otpUser = await prisma.verifyUser.create({
      data: {
        userId: id,
        expiresAt: new Date(Date.now() + minuteToExpire),
        otp: "" + otp,
      },
      select: {
        id: true,
      },
    });
    const mailResponse = await sendEmail(
      "Ravyyin",
      "Verify your account",
      email,
      `Please verify your account. your otp is ${otp} and i will expire in 5 minutes`
    );
    if (mailResponse.status) {
      return id;
    } else {
      await prisma.verifyUser.delete({
        where: {
          id: otpUser.id,
        },
      });
    }
  }
};
export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, code }: { id: string; code: string } = req.body;
  if (id && code) {
    try {
      const otp = await prisma.verifyUser.findFirstOrThrow({
        where: {
          userId: id,
          otp: code,
        },
      });
      if (otp.expiresAt.valueOf() < new Date().valueOf()) {
        // otp expired
        await prisma.$transaction([
          prisma.user.update({
            where: {
              id: otp.userId,
            },
            data: {
              status: "FAILED",
            },
          }),
          prisma.verifyUser.delete({
            where: {
              userId: otp.userId,
            },
          }),
        ]);
        return returnJSONError(res, { message: "OTP expired" }, 401);
      } else {
        let [user, _] = await prisma.$transaction([
          prisma.user.update({
            where: {
              id: otp.userId,
            },
            data: {
              status: "VERIFIED",
            },
            select: {
              id: true,
              email: true,
              accountType: true,
            },
          }),
          prisma.verifyUser.delete({
            where: {
              userId: otp.userId,
            },
          }),
        ]);
        req.logIn(user, function (err) {
          if (err) {
            throw err;
          }
          return res.status(200).json({ status: true, ...req.user });
        });
      }
    } catch (error) {
      next(new NotFound("Failed to find OTP", ErrorCode.MAIL_ERROR));
    }
  } else {
    next(new BadRequest("Invalid Request Parameters", ErrorCode.BAD_REQUEST));
  }
};
export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ status: true });
  });
};

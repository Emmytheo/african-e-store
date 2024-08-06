import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import {
  createPrismaError,
  extractFullUrlProducts,
  returnJSONError,
  returnJSONSuccess,
} from "../utils/functions";
import { validatecreateProduct } from "../schema/products";
import { RequestUser } from "../types";
import { ErrorCode } from "../exceptions/root";
import { BadRequest } from "../exceptions/bad-request";
import { NotFound } from "../exceptions/not-found";
import { DatabaseException } from "../exceptions/datebase-exception";
import { getPositiveReview } from "./store";
import { Prisma } from "@prisma/client";
import { extendAmount } from "../prisma/extensions";
import logger from "../utils/logger";

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const imagesArray = (req.files as any[]) || [];
  const images = [
    ...imagesArray?.map(
      (image) => extractFullUrlProducts(req) + image.filename
    ),
  ];
  let newImageArray: string[] | [] = [];
  const imagesIndex: { index: number; name: string }[] = JSON.parse(
    req.body.imagesIndex
  );
  if (imagesIndex.length > 0) {
    imagesIndex.map(
      (index) =>
        (newImageArray[index.index] =
          images.find((i) => i.endsWith(index.name.replace(/ /g, "_"))) || "")
    );
    let availableIndex = newImageArray.map((img, i) => i);
    const allNumbers = [0, 1, 2, 3];
    availableIndex.map((i) => {
      if (allNumbers.includes(i)) {
        allNumbers.splice(allNumbers.indexOf(i), 1);
      }
    });
    allNumbers.map(
      (index, i) =>
        (newImageArray[index] = Array.isArray(req.body.images)
          ? req.body.images[i]
          : req.body.images)
    );
  } else {
    newImageArray = req.body.images;
  }
  const validatedProduct = validatecreateProduct.parse(req.body);
  const categ = await prisma.product.findFirstOrThrow({
    where: {
      AND: [{ id }, { deleted: false }],
    },
    select: {
      categories: true,
    },
  });
  await prisma.product.update({
    where: {
      id: id,
    },
    data: {
      coverImage: newImageArray[0],
      itemCondition: validatedProduct.condition,
      name: validatedProduct.name,
      amount: validatedProduct.price,
      endBiddingDate:
        req.body.date && req.body.date !== ""
          ? new Date(req.body.date) || null
          : null,
      details: validatedProduct.description,
      images: newImageArray,
      salesType: req.body.salesType,
      quantity: validatedProduct.quantity,
      publish: validatedProduct.publish === "false" ? false : true,
      categories: {
        disconnect: categ?.categories.map((cat) => ({ id: cat.id })),
        connect: [{ id: req.body.category }],
      },
    },
  });
  return returnJSONSuccess(res);
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as RequestUser;
  const imagesArray = req.files as any[];
  const images = imagesArray.map(
    (image) => extractFullUrlProducts(req) + image.filename
  );
  if (images.length === 0) {
    next(new BadRequest("Upload one or more image(s)", ErrorCode.BAD_REQUEST));
  }
  const validatedProduct = validatecreateProduct.parse(req.body);
  const storeId = await prisma.store.findFirstOrThrow({
    where: { userId: user.id },
    select: { id: true },
  });

  await prisma.product.create({
    data: {
      coverImage: images.length > 0 ? images[0] : "",
      itemCondition: validatedProduct.condition,
      name: validatedProduct.name,
      amount: validatedProduct.price,
      endBiddingDate:
        req.body.date && req.body.date !== "undefined"
          ? new Date(req.body.date) || null
          : null,
      images: images as Prisma.JsonArray,
      salesType: validatedProduct.salesType,
      details: validatedProduct.description,
      quantity: validatedProduct.quantity,
      publish: validatedProduct.publish === "false" ? false : true,
      storeId: storeId.id,
      categories: {
        connect: [{ id: req.body.category }],
      },
    },
  });
  return returnJSONSuccess(res);
};

export const getProductById = async (req: Request, res: Response) => {
  const settings = await prisma.settings.findFirstOrThrow({
    select: {
      profitPercent: true,
    },
  });
  const user = req.user as RequestUser;
  const { id } = req.params;

  let product = await prisma
    .$extends(extendAmount(settings))
    .product.findFirstOrThrow({
      where: {
        AND: [{ id }, { publish: true }, { deleted: false }],
      },
      select: {
        id: true,
        name: true,
        amount: true,
        itemCondition: true,
        salesType: true,
        quantity: true,
        details: true,
        coverImage: true,
        store: true,
        discount: true,
        discountPercentage: true,
        images: true,
        favourite: {
          where: {
            id: user.id,
          },
          select: {
            id: true,
          },
        },
        endBiddingDate: true,
        returnPolicy: true,
      },
    });
  const rating = await prisma.rating.aggregate({
    where: {
      AND: [
        {
          orderDetails: {
            some: {
              AND: [
                { status: "DELIVERED" },
                { storeId: product.store.id },
                {
                  product: {
                    id: product.id,
                  },
                },
              ],
            },
          },
        },
      ],
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });
  const productRatings = await prisma.rating.findMany({
    where: {
      AND: [
        {
          orderDetails: {
            some: {
              AND: [
                { status: "DELIVERED" },
                { storeId: product?.store.id },
                {
                  product: {
                    id: product?.id || "",
                  },
                },
              ],
            },
          },
        },
      ],
    },
    select: {
      user: {
        select: {
          fullname: true,
        },
      },
      rating: true,
      createdAt: true,
      id: true,
      review: true,
    },
  });
  let avgRating = (rating._avg.rating || 0).toString().includes(".")
    ? (rating._avg.rating || 0).toFixed(1)
    : (rating._avg.rating || 0).toFixed(0);
  try {
    await prisma.viewsTracker.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId: id,
        },
      },
      create: {
        userId: user.id,
        productId: id,
        updatedAt: new Date(),
      },
      update: {
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    logger.error(error);
  } finally {
    return returnJSONSuccess(res, {
      data: {
        ...product,
        avgRating: parseFloat(avgRating),
        totalRating: rating._count.rating || 0,
        positiveFeeback: await getPositiveReview(product?.store.id!),
        productRatings,
      },
    });
  }
};
export const deleteProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.order.findFirst({
    where: {
      orderDetails: {
        some: {
          productId: id,
        },
      },
    },
  });
  if (product) {
    await prisma.product.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
    });
  } else {
    await prisma.product.delete({
      where: {
        id,
      },
    });
  }
  return returnJSONSuccess(res);
};
export const getFavouriteProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user as RequestUser;
  try {
    const favourite = await prisma.user.findFirstOrThrow({
      where: {
        id: user.id,
      },
      select: {
        favouriteProducts: {
          where: {
            publish: true,
          },
          include: {
            store: true,
          },
        },
      },
    });
    returnJSONSuccess(res, { data: favourite.favouriteProducts });
  } catch (error) {
    next(new NotFound("User not found", ErrorCode.NOT_FOUND));
  }
};
export const addProductToFavourite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.body;

  const user = req.user as RequestUser;
  if (id) {
    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          favouriteProducts: {
            connect: [{ id }],
          },
        },
      });
      return returnJSONSuccess(res);
    } catch (error) {
      return returnJSONError(res, { message: "Unable to add to favourite" });
    }
  } else {
    next(new BadRequest("Invalid Request Parameter", ErrorCode.BAD_REQUEST));
  }
};
export const removeProductFromFavourite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const user = req.user as RequestUser;
  if (id) {
    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          favouriteProducts: {
            disconnect: [{ id }],
          },
        },
      });
      return returnJSONSuccess(res);
    } catch (error) {
      return returnJSONError(res, { message: "Unable to add to favourite" });
    }
  } else {
    next(new BadRequest("Invalid Request Parameter", ErrorCode.BAD_REQUEST));
  }
};
export const getRecentlyViewedProductsForLoggedUser = async (
  req: Request,
  res: Response
) => {
  const products = await prisma.viewsTracker.findMany({
    where: {
      userId: (req.user as RequestUser).id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 8,
    select: {
      product: {
        select: {
          id: true,
          coverImage: true,
          amount: true,
          name: true,
        },
      },
    },
  });
  returnJSONSuccess(res, { data: products });
};
export const getRecommendedProducts = async (req: Request, res: Response) => {
  const count = await prisma.product.count({
    where: {
      AND: [{ publish: true }, { deleted: false }],
    },
  });
  const randomUsed: number[] = [];
  const getRandomSkips = () => Math.floor(Math.random() * count);
  const transactions = [];
  for (let i = 1; i <= 8; i++) {
    let randomSkip = getRandomSkips();
    if (randomUsed.includes(randomSkip)) {
      continue;
    } else {
      transactions.push(
        prisma.product.findFirst({
          skip: randomSkip,
          take: 1,
          where: {
            AND: [{ publish: true }, { deleted: false }],
          },
          select: {
            id: true,
            coverImage: true,
            amount: true,
            name: true,
          },
        })
      );
      randomUsed.push(randomSkip);
    }
  }
  const recommended = await prisma.$transaction(transactions);
  return returnJSONSuccess(res, { recommended });
};

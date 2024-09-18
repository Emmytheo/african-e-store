import { z } from "zod";
const passwordErrorMessage = "Password must contain at least 4 character(s)";
const phoneErrorMessage = "Phone number must contain at least 10 character(s)";
const countryErrorMessage = "Country must contain at least 11 character(s)";
export const validateLoginData = z.object({
  email: z.string({ message: "email is required" }).email(),
  password: z
    .string({ message: "password is required" })
    .min(2, passwordErrorMessage),
});

export const validateRegData = z
  .object({
    email: z.string({ message: "email is required" }).email(),
    fullname: z.string({ message: "fullname is required" }).min(2),
    password: z
      .string({ message: "password is required" })
      .min(4, passwordErrorMessage),
    confirmPassword: z
      .string({ message: "password is required" })
      .min(4, passwordErrorMessage),
    telephone: z
      .string({ message: "telephone is required" })
      .min(10, phoneErrorMessage),
    country: z.string().min(2, countryErrorMessage).optional(),
    city: z
      .string({ message: "City required" })
      .min(2, "Must be more than 2 words"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"],
  });
export const validateSellerRegData = z
  .object({
    email: z.string({ message: "email is required" }).email(),
    fullname: z.string({ message: "fullname is required" }).min(2),
    companyName: z.string({ message: "Company name is required" }).min(2),
    password: z
      .string({ message: "password is required" })
      .min(4, passwordErrorMessage),
    confirmPassword: z
      .string({ message: "password is required" })
      .min(4, passwordErrorMessage),
    telephone: z
      .string({ message: "telephone is required" })
      .min(10, phoneErrorMessage),
    country: z.string().min(2, countryErrorMessage).optional(),
    city: z
      .string({ message: "City required" })
      .min(2, "Must be more than 2 words"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"],
  });
export const validateAdminRegData = z
  .object({
    email: z.string({ message: "email is required" }).email(),
    fullname: z.string({ message: "fullname is required" }).min(2),
    companyToken: z.string({ message: "Company Token is required" }).min(2),
    password: z
      .string({ message: "password is required" })
      .min(4, passwordErrorMessage),
    confirmPassword: z
      .string({ message: "password is required" })
      .min(4, passwordErrorMessage),
    telephone: z
      .string({ message: "telephone is required" })
      .min(10, phoneErrorMessage),
    country: z.string().min(2, countryErrorMessage).optional(),
    city: z
      .string({ message: "City required" })
      .min(2, "Must be more than 2 words"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords does not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.companyToken === process.env.COMPANY_TOKEN, {
    message: "Company Token not valid, Admin Signup not authorized.",
    path: ["companyToken"],
  });
export const validateAddress = z.object({
  city: z.string().min(1, "Must be more than 1 character"),
  houseNumber: z.string().optional(),
  street: z.string().optional(),
  postCode: z.string().optional(),
  country: z.string().optional(),
});
export const validateReview = z.object({
  rating: z.number().positive().int().min(1).max(5),
  review: z.string().min(2, "Length to small"),
});
export type Address = z.infer<typeof validateAddress>;
export const validateMessage = z.string().min(5, "Length to small");
export const validateProductMessage = z.object({
  message: z.string().min(5, "Length to small"),
  productId: z.string(),
});

import z from "zod";
import { IsActive, Role } from "../user/user.interface";


export const passwordSchema = z
  .string({ invalid_type_error: "Password must be string" })
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/^(?=.*[A-Z])/, {
    message: "Password must contain at least 1 uppercase letter.",
  })
  .regex(/^(?=.*[!@#$%^&*])/, {
    message: "Password must contain at least 1 special character.",
  })
  .regex(/^(?=.*\d)/, {
    message: "Password must contain at least 1 number.",
  });


export const createDriverZodSchema = z.object({
  name: z
    .string({ invalid_type_error: "Name must be string" })
    .min(2, { message: "Name must be at least 2 characters long." })
    .max(50, { message: "Name cannot exceed 50 characters." }),
  email: z
    .string({ invalid_type_error: "Email must be string" })
    .email({ message: "Invalid email address format." })
    .min(5, { message: "Email must be at least 5 characters long." })
    .max(100, { message: "Email cannot exceed 100 characters." }),
  password: passwordSchema,
  phone: z
    .string({ invalid_type_error: "Phone must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh.",
    })
    .optional(),
  picture: z.string().url("Picture must be a valid URL").optional(),
  address: z
    .string({ invalid_type_error: "Address must be string" })
    .max(200, { message: "Address cannot exceed 200 characters." })
    .optional(),
  auths: z
    .array(
      z.object({
        provider: z.string(),
        providerid: z.string(),
      })
    )
    .optional(),
  role: z.enum([Role.DRIVER]).optional(),
  licenseNumber: z.string({ required_error: "License number is required" }),
  vehicleType: z.string({ required_error: "Vehicle type is required" }),
  vehicleModel: z.string({ required_error: "Vehicle model is required" }),
  vehiclePlate: z.string({ required_error: "Vehicle plate is required" }),
  isOnline: z.boolean().optional(),
  totalRides: z.number().min(0).optional(),
  driverlocation: z.string({ required_error: "Driver location is required" }),
  earnings: z.number().optional(),
  rating: z.number().min(0).max(5).optional(),
  isApproved: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDelete: z.boolean().optional(),
});

// 📌 Update Driver Schema
export const updateDriverZodSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  password: passwordSchema.optional(),
  phone: z
    .string()
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message: "Phone number must be valid for Bangladesh.",
    })
    .optional(),
  picture: z.string().url().optional(),
  address: z.string().max(200).optional(),
  licenseNumber: z.string().optional(),
  vehicleType: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehiclePlate: z.string().optional(),
  isOnline: z.boolean().optional(),
  totalRides: z.number().min(0).optional(),
  driverlocation: z.string().optional(),
  earnings: z.number().optional(),
  rating: z.number().min(0).max(5).optional(),
  isApproved: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDelete: z.boolean().optional(),
  role: z.enum([Role.DRIVER]).optional(),
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverZodSchema = exports.createDriverZodSchema = exports.passwordSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interface_1 = require("../user/user.interface");
exports.passwordSchema = zod_1.default
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
exports.createDriverZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: exports.passwordSchema,
    phone: zod_1.default
        .string({ invalid_type_error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh.",
    })
        .optional(),
    picture: zod_1.default.string().url("Picture must be a valid URL").optional(),
    address: zod_1.default
        .string({ invalid_type_error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 200 characters." })
        .optional(),
    auths: zod_1.default
        .array(zod_1.default.object({
        provider: zod_1.default.string(),
        providerid: zod_1.default.string(),
    }))
        .optional(),
    role: zod_1.default.enum([user_interface_1.Role.DRIVER]).optional(),
    licenseNumber: zod_1.default.string({ required_error: "License number is required" }),
    vehicleType: zod_1.default.string({ required_error: "Vehicle type is required" }),
    vehicleModel: zod_1.default.string({ required_error: "Vehicle model is required" }),
    vehiclePlate: zod_1.default.string({ required_error: "Vehicle plate is required" }),
    isOnline: zod_1.default.boolean().optional(),
    totalRides: zod_1.default.number().min(0).optional(),
    driverlocation: zod_1.default.string({ required_error: "Driver location is required" }),
    earnings: zod_1.default.number().optional(),
    rating: zod_1.default.number().min(0).max(5).optional(),
    isApproved: zod_1.default.boolean().optional(),
    isVerified: zod_1.default.boolean().optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isDelete: zod_1.default.boolean().optional(),
});
// 📌 Update Driver Schema
exports.updateDriverZodSchema = zod_1.default.object({
    name: zod_1.default.string().min(2).max(50).optional(),
    password: exports.passwordSchema.optional(),
    phone: zod_1.default
        .string()
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh.",
    })
        .optional(),
    picture: zod_1.default.string().url().optional(),
    address: zod_1.default.string().max(200).optional(),
    licenseNumber: zod_1.default.string().optional(),
    vehicleType: zod_1.default.string().optional(),
    vehicleModel: zod_1.default.string().optional(),
    vehiclePlate: zod_1.default.string().optional(),
    isOnline: zod_1.default.boolean().optional(),
    totalRides: zod_1.default.number().min(0).optional(),
    driverlocation: zod_1.default.string().optional(),
    earnings: zod_1.default.number().optional(),
    rating: zod_1.default.number().min(0).max(5).optional(),
    isApproved: zod_1.default.boolean().optional(),
    isVerified: zod_1.default.boolean().optional(),
    isActive: zod_1.default.enum(Object.values(user_interface_1.IsActive)).optional(),
    isDelete: zod_1.default.boolean().optional(),
    role: zod_1.default.enum([user_interface_1.Role.DRIVER]).optional(),
});

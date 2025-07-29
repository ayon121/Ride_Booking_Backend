import { Types } from "mongoose";
import { IAuthProvider, IsActive, Role } from "../user/user.interface";

export interface IDriverRating {
    rating: number;
    review?: string;
    riderId: Types.ObjectId;
    createdAt?: Date;
}

export interface IDriverFields {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    auths: IAuthProvider[];
    role: Role;
    licenseNumber: string;
    vehicleType: string;
    vehicleModel: string;
    vehiclePlate: string;
    isDelete?: boolean;
    isActive?: IsActive;
    isApproved?: boolean;
    isVerified?: boolean;
    isOnline: boolean;
    totalRides: number;
    earnings?: number;
    rating?: number;
    driverlocation: string;
    driverratings: IDriverRating[];
    currentRideId?: Types.ObjectId;
}
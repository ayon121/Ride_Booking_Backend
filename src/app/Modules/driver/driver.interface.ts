import { Types } from "mongoose";
import { IAuthProvider, IsActive, Role } from "../user/user.interface";

export interface IDriverReviews {
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
    isSuspended ?: boolean;
    isOnRide ?: boolean;
    isVerified?: boolean;
    isOnline: boolean;
    totalRides: number;
    earnings?: number;
    rating?: number;
    driverlocation: string;
    driverReviews: IDriverReviews[];
    currentRide?: Types.ObjectId;
    Ridehistory?: Types.ObjectId[];
}
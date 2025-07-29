import { Schema, model } from "mongoose";
import { IDriverFields } from "./driver.interface";

import { AuthProviderSchema } from "../user/user.model";
import { IsActive, Role } from "../user/user.interface";

const DriverReviewSchema = new Schema(
  {
    rating: { type: Number, required: true },
    review: { type: String },
    riderId: { type: Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
);

const DriverSchema = new Schema<IDriverFields>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    auths: { type: [AuthProviderSchema], default: [] },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.DRIVER,
    },
    licenseNumber: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    vehiclePlate: { type: String, required: true },

    isDelete: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isApproved: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },

    isOnline: { type: Boolean, default: true },
    totalRides: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },

    driverlocation: { type: String },
    driverratings: [DriverReviewSchema],
    currentRideId: { type: Schema.Types.ObjectId, ref: "Ride", default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Driver = model<IDriverFields>("Driver", DriverSchema);
export default Driver;

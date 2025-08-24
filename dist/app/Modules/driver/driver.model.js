"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const DriverReviewSchema = new mongoose_1.Schema({
    rating: { type: Number, required: true },
    review: { type: String },
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    rideId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Ride", required: true },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver", required: true },
    createdAt: { type: Date, default: Date.now },
});
const DriverSchema = new mongoose_1.Schema({
    name: { type: String, required: true }, //
    email: { type: String, required: true, unique: true }, //
    password: { type: String },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    auths: { type: [user_model_1.AuthProviderSchema], default: [] },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.DRIVER,
    },
    licenseNumber: { type: String, required: true }, //
    vehicleType: { type: String, required: true }, //
    vehicleModel: { type: String, required: true }, //
    vehiclePlate: { type: String, required: true }, //
    isDelete: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    isApproved: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: true },
    totalRides: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    isOnRide: { type: Boolean, default: false },
    isSuspended: { type: Boolean, default: false },
    driverlocation: { type: String, required: true, default: "Dhaka" },
    driverReviews: { type: [DriverReviewSchema], default: [] },
    currentRide: { type: mongoose_1.Schema.Types.ObjectId, ref: "Ride", default: null },
    Ridehistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Ride", default: null }],
}, {
    timestamps: true,
    versionKey: false,
});
const Driver = (0, mongoose_1.model)("Driver", DriverSchema);
exports.default = Driver;

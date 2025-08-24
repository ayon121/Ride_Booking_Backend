"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.AuthProviderSchema = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
exports.AuthProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerid: { type: String, required: true }
}, {
    versionKey: false,
    _id: false,
});
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interface_1.Role),
        default: user_interface_1.Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isActive: {
        type: String,
        enum: Object.values(user_interface_1.IsActive),
        default: user_interface_1.IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    auths: { type: [exports.AuthProviderSchema], default: [] },
    isOnRide: { type: Boolean, default: false },
    currentRide: { type: mongoose_1.Schema.Types.ObjectId, ref: "Ride", default: null },
    Ridehistory: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Ride" }],
}, {
    timestamps: true,
    versionKey: false,
});
exports.User = (0, mongoose_1.model)("User", UserSchema);

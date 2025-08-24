"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ride_interface_1 = require("./ride.interface");
const RideSchema = new mongoose_1.Schema({
    riderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Driver", default: null },
    pickupLocation: { type: String, required: true },
    dropLocation: { type: String, required: true },
    price: { type: Number, required: true },
    ridestatus: { type: String, enum: Object.values(ride_interface_1.RideStatus), default: ride_interface_1.RideStatus.REQUESTED },
    requestedAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    paymentMethod: { type: String, enum: ["CASH", "CARD"], default: "CASH" },
    isPaid: { type: Boolean, default: false },
    pickupOtp: { type: Number, default: 0 }
}, {
    timestamps: true,
    versionKey: false
});
// basic fields to create a ride : riderId , pickupLocation , dropLocation , price 
const Ride = (0, mongoose_1.model)("Ride", RideSchema);
exports.default = Ride;

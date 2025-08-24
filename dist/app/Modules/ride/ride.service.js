"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideServices = exports.getSingleRideAdminService = void 0;
const AppError_1 = __importDefault(require("../../ErrorHelpers/AppError"));
const ride_interface_1 = require("./ride.interface");
const ride_model_1 = __importDefault(require("./ride.model"));
const user_model_1 = require("../user/user.model");
const driver_model_1 = __importDefault(require("../driver/driver.model"));
const user_interface_1 = require("../user/user.interface");
const createRideService = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.userId;
    const { pickupLocation, dropLocation, price } = payload;
    if (!riderId || !pickupLocation || !dropLocation || !price) {
        throw new AppError_1.default(500, "Required ride fields are missing");
    }
    const existingRide = yield ride_model_1.default.findOne({
        riderId,
        ridestatus: { $nin: [ride_interface_1.RideStatus.COMPLETED, ride_interface_1.RideStatus.CANCELLED] },
    });
    if (existingRide) {
        throw new AppError_1.default(400, "You already have an active ride in progress.");
    }
    const ride = yield ride_model_1.default.create({
        riderId,
        pickupLocation,
        dropLocation,
        price,
        requestedAt: new Date(),
    });
    return ride;
});
// all requested rides for drivers
const getAllRequestedRideService = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.default.find({ ridestatus: "REQUESTED" });
    const TotalRideRequest = yield ride_model_1.default.countDocuments({ ridestatus: "REQUESTED" });
    return {
        data: rides,
        meta: {
            total: TotalRideRequest
        }
    };
});
const getMyRideService = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    let currentRideId = null;
    // eslint-disable-next-line no-console
    console.log(decodedToken);
    if (decodedToken.role === user_interface_1.Role.USER) {
        const user = yield user_model_1.User.findById(decodedToken.userId).select("currentRide");
        currentRideId = user === null || user === void 0 ? void 0 : user.currentRide;
    }
    else if (decodedToken.role === user_interface_1.Role.DRIVER) {
        const driver = yield driver_model_1.default.findById(decodedToken.userId).select("currentRide");
        currentRideId = driver === null || driver === void 0 ? void 0 : driver.currentRide;
    }
    if (!currentRideId) {
        return {
            data: null,
            meta: {
                message: "No current ride found."
            }
        };
    }
    const ride = yield ride_model_1.default.findById(currentRideId);
    return {
        data: ride,
        meta: {
            message: "Your ride found."
        }
    };
});
// admin or super-admin
const getAllRideService = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.default.find({});
    const totalrides = yield ride_model_1.default.countDocuments();
    return {
        data: rides,
        meta: {
            total: totalrides
        }
    };
});
//  ride status updated by driver
const validStatusFlow = {
    [ride_interface_1.RideStatus.REQUESTED]: ride_interface_1.RideStatus.ACCEPTED,
    [ride_interface_1.RideStatus.ACCEPTED]: ride_interface_1.RideStatus.PICKEDUP,
    [ride_interface_1.RideStatus.PICKEDUP]: ride_interface_1.RideStatus.INTRANSIT,
    [ride_interface_1.RideStatus.INTRANSIT]: ride_interface_1.RideStatus.COMPLETED,
};
const updateRideStatusDriverService = (rideId, status, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const ride = yield ride_model_1.default.findById(rideId);
    if (!ride) {
        throw new Error("Ride not found");
    }
    const currentStatus = ride.ridestatus;
    // Step-by-step flow check
    const expectedNextStatus = validStatusFlow[currentStatus];
    if (status !== expectedNextStatus) {
        throw new Error(`Invalid status transition. Expected '${expectedNextStatus}' after '${currentStatus}', but got '${status}'.`);
    }
    // Step 1: ------------------------------- ACCEPTED ----------------------
    if (status === ride_interface_1.RideStatus.ACCEPTED) {
        const driver = yield driver_model_1.default.findById(decodedToken.userId);
        if (!driver) {
            throw new Error("Driver not found.");
        }
        if (driver.isSuspended) {
            throw new Error("Your account is suspended. You cannot accept rides.");
        }
        if (ride.driverId) {
            throw new Error("This ride has already been accepted.");
        }
        ride.driverId = decodedToken.userId;
        ride.ridestatus = ride_interface_1.RideStatus.ACCEPTED;
        yield ride.save();
        yield driver_model_1.default.findByIdAndUpdate(decodedToken.userId, {
            currentRide: ride._id,
            $addToSet: { Ridehistory: ride._id },
        }, { new: true });
        return ride;
    }
    // Check if current driver is the one assigned
    if (((_a = ride.driverId) === null || _a === void 0 ? void 0 : _a.toString()) !== decodedToken.userId) {
        throw new Error("You are not authorized to update this ride.");
    }
    // Step 2: -------------------------------- PICKEDUP --------------------------
    if (status === ride_interface_1.RideStatus.PICKEDUP) {
        ride.ridestatus = ride_interface_1.RideStatus.PICKEDUP;
        if (!ride.startedAt) {
            ride.startedAt = new Date();
        }
        yield ride.save();
    }
    // Step 3: ------------------------------- INTRANSIT --------------------------
    else if (status === ride_interface_1.RideStatus.INTRANSIT) {
        ride.ridestatus = ride_interface_1.RideStatus.INTRANSIT;
        yield ride.save();
    }
    // Step 4: ------------------------------ COMPLETED --------------------------
    else if (status === ride_interface_1.RideStatus.COMPLETED) {
        ride.ridestatus = ride_interface_1.RideStatus.COMPLETED;
        if (!ride.completedAt) {
            ride.completedAt = new Date();
        }
        yield ride.save();
        yield driver_model_1.default.findByIdAndUpdate(decodedToken.userId, {
            $inc: { earnings: ride.price || 0 },
            $set: { currentRide: null },
        });
    }
    return ride;
});
//  ride status updated by rider
const updateRideStatusRiderService = (rideId, status, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.default.findById(rideId);
    if (!ride) {
        throw new Error("Ride not found");
    }
    // Check if the logged-in user is the owner (rider)
    if (ride.riderId.toString() !== decodedToken.userId) {
        throw new Error("You are not authorized to cancel this ride");
    }
    if (ride.ridestatus === ride_interface_1.RideStatus.ACCEPTED || ride.ridestatus === ride_interface_1.RideStatus.COMPLETED || ride.ridestatus === ride_interface_1.RideStatus.INTRANSIT || ride.ridestatus === ride_interface_1.RideStatus.PICKEDUP) {
        throw new Error(`Ride is already ${ride.ridestatus}. Not able to cancel now.`);
    }
    if (status === ride_interface_1.RideStatus.CANCELLED) {
        ride.ridestatus = ride_interface_1.RideStatus.CANCELLED;
        yield ride.save();
    }
    return ride;
});
//  for admin to update everything in a ride
const updateRideByAdminService = (rideId, updateData, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Optional: Check if user is admin
    if (decodedToken.role !== "admin") {
        throw new Error("Unauthorized: Only admin can update ride details.");
    }
    const updatedRide = yield ride_model_1.default.findByIdAndUpdate(rideId, { $set: updateData }, { new: true });
    if (!updatedRide) {
        throw new Error("Ride not found");
    }
    return updatedRide;
});
const getSingleRideAdminService = (rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.default.findById(rideId)
        .populate("driverId", "name email")
        .populate("riderId", "name email");
    if (!ride) {
        throw new Error("Ride not found");
    }
    return ride;
});
exports.getSingleRideAdminService = getSingleRideAdminService;
const getRiderRideHistoryService = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.default.find({ riderId: decodedToken.userId }).sort({ createdAt: -1 }).populate("driverId", "name email");
    return rides;
});
const getDriverRideHistoryService = (decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.default.find({ driverId: decodedToken.userId }).sort({ createdAt: -1 }).populate("riderId", "name email");
    return rides;
});
exports.RideServices = {
    //for riders
    updateRideStatusRiderService,
    createRideService,
    // for driver and riders
    getMyRideService,
    // for drivers
    updateRideStatusDriverService,
    getAllRequestedRideService,
    // for admin
    updateRideByAdminService,
    getAllRideService,
    getSingleRideAdminService: exports.getSingleRideAdminService,
    // for ride history
    getRiderRideHistoryService,
    getDriverRideHistoryService,
};

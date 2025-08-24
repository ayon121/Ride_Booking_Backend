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
exports.RideControllers = void 0;
const sendResponse_1 = require("../../utils/sendResponse");
const ride_service_1 = require("./ride.service");
const user_model_1 = require("../user/user.model");
const user_interface_1 = require("../user/user.interface");
const ride_interface_1 = require("./ride.interface");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const ride_model_1 = __importDefault(require("./ride.model"));
const RequestRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = req.user;
        const ride = yield ride_service_1.RideServices.createRideService(req.body, decodedToken);
        if (ride) {
            yield user_model_1.User.findByIdAndUpdate(decodedToken.userId, {
                $push: { Ridehistory: ride._id },
                $set: { currentRide: ride._id },
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Ride Requested Successfully",
            data: ride,
        });
    }
    catch (error) {
        next(error);
    }
});
const getAllRides = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const builder = new QueryBuilder_1.QueryBuilder(ride_model_1.default.find().populate("riderId", "name email").populate("driverId", "name email"), req.query);
        builder.filter().search(['pickupLocation', 'dropLocation', 'paymentMethod']).sort().fields().paginate();
        const ride = yield builder.build();
        const meta = yield builder.getMeta();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "All Rides Fetched Successfully",
            data: ride,
            meta,
        });
    }
    catch (err) {
        next(err);
    }
});
const getAllRideRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield ride_service_1.RideServices.getAllRequestedRideService();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "All Ride Requests Fetched Successfully",
            data: result.data,
            meta: result.meta,
        });
    }
    catch (err) {
        next(err);
    }
});
const getMyRideController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = req.user;
        const result = yield ride_service_1.RideServices.getMyRideService(decodedToken);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "All Ride Requests Fetched Successfully",
            data: result.data,
            meta: result.meta,
        });
    }
    catch (err) {
        next(err);
    }
});
const updateRideStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rideId } = req.params;
        const { status } = req.body;
        const decodedToken = req.user;
        let updatedRide = null;
        // Ensure only drivers can update status
        if (decodedToken.role === user_interface_1.Role.DRIVER) {
            // drivers not able to cancel
            if (status === ride_interface_1.RideStatus.CANCELLED) {
                return res.status(403).json({ success: false, message: "Only Rider can cancel Ride " });
            }
            updatedRide = yield ride_service_1.RideServices.updateRideStatusDriverService(rideId, status, decodedToken);
        }
        if (decodedToken.role === user_interface_1.Role.USER) {
            // drivers not able to cancel
            if (status !== ride_interface_1.RideStatus.CANCELLED) {
                return res.status(403).json({ success: false, message: "You are not allowed" });
            }
            updatedRide = yield ride_service_1.RideServices.updateRideStatusRiderService(rideId, status, decodedToken);
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Ride Status Updated Successfully",
            data: updatedRide,
        });
    }
    catch (error) {
        next(error);
    }
});
const updateRideByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rideId } = req.params;
        const updateData = req.body;
        const decodedToken = req.user;
        const ride = yield ride_service_1.RideServices.updateRideByAdminService(rideId, updateData, decodedToken);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Ride updated successfully by admin",
            data: ride,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleRideAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rideId } = req.params;
        const ride = yield ride_service_1.RideServices.getSingleRideAdminService(rideId);
        res.status(200).json({ success: true, data: ride });
    }
    catch (error) {
        next(error);
    }
});
const getRideHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = req.user;
        let rideHistory = null;
        if (decodedToken.role === user_interface_1.Role.USER) {
            rideHistory = yield ride_service_1.RideServices.getRiderRideHistoryService(decodedToken);
        }
        if (decodedToken.role === user_interface_1.Role.DRIVER) {
            rideHistory = yield ride_service_1.RideServices.getDriverRideHistoryService(decodedToken);
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Ride History Fetched Successfully",
            data: rideHistory,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.RideControllers = {
    // for rider
    RequestRide,
    // for driver
    getAllRideRequests,
    // for rider and driver
    updateRideStatus,
    getMyRideController,
    // for admin
    updateRideByAdmin,
    getAllRides,
    getSingleRideAdmin,
    // for ride history
    getRideHistory,
};

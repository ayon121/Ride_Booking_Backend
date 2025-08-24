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
exports.DriverControllers = exports.getDriverAnalytics = void 0;
const driver_service_1 = require("./driver.service");
const sendResponse_1 = require("../../utils/sendResponse");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const driver_model_1 = __importDefault(require("./driver.model"));
const createDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield driver_service_1.DriverServices.createDriverService(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Driver Created Successfully",
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
});
const UpdateDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        const decodedToken = req.user;
        const user = yield driver_service_1.DriverServices.UpdateDriverService(payload, decodedToken);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Driver Updated Successfully",
            data: user,
        });
    }
    catch (err) {
        next(err);
    }
});
const getDriverAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const decodedToken = req.user;
    try {
        const driver = yield driver_model_1.default.findById(decodedToken.userId)
            .populate("currentRide")
            .populate("Ridehistory");
        if (!driver) {
            return res.status(404).json({ message: "Driver not found" });
        }
        const analytics = {
            name: driver.name,
            email: driver.email,
            isOnline: driver.isOnline,
            isActive: driver.isActive,
            isOnRide: driver.isOnRide,
            totalRides: driver.totalRides,
            earnings: driver.earnings,
            rating: driver.rating,
            completedRides: ((_a = driver.Ridehistory) === null || _a === void 0 ? void 0 : _a.length) || 0,
            currentRide: driver.currentRide || null,
        };
        return res.status(200).json({ success: true, data: analytics });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        next(err);
    }
});
exports.getDriverAnalytics = getDriverAnalytics;
// for admin
const getAllDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const builder = new QueryBuilder_1.QueryBuilder(driver_model_1.default.find(), req.query);
        builder.filter().search(['name', 'email']).sort().fields().paginate();
        const driver = yield builder.build();
        const meta = yield builder.getMeta();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "All Driver Fetched Successfully",
            data: driver,
            meta,
        });
    }
    catch (err) {
        next(err);
    }
});
const updateDriverByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.params;
        const updateData = req.body;
        const driver = yield driver_service_1.DriverServices.updateDriverByAdminService(driverId, updateData);
        res.status(200).json({
            success: true,
            message: "Driver updated successfully",
            data: driver,
        });
    }
    catch (error) {
        next(error);
    }
});
const getSingleDriverByAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { driverId } = req.params;
        const driver = yield driver_service_1.DriverServices.getSingleDriverByAdminService(driverId);
        res.status(200).json({
            success: true,
            message: "Driver fetched successfully",
            data: driver,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.DriverControllers = {
    createDriver,
    UpdateDriver,
    // for admin
    getAllDriver,
    updateDriverByAdmin,
    getSingleDriverByAdmin
};

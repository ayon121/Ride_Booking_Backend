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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverServices = void 0;
const env_1 = require("../../Config/env");
const AppError_1 = __importDefault(require("../../ErrorHelpers/AppError"));
const user_interface_1 = require("../user/user.interface");
const driver_model_1 = __importDefault(require("./driver.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createDriverService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isDriverExist = yield driver_model_1.default.findOne({ email });
    if (isDriverExist) {
        throw new AppError_1.default(500, "Driver Already Exist");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT));
    const autProvider = { provider: "credentials", providerid: email };
    const driver = yield driver_model_1.default.create(Object.assign({ email: email, password: hashPassword, auths: [autProvider] }, rest));
    return driver;
});
const getAllDriverService = () => __awaiter(void 0, void 0, void 0, function* () {
    const drivers = yield driver_model_1.default.find({});
    const totalUsers = yield driver_model_1.default.countDocuments();
    return {
        data: drivers,
        meta: {
            total: totalUsers
        }
    };
});
const UpdateDriverService = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifDriverExist = yield driver_model_1.default.findById(decodedToken.userId);
    if (!ifDriverExist) {
        throw new AppError_1.default(404, "Driver not found");
    }
    // Prevent role change unless by high-privileged roles
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDelete || payload.isVerified || payload.isApproved || payload.isSuspended) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    // Password hashing
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT));
    }
    const updatedDriver = yield driver_model_1.default.findByIdAndUpdate(decodedToken.userId, payload, {
        new: true,
        runValidators: true,
    });
    return updatedDriver;
});
const updateDriverByAdminService = (driverId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedDriver = yield driver_model_1.default.findByIdAndUpdate(driverId, { $set: updateData }, { new: true });
    if (!updatedDriver) {
        throw new Error("Driver not found");
    }
    return updatedDriver;
});
const getSingleDriverByAdminService = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.default.findById(driverId);
    if (!driver) {
        throw new Error("Driver not found");
    }
    return driver;
});
exports.DriverServices = {
    createDriverService,
    getAllDriverService,
    UpdateDriverService,
    // for admin
    updateDriverByAdminService,
    getSingleDriverByAdminService
};

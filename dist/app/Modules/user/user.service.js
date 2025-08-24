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
exports.UserServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const env_1 = require("../../Config/env");
const AppError_1 = __importDefault(require("../../ErrorHelpers/AppError"));
const user_interface_1 = require("./user.interface");
const user_model_1 = require("./user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const ride_model_1 = __importDefault(require("../ride/ride.model"));
const driver_model_1 = __importDefault(require("../driver/driver.model"));
const createUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload, rest = __rest(payload, ["email", "password"]);
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (isUserExist) {
        throw new AppError_1.default(500, "User Already Exist");
    }
    const hashPassword = yield bcryptjs_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT));
    const autProvider = { provider: "credentials", providerid: email };
    const user = yield user_model_1.User.create(Object.assign({ email: email, password: hashPassword, auths: [autProvider] }, rest));
    return user;
});
const getAllUserService = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find({});
    const totalUsers = yield user_model_1.User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
});
const UpdateUserService = (payload, decodedToken) => __awaiter(void 0, void 0, void 0, function* () {
    const ifUserExist = yield user_model_1.User.findById(decodedToken.userId);
    if (!ifUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "User Not Found");
    }
    if (payload.role) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.isActive || payload.isDelete || payload.isVerified) {
        if (decodedToken.role === user_interface_1.Role.USER || decodedToken.role === user_interface_1.Role.DRIVER) {
            throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "You are not authorized");
        }
    }
    if (payload.password) {
        payload.password = yield bcryptjs_1.default.hash(payload.password, Number(env_1.envVars.BCRYPT_SALT));
    }
    const newUpdatedUser = yield user_model_1.User.findByIdAndUpdate(decodedToken.userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
});
const updateUserByAdminService = (userId, updateData // Allow updating any field in the user
) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
    if (!updatedUser) {
        throw new Error("User not found");
    }
    return updatedUser;
});
const getSingleUserByAdminService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId).select("-password"); // remove password for safety
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
const getAdminAnalyticsService = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const totalUsers = yield user_model_1.User.countDocuments();
    const totalDrivers = yield driver_model_1.default.countDocuments();
    const totalRides = yield ride_model_1.default.countDocuments();
    const totalEarningsData = yield driver_model_1.default.aggregate([
        {
            $group: {
                _id: null,
                total: { $sum: "$earnings" }
            }
        }
    ]);
    const totalEarnings = ((_a = totalEarningsData[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
    const activeRides = yield ride_model_1.default.countDocuments({
        ridestatus: { $nin: ["COMPLETED", "CANCELLED"] }
    });
    return {
        totalUsers,
        totalDrivers,
        totalRides,
        totalEarnings,
        activeRides,
    };
});
exports.UserServices = {
    createUserService,
    getAllUserService,
    UpdateUserService,
    // for admin
    updateUserByAdminService,
    getSingleUserByAdminService,
    getAdminAnalyticsService,
};
//route => controllers => service => model => DB

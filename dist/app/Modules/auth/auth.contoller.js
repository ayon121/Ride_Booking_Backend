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
exports.AuthControllers = void 0;
const sendResponse_1 = require("../../utils/sendResponse");
const auth_service_1 = require("./auth.service");
const AppError_1 = __importDefault(require("../../ErrorHelpers/AppError"));
const setcookie_1 = require("../../utils/setcookie");
const usertoken_1 = require("../../utils/usertoken");
const env_1 = require("../../Config/env");
const catchAsync_1 = require("../../utils/catchAsync");
const passport_1 = __importDefault(require("passport"));
const user_model_1 = require("../user/user.model");
const driver_model_1 = __importDefault(require("../driver/driver.model"));
const user_interface_1 = require("../user/user.interface");
const creadentialUserLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(new AppError_1.default(401, info.message));
            }
            const userTokens = (0, usertoken_1.CreateUserToken)(user);
            const _a = user.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
            (0, setcookie_1.setAuthCookie)(res, userTokens);
            (0, sendResponse_1.sendResponse)(res, {
                success: true,
                statusCode: 201,
                message: `${(rest === null || rest === void 0 ? void 0 : rest.role) || "User"} Logged In Successfully`,
                data: {
                    accesstoken: userTokens.accesstoken,
                    refreshtoken: userTokens.refreshtoken,
                    user: rest
                }
            });
        }))(req, res, next);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
const creadentialDriverLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        passport_1.default.authenticate("local-driver", (err, driver, info) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next(err);
            }
            if (!driver) {
                return next(new AppError_1.default(401, info.message));
            }
            const driverTokens = (0, usertoken_1.CreateUserToken)(driver);
            const _a = driver.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
            (0, setcookie_1.setAuthCookie)(res, driverTokens);
            (0, sendResponse_1.sendResponse)(res, {
                success: true,
                statusCode: 201,
                message: `${(rest === null || rest === void 0 ? void 0 : rest.role) || "Driver"} Logged In Successfully`,
                data: {
                    accesstoken: driverTokens.accesstoken,
                    refreshtoken: driverTokens.refreshtoken,
                    driver: rest
                }
            });
        }))(req, res, next);
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
const getNewAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshtoken;
        if (!refreshToken) {
            throw new AppError_1.default(500, "No Refresh Token");
        }
        const tokenInfo = yield auth_service_1.AuthServices.getNewAccessToken(refreshToken);
        (0, setcookie_1.setAuthCookie)(res, tokenInfo);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "New Access Token Retrive Successfully",
            data: tokenInfo
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie("accesstoken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        res.clearCookie("refreshtoken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "User Logged out Successfully",
            data: null
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
const resetPasswordUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        const decodedToken = req.user;
        yield auth_service_1.AuthServices.resetPasswordUser(oldPassword, newPassword, decodedToken);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Password Changed Successfully",
            data: null
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
const resetPasswordDriver = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        const decodedToken = req.user;
        yield auth_service_1.AuthServices.resetPasswordDriver(oldPassword, newPassword, decodedToken);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Password Changed Successfully",
            data: null
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
});
// for user --- for future implementation
const googleCallbackController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(404, "User Not Found");
    }
    const tokenInfo = (0, usertoken_1.CreateUserToken)(user);
    (0, setcookie_1.setAuthCookie)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
//  user ---- driver profile system 
const getMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decodedToken = req.user;
        if (!decodedToken.userId || !decodedToken.role) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let profile = null;
        if (decodedToken.role === user_interface_1.Role.USER) {
            profile = yield user_model_1.User.findById(decodedToken.userId).select("-password");
        }
        else if (decodedToken.role === user_interface_1.Role.DRIVER) {
            profile = yield driver_model_1.default.findById(decodedToken.userId).select("-password");
        }
        else if (decodedToken.role === user_interface_1.Role.ADMIN || decodedToken.role === user_interface_1.Role.SUPER_ADMIN) {
            profile = yield user_model_1.User.findById(decodedToken.userId).select("-password");
        }
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Profile Fetched Successfully",
            data: profile
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AuthControllers = {
    creadentialUserLogin,
    creadentialDriverLogin,
    getNewAccessToken,
    logout,
    resetPasswordUser,
    resetPasswordDriver,
    googleCallbackController,
    getMe
};

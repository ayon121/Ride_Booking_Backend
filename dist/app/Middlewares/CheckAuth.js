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
exports.checkAuth = void 0;
const AppError_1 = __importDefault(require("../ErrorHelpers/AppError"));
const env_1 = require("../Config/env");
const jwt_1 = require("../utils/jwt");
const user_model_1 = require("../Modules/user/user.model");
const user_interface_1 = require("../Modules/user/user.interface");
const driver_model_1 = __importDefault(require("../Modules/driver/driver.model"));
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accesstoken = req.cookies.accesstoken;
        if (!accesstoken) {
            throw new AppError_1.default(404, "User Not Verified");
        }
        const verifiedToken = (0, jwt_1.verifyToken)(accesstoken, env_1.envVars.JWT_SECRET);
        // // eslint-disable-next-line no-console
        // console.log(verifiedToken);
        if (!verifiedToken) {
            throw new AppError_1.default(403, "User Not Verified");
        }
        let isUserExist = null;
        if (verifiedToken.role === "DRIVER") {
            isUserExist = yield driver_model_1.default.findOne({ email: verifiedToken.email });
        }
        else {
            isUserExist = yield user_model_1.User.findOne({ email: verifiedToken.email });
        }
        if (!isUserExist) {
            throw new AppError_1.default(500, "User Doesn't Exist");
        }
        if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
            throw new AppError_1.default(500, `User is ${isUserExist.isActive}`);
        }
        if (isUserExist.isDelete) {
            throw new AppError_1.default(500, "User is Deleted");
        }
        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError_1.default(403, "User Not Permitted");
        }
        req.user = verifiedToken;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.checkAuth = checkAuth;

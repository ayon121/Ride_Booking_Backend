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
exports.createNewAcessTokenWithRefreshToken = exports.CreateUserToken = void 0;
const env_1 = require("../Config/env");
const AppError_1 = __importDefault(require("../ErrorHelpers/AppError"));
const user_interface_1 = require("../Modules/user/user.interface");
const user_model_1 = require("../Modules/user/user.model");
const jwt_1 = require("./jwt");
const CreateUserToken = (user) => {
    const jwtPayload = {
        userId: user._id,
        email: user.email,
        role: user.role
    };
    const accesstoken = (0, jwt_1.createToken)(jwtPayload, env_1.envVars.JWT_SECRET, env_1.envVars.Jwt_ACCESS_EXPIRES);
    const refreshtoken = (0, jwt_1.createToken)(jwtPayload, env_1.envVars.Jwt_REFRESH_SECRET, env_1.envVars.Jwt_REFRESH_EXPRIES);
    return {
        accesstoken,
        refreshtoken
    };
};
exports.CreateUserToken = CreateUserToken;
const createNewAcessTokenWithRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedRefreshToken = (0, jwt_1.verifyToken)(refreshToken, env_1.envVars.Jwt_REFRESH_SECRET);
    const isUserExist = yield user_model_1.User.findOne({ email: verifiedRefreshToken.email });
    if (!isUserExist) {
        throw new AppError_1.default(500, "User Doesn't Exist");
    }
    if (isUserExist.isActive === user_interface_1.IsActive.BLOCKED || isUserExist.isActive === user_interface_1.IsActive.INACTIVE) {
        throw new AppError_1.default(500, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDelete) {
        throw new AppError_1.default(500, "User is Deleted");
    }
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    };
    const accesstoken = (0, jwt_1.createToken)(jwtPayload, env_1.envVars.JWT_SECRET, env_1.envVars.Jwt_ACCESS_EXPIRES);
    return accesstoken;
});
exports.createNewAcessTokenWithRefreshToken = createNewAcessTokenWithRefreshToken;

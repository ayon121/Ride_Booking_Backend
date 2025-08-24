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
exports.SeedSuperAdmin = void 0;
/* eslint-disable no-console */
const env_1 = require("../Config/env");
const user_interface_1 = require("../Modules/user/user.interface");
const user_model_1 = require("../Modules/user/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SeedSuperAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isSuperAdminExist = yield user_model_1.User.findOne({ email: env_1.envVars.SUPER_ADMIN_EMAIL });
        if (isSuperAdminExist) {
            console.log("Super Admin Exists");
            return;
        }
        console.log("Try To Create Super Admin ........");
        const hashPassword = yield bcryptjs_1.default.hash(env_1.envVars.SUPER_ADMIN_PASS, Number(env_1.envVars.BCRYPT_SALT));
        const authProvider = {
            provider: "credentials",
            providerid: env_1.envVars.SUPER_ADMIN_EMAIL,
        };
        const payload = {
            name: "Super Admin",
            email: env_1.envVars.SUPER_ADMIN_EMAIL,
            role: user_interface_1.Role.SUPER_ADMIN,
            password: hashPassword,
            isVerified: true,
            auths: [authProvider]
        };
        const superadmin = yield user_model_1.User.create(payload);
        console.log("Super Admin Created");
        console.log(superadmin);
    }
    catch (err) {
        console.log(err);
    }
});
exports.SeedSuperAdmin = SeedSuperAdmin;

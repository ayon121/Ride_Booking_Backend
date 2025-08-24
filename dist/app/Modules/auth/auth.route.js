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
exports.AuthRoutes = void 0;
const express_1 = require("express");
const auth_contoller_1 = require("./auth.contoller");
const CheckAuth_1 = require("../../Middlewares/CheckAuth");
const user_interface_1 = require("../user/user.interface");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
router.post("/user/login", auth_contoller_1.AuthControllers.creadentialUserLogin);
router.post("/driver/login", auth_contoller_1.AuthControllers.creadentialDriverLogin);
router.post("/refresh-token", auth_contoller_1.AuthControllers.getNewAccessToken);
router.post("/logout", auth_contoller_1.AuthControllers.logout);
router.patch("/user/reset-password", (0, CheckAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_contoller_1.AuthControllers.resetPasswordUser);
router.patch("/driver/reset-password", (0, CheckAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_contoller_1.AuthControllers.resetPasswordDriver);
router.get("/me", (0, CheckAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), auth_contoller_1.AuthControllers.getMe);
// google login for users
router.get("/google", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirect = req.query.redirect || "/";
    passport_1.default.authenticate("google", { scope: ["profile", "email"], state: redirect })(req, res, next);
}));
// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login" }), auth_contoller_1.AuthControllers.googleCallbackController);
exports.AuthRoutes = router;

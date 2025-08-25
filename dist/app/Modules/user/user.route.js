"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Userrouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = require("../../Middlewares/validateRequest");
const user_validation_1 = require("./user.validation");
const CheckAuth_1 = require("../../Middlewares/CheckAuth");
const user_interface_1 = require("./user.interface");
exports.Userrouter = (0, express_1.Router)();
exports.Userrouter.post("/register", (0, validateRequest_1.validateRequest)(user_validation_1.createUserZodSchema), user_controller_1.UserControllers.createUser);
exports.Userrouter.patch("/update", (0, CheckAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), user_controller_1.UserControllers.UpdateUser);
// admin or super admin routes
exports.Userrouter.get("/all-users", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getAllUser);
exports.Userrouter.patch("/update-users/:userId", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.updateUserByAdmin);
exports.Userrouter.get("/dashboard/admin", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getAdminAnalytics);
exports.Userrouter.get("/:userId", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), user_controller_1.UserControllers.getSingleUserByAdmin);

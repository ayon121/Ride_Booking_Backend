"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverRoutes = void 0;
const express_1 = __importDefault(require("express"));
const driver_validation_1 = require("./driver.validation");
const driver_controller_1 = require("./driver.controller");
const validateRequest_1 = require("../../Middlewares/validateRequest");
const user_interface_1 = require("../user/user.interface");
const CheckAuth_1 = require("../../Middlewares/CheckAuth");
const router = express_1.default.Router();
router.get("/analytics", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.getDriverAnalytics);
router.post("/register", (0, validateRequest_1.validateRequest)(driver_validation_1.createDriverZodSchema), driver_controller_1.DriverControllers.createDriver);
router.patch("/updateprofile", (0, validateRequest_1.validateRequest)(driver_validation_1.updateDriverZodSchema), (0, CheckAuth_1.checkAuth)(user_interface_1.Role.DRIVER), driver_controller_1.DriverControllers.UpdateDriver);
// admin or super admin routes
router.get("/alldrivers", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), driver_controller_1.DriverControllers.getAllDriver);
router.patch("/updatedriver/:driverId", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), driver_controller_1.DriverControllers.updateDriverByAdmin);
router.get("/:driverId", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), driver_controller_1.DriverControllers.getSingleDriverByAdmin);
exports.DriverRoutes = router;

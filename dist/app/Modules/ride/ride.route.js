"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rideroute = void 0;
const express_1 = __importDefault(require("express"));
const ride_controller_1 = require("./ride.controller");
const CheckAuth_1 = require("../../Middlewares/CheckAuth");
const user_interface_1 = require("../user/user.interface");
exports.Rideroute = express_1.default.Router();
// for users
exports.Rideroute.post("/request", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.USER), ride_controller_1.RideControllers.RequestRide);
// for drivers
exports.Rideroute.get("/request", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.DRIVER), ride_controller_1.RideControllers.getAllRideRequests);
// get my current ride
exports.Rideroute.get("/me", (0, CheckAuth_1.checkAuth)(...Object.values(user_interface_1.Role)), ride_controller_1.RideControllers.getMyRideController);
// get ride history for riders and drivers
exports.Rideroute.get("/history", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.USER, user_interface_1.Role.DRIVER), ride_controller_1.RideControllers.getRideHistory);
// update ride status -- for drivers -- for riders
exports.Rideroute.patch("/status/:rideId", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.DRIVER, user_interface_1.Role.USER), ride_controller_1.RideControllers.updateRideStatus);
// admin or super admin routes
exports.Rideroute.get("/all", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), ride_controller_1.RideControllers.getAllRides);
exports.Rideroute.patch("/updateride/:rideId", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), ride_controller_1.RideControllers.updateRideByAdmin);
exports.Rideroute.get("/singleride/:rideId", (0, CheckAuth_1.checkAuth)(user_interface_1.Role.ADMIN, user_interface_1.Role.SUPER_ADMIN), ride_controller_1.RideControllers.getSingleRideAdmin);

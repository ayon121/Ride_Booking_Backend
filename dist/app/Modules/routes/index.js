"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../user/user.route");
const auth_route_1 = require("../auth/auth.route");
const driver_route_1 = require("../driver/driver.route");
const ride_route_1 = require("../ride/ride.route");
const contact_route_1 = __importDefault(require("../contact/contact.route"));
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.Userrouter
    },
    {
        path: "/driver",
        route: driver_route_1.DriverRoutes
    },
    {
        path: "/rides",
        route: ride_route_1.Rideroute
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/contact",
        route: contact_route_1.default
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});

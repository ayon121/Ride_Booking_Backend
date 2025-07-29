import express from "express";
import { RideControllers } from "./ride.controller";
import { checkAuth } from "../../Middlewares/CheckAuth";
import { Role } from "../user/user.interface";


export const Rideroute = express.Router();

Rideroute.post("/request", checkAuth(Role.USER) , RideControllers.RequestRide )

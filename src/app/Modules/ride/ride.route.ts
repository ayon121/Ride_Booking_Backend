import express from "express";
import { RideControllers } from "./ride.controller";
import { checkAuth } from "../../Middlewares/CheckAuth";
import { Role } from "../user/user.interface";


export const Rideroute = express.Router();

// for users
Rideroute.post("/request", checkAuth(Role.USER) , RideControllers.RequestRide )
// for drivers
Rideroute.get("/request", checkAuth(Role.DRIVER) , RideControllers.getAllRideRequests )


// get my current ride
Rideroute.get("/me", checkAuth(...Object.values(Role)) , RideControllers.getMyRideController )
// get ride history for riders and drivers
Rideroute.get("/history", checkAuth(Role.USER , Role.DRIVER) , RideControllers.getRideHistory )


// update ride status -- for drivers -- for riders
Rideroute.patch("/status/:rideId" ,  checkAuth(Role.DRIVER , Role.USER) ,RideControllers.updateRideStatus)




// admin or super admin routes
Rideroute.get("/all", checkAuth(Role.ADMIN , Role.SUPER_ADMIN) , RideControllers.getAllRides )
Rideroute.patch("/updateride/:rideId", checkAuth(Role.ADMIN , Role.SUPER_ADMIN) , RideControllers.updateRideByAdmin )
Rideroute.get("/singleride/:rideId", checkAuth(Role.ADMIN , Role.SUPER_ADMIN) , RideControllers.getSingleRideAdmin )

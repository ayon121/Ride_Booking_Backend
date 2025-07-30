import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { RideServices } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";



const RequestRide = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req.user as JwtPayload
        const ride = await RideServices.createRideService(req.body, decodedToken)


        if (ride) {
            await User.findByIdAndUpdate(decodedToken.userId, {
                $push: { Ridehistory: ride._id },
                $set: { currentRide: ride._id },
            });
        }

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Ride Requested Successfully",
            data: ride,

        })

    } catch (error) {
        next(error);
    }
};



const getAllRides = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await RideServices.getAllRideService()
        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "All Rides Fetched Successfully",
            data : result.data,
            meta : result.meta,
        })


    } catch (err) {
        next(err)


    }
}
const getAllRideRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await RideServices.getAllRequestedRideService()
        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "All Ride Requests Fetched Successfully",
            data : result.data,
            meta : result.meta,
        })


    } catch (err) {
        next(err)


    }
}



const getMyRideController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req.user as JwtPayload
        const result = await RideServices.getMyRideService(decodedToken )
        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "All Ride Requests Fetched Successfully",
            data : result.data,
            meta : result.meta,
        })


    } catch (err) {
        next(err)


    }
}



export const RideControllers = {
    RequestRide,
    getAllRides,
    getAllRideRequests,
    getMyRideController,
}
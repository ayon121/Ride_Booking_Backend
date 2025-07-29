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



export const RideControllers = {
    RequestRide
}
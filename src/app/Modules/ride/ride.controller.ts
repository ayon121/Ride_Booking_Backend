import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { RideServices } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../user/user.model";
import { Role } from "../user/user.interface";
import { RideStatus } from "./ride.interface";
import { QueryBuilder } from "../../utils/QueryBuilder";
import Ride from "./ride.model";



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

        const builder = new QueryBuilder(Ride.find().populate("riderId", "name email").populate("driverId", "name email"), req.query as Record<string, string>);
        builder.filter().search(['pickupLocation', 'dropLocation', 'paymentMethod']).sort().fields().paginate();

        const ride = await builder.build();
        const meta = await builder.getMeta();

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "All Rides Fetched Successfully",
            data: ride,
            meta,
        })


    } catch (err) {
        next(err)


    }
}
const getAllRideRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await RideServices.getAllRequestedRideService()
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "All Ride Requests Fetched Successfully",
            data: result.data,
            meta: result.meta,
        })


    } catch (err) {
        next(err)


    }
}



const getMyRideController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req.user as JwtPayload
        const result = await RideServices.getMyRideService(decodedToken)
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "All Ride Requests Fetched Successfully",
            data: result.data,
            meta: result.meta,
        })


    } catch (err) {
        next(err)


    }
}




const updateRideStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rideId } = req.params;
        const { status } = req.body;

        const decodedToken = req.user as JwtPayload;

        let updatedRide = null

        // Ensure only drivers can update status
        if (decodedToken.role === Role.DRIVER) {

            // drivers not able to cancel
            if (status === RideStatus.CANCELLED) {
                return res.status(403).json({ success: false, message: "Only Rider can cancel Ride " });
            }
            updatedRide = await RideServices.updateRideStatusDriverService(rideId, status, decodedToken);

        }

        if (decodedToken.role === Role.USER) {

            // drivers not able to cancel
            if (status !== RideStatus.CANCELLED) {
                return res.status(403).json({ success: false, message: "You are not allowed" });
            }
            updatedRide = await RideServices.updateRideStatusRiderService(rideId, status, decodedToken);

        }





        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Ride Status Updated Successfully",
            data: updatedRide,
        })
    } catch (error) {
        next(error);
    }
};



const updateRideByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rideId } = req.params;
        const updateData = req.body;
        const decodedToken = req.user as JwtPayload;

        const ride = await RideServices.updateRideByAdminService(rideId, updateData, decodedToken);


        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Ride updated successfully by admin",
            data: ride,
        })
    } catch (error) {
        next(error);
    }
};



const getSingleRideAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rideId } = req.params;
        const ride = await RideServices.getSingleRideAdminService(rideId);
        res.status(200).json({ success: true, data: ride });
    } catch (error) {
        next(error);
    }
};


const getRideHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const decodedToken = req.user as JwtPayload;

        let rideHistory = null

        if (decodedToken.role === Role.USER) {
            rideHistory = await RideServices.getRiderRideHistoryService(decodedToken);
        }
        if (decodedToken.role === Role.DRIVER) {
            rideHistory = await RideServices.getDriverRideHistoryService(decodedToken);
        }


        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Ride History Fetched Successfully",
            data: rideHistory,
        })

    } catch (error) {
        next(error);
    }
};








export const RideControllers = {
    // for rider
    RequestRide,


    // for driver
    getAllRideRequests,


    // for rider and driver
    updateRideStatus,
    getMyRideController,

    // for admin
    updateRideByAdmin,
    getAllRides,
    getSingleRideAdmin,

    // for ride history
    getRideHistory,
}
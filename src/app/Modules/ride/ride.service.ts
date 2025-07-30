import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHelpers/AppError";
import { IRide } from "./ride.interface";
import Ride from "./ride.model";
import { User } from "../user/user.model";
import Driver from "../driver/driver.model";
import { Role } from "../user/user.interface";


const createRideService = async (payload: Partial<IRide> , decodedToken: JwtPayload) => {

    
    const riderId = decodedToken?.userId
    const { pickupLocation , dropLocation , price  } = payload;

    if (!riderId || !pickupLocation || !dropLocation || !price) {
        throw new AppError(500 ,"Required ride fields are missing");
    }

    const ride = await Ride.create({
        riderId,
        pickupLocation,
        dropLocation,
        price,
        requestedAt: new Date(),
    });


    return ride
}



// all requested rides for drivers
const getAllRequestedRideService = async () => {
    const rides = await Ride.find({ ridestatus: "REQUESTED" })

    const TotalRideRequest = await Ride.countDocuments({ ridestatus: "REQUESTED" })

    return {
        data: rides,
        meta: {
            total: TotalRideRequest
        }
    }
}


const getMyRideService = async (decodedToken : JwtPayload) => {

    let currentRideId = null;

    // eslint-disable-next-line no-console
    console.log(decodedToken);
    if (decodedToken.role === Role.USER) {
        const user = await User.findById(decodedToken.userId).select("currentRide");
        currentRideId = user?.currentRide;
    } else if (decodedToken.role === Role.DRIVER) {
        const driver = await Driver.findById(decodedToken.userId).select("currentRide");
        currentRideId = driver?.currentRide;
    }


     if (!currentRideId) {
        return {
            data: null,
            meta: {
                message: "No current ride found."
            }
        };
    }

    const ride = await Ride.findById(currentRideId);

    return {
        data: ride,
        meta: {
            message: "Your ride found."
        }
    }
}

// admin or super-admin
const getAllRideService = async () => {
    const rides = await Ride.find({})

    const totalrides = await Ride.countDocuments()

    return {
        data: rides,
        meta: {
            total: totalrides
        }
    }
}

export const RideServices = {
    createRideService,
    getAllRideService,
    getAllRequestedRideService,
    getMyRideService,
}
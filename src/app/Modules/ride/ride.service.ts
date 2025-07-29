import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHelpers/AppError";
import { IRide } from "./ride.interface";
import Ride from "./ride.model";


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


export const RideServices = {
    createRideService,
}
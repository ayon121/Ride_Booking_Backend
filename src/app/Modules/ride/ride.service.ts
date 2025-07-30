import { JwtPayload } from "jsonwebtoken";
import AppError from "../../ErrorHelpers/AppError";
import { IRide, RideStatus } from "./ride.interface";
import Ride from "./ride.model";
import { User } from "../user/user.model";
import Driver from "../driver/driver.model";
import { Role } from "../user/user.interface";


const createRideService = async (payload: Partial<IRide>, decodedToken: JwtPayload) => {


    const riderId = decodedToken?.userId
    const { pickupLocation, dropLocation, price } = payload;

    if (!riderId || !pickupLocation || !dropLocation || !price) {
        throw new AppError(500, "Required ride fields are missing");
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


const getMyRideService = async (decodedToken: JwtPayload) => {

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



//  ride status updated by driver
const updateRideStatusDriverService = async (rideId: string, status: string, decodedToken: JwtPayload) => {
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new Error("Ride not found");
    }


    //  ride accept system
    if (status === RideStatus.ACCEPTED) {
        if (ride.driverId) {
            throw new Error("This ride has already been accepted");
        }
        ride.driverId = decodedToken.userId;
        ride.ridestatus = RideStatus.ACCEPTED;
        await ride.save();


        // 🛠️ Update driver info
        await Driver.findByIdAndUpdate(
            decodedToken.userId,
            {
                currentRide: ride._id,
                $addToSet: { Ridehistory: ride._id }
            },
            { new: true }
        );

        return ride;
    }

    // check if driver is the owner of this ride
    if (ride.driverId?.toString() !== decodedToken.userId) {
        throw new Error("You are not authorized to update this ride.");
    }



    if (status === RideStatus.INTRANSIT) {
        ride.ridestatus = RideStatus.INTRANSIT;
        await ride.save();
    }

    if (status === RideStatus.PICKEDUP) {
        ride.ridestatus = RideStatus.PICKEDUP;
        if (!ride.startedAt) {
            ride.startedAt = new Date();
        }

        await ride.save();
    }

    if (status === RideStatus.COMPLETED) {
        ride.ridestatus = RideStatus.COMPLETED;
        if (!ride.completedAt) {
            ride.completedAt = new Date();
        }
        await ride.save();


        //Clear driver's currentRide and add earnings
        await Driver.findByIdAndUpdate(decodedToken.userId, {
            $inc: { earnings: ride.price || 0 },
            $set: { currentRide: null }
        });


    }

    return ride;
};



//  ride status updated by rider
const updateRideStatusRiderService = async (rideId: string, status: string, decodedToken: JwtPayload) => {
    const ride = await Ride.findById(rideId);


    if (!ride) {
        throw new Error("Ride not found");
    }

    // Check if the logged-in user is the owner (rider)
    if (ride.riderId.toString() !== decodedToken.userId) {
        throw new Error("You are not authorized to cancel this ride");
    }

    if (ride.ridestatus === RideStatus.ACCEPTED || ride.ridestatus === RideStatus.COMPLETED || ride.ridestatus === RideStatus.INTRANSIT || ride.ridestatus === RideStatus.PICKEDUP) {
        throw new Error(`Ride is already ${ride.ridestatus}. Not able to cancel now.`);
    }

    if (status === RideStatus.CANCELLED) {
        ride.ridestatus = RideStatus.CANCELLED;
        await ride.save();
    }

    return ride;
};
export const RideServices = {
    createRideService,
    getAllRideService,
    getAllRequestedRideService,
    getMyRideService,
    // for drivers
    updateRideStatusDriverService,
    //for riders
    updateRideStatusRiderService,
}
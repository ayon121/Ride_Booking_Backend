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

    const existingRide = await Ride.findOne({
        riderId,
        ridestatus: { $nin: ["COMPLETED", "CANCELLED"] }, 
    });

    if (existingRide) {
        throw new AppError(400, "You already have an active ride in progress.");
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
const validStatusFlow: Record<string, string> = {
    [RideStatus.REQUESTED]: RideStatus.ACCEPTED,
    [RideStatus.ACCEPTED]: RideStatus.PICKEDUP,
    [RideStatus.PICKEDUP]: RideStatus.INTRANSIT,
    [RideStatus.INTRANSIT]: RideStatus.COMPLETED,
};

const updateRideStatusDriverService = async (rideId: string, status: string, decodedToken: JwtPayload) => {
    const ride = await Ride.findById(rideId);

    if (!ride) {
        throw new Error("Ride not found");
    }

    const currentStatus = ride.ridestatus;

    // Step-by-step flow check
    const expectedNextStatus = validStatusFlow[currentStatus];
    if (status !== expectedNextStatus) {
        throw new Error(
            `Invalid status transition. Expected '${expectedNextStatus}' after '${currentStatus}', but got '${status}'.`
        );
    }

    // Step 1: ------------------------------- ACCEPTED ----------------------
    if (status === RideStatus.ACCEPTED) {
        const driver = await Driver.findById(decodedToken.userId);

        if (!driver) {
            throw new Error("Driver not found.");
        }

        if (driver.isSuspended) {
            throw new Error("Your account is suspended. You cannot accept rides.");
        }


        if (ride.driverId) {
            throw new Error("This ride has already been accepted.");
        }

        ride.driverId = decodedToken.userId;
        ride.ridestatus = RideStatus.ACCEPTED;
        await ride.save();

        await Driver.findByIdAndUpdate(
            decodedToken.userId,
            {
                currentRide: ride._id,
                $addToSet: { Ridehistory: ride._id },
            },
            { new: true }
        );

        return ride;
    }

    // Check if current driver is the one assigned
    if (ride.driverId?.toString() !== decodedToken.userId) {
        throw new Error("You are not authorized to update this ride.");
    }

    // Step 2: -------------------------------- PICKEDUP --------------------------
    if (status === RideStatus.PICKEDUP) {
        ride.ridestatus = RideStatus.PICKEDUP;
        if (!ride.startedAt) {
            ride.startedAt = new Date();
        }
        await ride.save();
    }

    // Step 3: ------------------------------- INTRANSIT --------------------------
    else if (status === RideStatus.INTRANSIT) {
        ride.ridestatus = RideStatus.INTRANSIT;
        await ride.save();
    }

    // Step 4: ------------------------------ COMPLETED --------------------------
    else if (status === RideStatus.COMPLETED) {
        ride.ridestatus = RideStatus.COMPLETED;
        if (!ride.completedAt) {
            ride.completedAt = new Date();
        }
        await ride.save();

        await Driver.findByIdAndUpdate(decodedToken.userId, {
            $inc: { earnings: ride.price || 0 },
            $set: { currentRide: null },
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



//  for admin to update everything in a ride
const updateRideByAdminService = async (rideId: string, updateData: Partial<IRide>, decodedToken: JwtPayload) => {
    // Optional: Check if user is admin
    if (decodedToken.role !== "admin") {
        throw new Error("Unauthorized: Only admin can update ride details.");
    }

    const updatedRide = await Ride.findByIdAndUpdate(
        rideId,
        { $set: updateData },
        { new: true }
    );

    if (!updatedRide) {
        throw new Error("Ride not found");
    }

    return updatedRide;
};



export const getSingleRideAdminService = async (rideId: string) => {
    const ride = await Ride.findById(rideId)
        .populate("driverId", "name email")
        .populate("riderId", "name email");
    if (!ride) {
        throw new Error("Ride not found");
    }

    return ride;
};


const getRiderRideHistoryService = async (decodedToken: JwtPayload) => {
    const rides = await Ride.find({ riderId: decodedToken.userId }).sort({ createdAt: -1 }).populate("driverId", "name email");
    return rides;
};

const getDriverRideHistoryService = async (decodedToken: JwtPayload) => {
    const rides = await Ride.find({ driverId: decodedToken.userId }).sort({ createdAt: -1 }).populate("riderId", "name email");
    return rides;
};


export const RideServices = {
    //for riders
    updateRideStatusRiderService,
    createRideService,


    // for driver and riders
    getMyRideService,

    // for drivers
    updateRideStatusDriverService,
    getAllRequestedRideService,


    // for admin
    updateRideByAdminService,
    getAllRideService,
    getSingleRideAdminService,


    // for ride history
    getRiderRideHistoryService,
    getDriverRideHistoryService,
}
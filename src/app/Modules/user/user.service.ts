
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../Config/env";
import AppError from "../../ErrorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";
import Ride from "../ride/ride.model";
import Driver from "../driver/driver.model";

const createUserService = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })
    if (isUserExist) {
        throw new AppError(500, "User Already Exist")
    }

    const hashPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT))

    
    const autProvider: IAuthProvider = { provider: "credentials", providerid: email as string }
    const user = await User.create({
        email: email,
        password: hashPassword,
        auths: [autProvider],
        ...rest
    })

    return user
}

const getAllUserService = async () => {
    const users = await User.find({})

    const totalUsers = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}


const UpdateUserService = async ( payload: Partial<IUser>, decodedToken: JwtPayload) => {


    const ifUserExist = await User.findById(decodedToken.userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.FORBIDDEN, "User Not Found")
    }

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }



    if (payload.isActive || payload.isDelete || payload.isVerified) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, Number(envVars.BCRYPT_SALT))
    }

    const newUpdatedUser = await User.findByIdAndUpdate(decodedToken.userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}


const updateUserByAdminService = async (
  userId: string,
  updateData: Partial<IUser> // Allow updating any field in the user
) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

const getSingleUserByAdminService = async (userId: string) => {
  const user = await User.findById(userId).select("-password"); // remove password for safety
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};




const getAdminAnalyticsService = async () => {
  const totalUsers = await User.countDocuments();
  const totalDrivers = await Driver.countDocuments();
  const totalRides = await Ride.countDocuments();

  const totalEarningsData = await Driver.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$earnings" }
      }
    }
  ]);
  const totalEarnings = totalEarningsData[0]?.total || 0;

  const activeRides = await Ride.countDocuments({
    ridestatus: { $nin: ["COMPLETED", "CANCELLED"] }
  });


  return {
    totalUsers,
    totalDrivers,
    totalRides,
    totalEarnings,
    activeRides,
  };

}

export const UserServices = {
    createUserService,
    getAllUserService,
    UpdateUserService,
    // for admin
    updateUserByAdminService,
    getSingleUserByAdminService,
    getAdminAnalyticsService,
}


//route => controllers => service => model => DB
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../Config/env";
import AppError from "../../ErrorHelpers/AppError";
import { IAuthProvider, Role } from "../user/user.interface";
import { IDriverFields } from "./driver.interface";
import Driver from "./driver.model";
import bcrypt from "bcryptjs";
import httpStatus from "http-status-codes";


const createDriverService = async (payload: Partial<IDriverFields>) => {
    const { email, password, ...rest } = payload;

    const isDriverExist = await Driver.findOne({ email })
    if (isDriverExist) {
        throw new AppError(500, "Driver Already Exist")
    }

    const hashPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT))

    const autProvider: IAuthProvider = { provider: "credentials", providerid: email as string }
    const driver = await Driver.create({
        email: email,
        password: hashPassword,
        auths: [autProvider],
        ...rest
    })

    return driver
}

const getAllDriverService = async () => {
    const drivers = await Driver.find({})

    const totalUsers = await Driver.countDocuments()

    return {
        data: drivers,
        meta: {
            total: totalUsers
        }
    }
}





const UpdateDriverService = async ( payload: Partial<IDriverFields>, decodedToken: JwtPayload) => {

    const ifDriverExist = await Driver.findById(decodedToken.userId);

    if (!ifDriverExist) {
        throw new AppError(404, "Driver not found");
    }



    // Prevent role change unless by high-privileged roles
    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDelete || payload.isVerified || payload.isApproved || payload.isSuspended) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    // Password hashing
    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, Number(envVars.BCRYPT_SALT))
    }

    const updatedDriver = await Driver.findByIdAndUpdate(decodedToken.userId, payload, {
        new: true,
        runValidators: true,
    });

    return updatedDriver;
};



const updateDriverByAdminService = async (driverId: string,updateData: Partial<IDriverFields> ) => {
  const updatedDriver = await Driver.findByIdAndUpdate(
    driverId,
    { $set: updateData },
    { new: true }
  );

  if (!updatedDriver) {
    throw new Error("Driver not found");
  }

  return updatedDriver;
};



const getSingleDriverByAdminService = async (driverId: string) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error("Driver not found");
  }
  return driver;
};


export const DriverServices = {
    createDriverService,
    getAllDriverService,
    UpdateDriverService,
    // for admin
    updateDriverByAdminService,
    getSingleDriverByAdminService
}
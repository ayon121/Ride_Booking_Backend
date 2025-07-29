import { NextFunction, Request, Response } from "express";
import { DriverServices } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";


const createDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await DriverServices.createDriverService(req.body)

        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "Driver Created Successfully",
            data : user,

        })

        
    } catch (err) {
        next(err)
    }

}



const UpdateDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const driverId = req.params.id
        const payload = req.body
        const verified = req.user;

        const user = await DriverServices.UpdateDriverService(driverId , payload , verified as JwtPayload)

        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "Driver Updated Successfully",
            data : user,

        })


        
    } catch (err) {
        next(err)


    }

}


const getAllDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await DriverServices.getAllDriverService()
        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "All Driver Fetched Successfully",
            data : result.data,
            meta : result.meta,
        })


    } catch (err) {
        next(err)


    }
}

export const DriverControllers = {
    createDriver,
    UpdateDriver,
    getAllDriver
    
}
import { NextFunction, Request, Response } from "express";
import { DriverServices } from "./driver.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import Driver from "./driver.model";


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

        
        const payload = req.body
        const decodedToken = req.user as JwtPayload;

        const user = await DriverServices.UpdateDriverService( payload , decodedToken )

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


export const getDriverAnalytics = async (req: Request, res: Response ,  next: NextFunction) => {
  const decodedToken = req.user as JwtPayload;

  try {
    const driver = await Driver.findById(decodedToken.userId)
      .populate("currentRide")
      .populate("Ridehistory");

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const analytics = {
      name: driver.name,
      email: driver.email,
      isOnline: driver.isOnline,
      isActive: driver.isActive,
      isOnRide: driver.isOnRide,
      totalRides: driver.totalRides,
      earnings: driver.earnings,
      rating: driver.rating,
      completedRides: driver.Ridehistory?.length || 0,
      currentRide: driver.currentRide || null,
    };

    return res.status(200).json({ success: true, data: analytics });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
      next(err)
  }
};




// for admin
const getAllDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const builder = new QueryBuilder(Driver.find(), req.query as Record<string, string>);
        builder.filter().search(['name', 'email']).sort().fields().paginate();


        const driver= await builder.build();
        const meta = await builder.getMeta();

        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "All Driver Fetched Successfully",
            data : driver,
            meta ,
        })


    } catch (err) {
        next(err)


    }
}



const updateDriverByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driverId } = req.params;
    const updateData = req.body;

    const driver = await DriverServices.updateDriverByAdminService(driverId, updateData);

    res.status(200).json({
      success: true,
      message: "Driver updated successfully",
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};



const getSingleDriverByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driverId } = req.params;

    const driver = await DriverServices.getSingleDriverByAdminService(driverId);

    res.status(200).json({
      success: true,
      message: "Driver fetched successfully",
      data: driver,
    });
  } catch (error) {
    next(error);
  }
};
export const DriverControllers = {
    createDriver,
    UpdateDriver,

    // for admin
    getAllDriver,
    updateDriverByAdmin,
    getSingleDriverByAdmin
    
}
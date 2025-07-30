/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";






const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserServices.createUserService(req.body)

        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "User Created Successfully",
            data : user,

        })

        
    } catch (err: any) {
        console.log(err);
        next(err)


    }

}

const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req.params.id
        const payload = req.body
        const verified = req.user;

        const user = await UserServices.UpdateUserService(userId , payload , verified as JwtPayload)

        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "User Updated Successfully",
            data : user,

        })


        
    } catch (err: any) {
        console.log(err);
        next(err)


    }

}


const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.getAllUserService()
        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "All User Fetched Successfully",
            data : result.data,
            meta : result.meta,
        })


    } catch (err: any) {
    
        console.log(err);
        next(err)


    }
}



const updateUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await UserServices.updateUserByAdminService(userId, updateData);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


export const getSingleUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await UserServices.getSingleUserByAdminService(userId);

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const UserControllers = {
    createUser,
    getAllUser,
    UpdateUser,
    // for admin
    updateUserByAdmin,
    getSingleUserByAdmin
}
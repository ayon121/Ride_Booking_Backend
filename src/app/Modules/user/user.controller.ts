/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { User } from "./user.model";






const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserServices.createUserService(req.body)

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "User Created Successfully",
            data: user,

        })


    } catch (err: any) {
        console.log(err);
        next(err)


    }

}

const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const payload = req.body
        const decodedToken = req.user as JwtPayload;

        const user = await UserServices.UpdateUserService(payload, decodedToken)

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "User Updated Successfully",
            data: user,

        })



    } catch (err: any) {
        console.log(err);
        next(err)


    }

}


const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const builder = new QueryBuilder(User.find(), req.query as Record<string, string>);
        builder.filter().search(['name', 'email']).sort().fields().paginate();

         const user= await builder.build();
        const meta = await builder.getMeta();
        
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "All User Fetched Successfully",
            data: user,
            meta,
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

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "User updated successfully",
            data: user,
        })
    } catch (error) {
        next(error);
    }
};


export const getSingleUserByAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        const user = await UserServices.getSingleUserByAdminService(userId);

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "User fetched successfully",
            data: user,
        })

    } catch (error) {
        next(error);
    }
};



// admin analytics
const getAdminAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.getAdminAnalyticsService();
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Admin Analytics fetched successfully",
            data: result,
        })
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
    getSingleUserByAdmin,
    getAdminAnalytics
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";



// type AsncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>

// const catchAsync = (fn : AsncHandler) => (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res , next)).catch((err : any)=> {
//         console.log(err);
//         next(err)
//     })
// }


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserServices.createUserService(req.body)

        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "User Created Successfully",
            data : user,

        })

        // res.status(201).json({
        //     message: "User Created Successfully",
        //     user
        // })

        
    } catch (err: any) {
        console.log(err);
        next(err)


    }

}

const UpdateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req.params.id
        // const token = req.headers.authorization
        // const verified = verifyToken(token as string , envVars.JWT_SECRET) as JwtPayload
        const payload = req.body
        const verified = req.user;

        const user = await UserServices.UpdateUserService(userId , payload , verified as JwtPayload)

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


const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await UserServices.getAllUserService()
        sendResponse(res , {
            success : true,
            statusCode : 201,
            message : "User Created Successfully",
            data : result.data,
            meta : result.meta,
        })


    } catch (err: any) {
    
        console.log(err);
        next(err)


    }
}


export const UserControllers = {
    createUser,
    getAllUser,
    UpdateUser,
}
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import { AuthServices } from "./auth.service";
import AppError from "../../ErrorHelpers/AppError";
import { setAuthCookie } from "../../utils/setcookie";
import { JwtPayload } from "jsonwebtoken";
import { CreateUserToken } from "../../utils/usertoken";
import { envVars } from "../../Config/env";
import { catchAsync } from "../../utils/catchAsync";
import passport from "passport";
import { User } from "../user/user.model";
import Driver from "../driver/driver.model";
import { Role } from "../user/user.interface";

const creadentialUserLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate("local", async (err: any, user: any, info: any) => {

            if (err) {
                return next(err)
            }

            if (!user) {
                return next(new AppError(401, info.message))
            }

            const userTokens = CreateUserToken(user)
            const { password: pass, ...rest } = user.toObject()

            setAuthCookie(res, userTokens)

            sendResponse(res, {
                success: true,
                statusCode: 201,
                message: `${rest?.role || "User"} Logged In Successfully`,
                data: {
                    accesstoken: userTokens.accesstoken,
                    refreshtoken: userTokens.refreshtoken,
                    user: rest

                }
            })

        })(req, res, next)



    } catch (err: any) {
        console.log(err);
        next(err)
    }
}
const creadentialDriverLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        passport.authenticate("local-driver", async (err: any, driver: any, info: any) => {

            if (err) {
                return next(err)
            }

            if (!driver) {
                return next(new AppError(401, info.message))
            }

            const driverTokens = CreateUserToken(driver)
            const { password: pass, ...rest } = driver.toObject()

            setAuthCookie(res, driverTokens)

            sendResponse(res, {
                success: true,
                statusCode: 201,
                message: `${rest?.role || "Driver"} Logged In Successfully`,
                data: {
                    accesstoken: driverTokens.accesstoken,
                    refreshtoken: driverTokens.refreshtoken,
                    driver: rest

                }
            })

        })(req, res, next)



    } catch (err: any) {
        console.log(err);
        next(err)
    }
}



const getNewAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshtoken;

        if (!refreshToken) {
            throw new AppError(500, "No Refresh Token")
        }
        const tokenInfo = await AuthServices.getNewAccessToken(refreshToken as string)

        setAuthCookie(res, tokenInfo)

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "New Access Token Retrive Successfully",
            data: tokenInfo
        })
    } catch (err: any) {
        console.log(err);
        next(err)
    }
}


const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("accesstoken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        })
        res.clearCookie("refreshtoken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        })

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "User Logged out Successfully",
            data: null
        })
    } catch (err: any) {
        console.log(err);
        next(err)
    }
}




const resetPasswordUser = async (req: Request, res: Response, next: NextFunction) => {
    try {


        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        const decodedToken = req.user


        await AuthServices.resetPasswordUser(oldPassword, newPassword, decodedToken as JwtPayload)

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Password Changed Successfully",
            data: null
        })
    } catch (err: any) {
        console.log(err);
        next(err)
    }
}

const resetPasswordDriver = async (req: Request, res: Response, next: NextFunction) => {
    try {


        const newPassword = req.body.newPassword;
        const oldPassword = req.body.oldPassword;
        const decodedToken = req.user


        await AuthServices.resetPasswordDriver(oldPassword, newPassword, decodedToken as JwtPayload)

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Password Changed Successfully",
            data: null
        })
    } catch (err: any) {
        console.log(err);
        next(err)
    }
}









// for user --- for future implementation
const googleCallbackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""

    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user;

    if (!user) {
        throw new AppError(404, "User Not Found")
    }

    const tokenInfo = CreateUserToken(user)

    setAuthCookie(res, tokenInfo)



    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})




//  user ---- driver profile system 
const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const decodedToken = req.user as JwtPayload;



        if (!decodedToken.userId || !decodedToken.role) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        let profile = null;

        if (decodedToken.role === Role.USER) {
            profile = await User.findById(decodedToken.userId).select("-password");
        } else if (decodedToken.role === Role.DRIVER) {
            profile = await Driver.findById(decodedToken.userId).select("-password");
        }
        else if (decodedToken.role === Role.ADMIN || decodedToken.role === Role.SUPER_ADMIN) {
            profile = await User.findById(decodedToken.userId).select("-password");
        }

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }


        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Profile Fetched Successfully",
            data: profile
        })
    } catch (error) {
        next(error);
    }
};
export const AuthControllers = {
    creadentialUserLogin,
    creadentialDriverLogin,
    getNewAccessToken,
    logout,
    resetPasswordUser,
    resetPasswordDriver,
    googleCallbackController,
    getMe
}
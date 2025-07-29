import { Response } from "express";

export interface AuthTokens {
    accesstoken ?: string;
    refreshToken ?: string; 
}
export const setAuthCookie = (res : Response , tokenInfo : AuthTokens) => {
    if(tokenInfo.accesstoken){
         res.cookie("accesstoken" , tokenInfo.accesstoken, {
            httpOnly : true,
            secure : false
        })
    }

    if(tokenInfo.refreshToken){
        res.cookie("refreshtoken" , tokenInfo.refreshToken , {
            httpOnly : true,
            secure : false
        })
    }
}
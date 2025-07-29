import { Response } from "express";

export interface AuthTokens {
    accesstoken ?: string;
    refreshtoken ?: string; 
}
export const setAuthCookie = (res : Response , tokenInfo : AuthTokens) => {
    if(tokenInfo.accesstoken){
         res.cookie("accesstoken" , tokenInfo.accesstoken, {
            httpOnly : true,
            secure : false
        })
    }

    if(tokenInfo.refreshtoken){
        res.cookie("refreshtoken" , tokenInfo.refreshtoken , {
            httpOnly : true,
            secure : false
        })
    }
}
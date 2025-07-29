import { Types } from "mongoose"

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "RIDER",
    GUIDE = "DRIVER"
}


export interface IAuthProvider {
    provider : "google" | "credentials",
    providerid : string,
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED= "BLOKED"
}
export interface IUser {
    _id ?: Types.ObjectId
    name : string,
    email : string , 
    password ?: string,
    phone ?: string , 
    picture ?: string,
    address ?: string ,
    isDelete ?: boolean,
    isActive ?: IsActive,
    isVerified ?: boolean,

    auths : IAuthProvider[],
    role : Role,
    bookings ?: Types.ObjectId[]
    guides ?: Types.ObjectId[]
}
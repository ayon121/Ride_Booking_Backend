import { model, Schema } from "mongoose";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";

export const AuthProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerid: { type: String, required: true }

}, {
    versionKey: false,
    _id: false,

})



const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    auths: { type: [AuthProviderSchema], default: [] },

    currentRide: { type: Schema.Types.ObjectId, ref: "Ride" , default: null}, 
    previousRides: [{ type: Schema.Types.ObjectId, ref: "Ride" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export const User = model<IUser>("User" , UserSchema)
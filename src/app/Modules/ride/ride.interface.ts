import { Types } from "mongoose";


export enum RideStatus {
    REQUESTED = "REQUESTED",
    ACCEPTED = "ACCEPTED",
    PICKEDUP = "PICKEDUP",
    INTRANSIT = "INTRANSIT",
    COMPLETED = "CANCELLED",
}


export interface IRide {
  _id?: Types.ObjectId;
  riderId: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickupLocation: string;
  dropLocation: string;
  price : number;
  ridestatus: RideStatus;
  requestedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  paymentMethod?: "CASH" | "CARD";
  isPaid?: boolean;
}
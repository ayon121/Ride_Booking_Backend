import { Schema, model } from "mongoose";
import { IRide, RideStatus } from "./ride.interface";

const RideSchema = new Schema<IRide>({
  riderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: Schema.Types.ObjectId, ref: "Driver",  default: null},
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  price : { type: Number, required: true },
  ridestatus: { type: String, enum: Object.values(RideStatus), default: RideStatus.REQUESTED },
  requestedAt: { type: Date, default: Date.now },
  startedAt: { type: Date , default : null },
  completedAt: { type: Date , default : null },
  paymentMethod: { type: String, enum: ["CASH", "CARD"] , default : "CASH" },
  isPaid: { type: Boolean, default: false }
}, {
  timestamps: true,
  versionKey: false
});


// basic fields to create a ride : riderId , pickupLocation , dropLocation , price 
const Ride = model<IRide>("Ride", RideSchema);
export default Ride;

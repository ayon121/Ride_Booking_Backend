import express from "express";


import { createDriverZodSchema, updateDriverZodSchema } from "./driver.validation";
import { DriverControllers, getDriverAnalytics } from "./driver.controller";
import { validateRequest } from "../../Middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../Middlewares/CheckAuth";

const router = express.Router();

router.get("/analytics", checkAuth( Role.DRIVER)  , getDriverAnalytics);
router.post("/register", validateRequest(createDriverZodSchema), DriverControllers.createDriver );
router.patch("/updateprofile", validateRequest(updateDriverZodSchema) , checkAuth( Role.DRIVER)  , DriverControllers.UpdateDriver );

// admin or super admin routes
router.get("/alldrivers" , checkAuth( Role.ADMIN, Role.SUPER_ADMIN)  , DriverControllers.getAllDriver);
router.patch("/updatedriver/:driverId" , checkAuth( Role.ADMIN, Role.SUPER_ADMIN)  , DriverControllers.updateDriverByAdmin);
router.get("/:driverId" ,  checkAuth( Role.ADMIN, Role.SUPER_ADMIN)  , DriverControllers.getSingleDriverByAdmin);

export const DriverRoutes = router;


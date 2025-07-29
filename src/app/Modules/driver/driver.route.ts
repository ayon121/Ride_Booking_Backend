import express from "express";


import { createDriverZodSchema, updateDriverZodSchema } from "./driver.validation";
import { DriverControllers } from "./driver.controller";
import { validateRequest } from "../../Middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../Middlewares/CheckAuth";

const router = express.Router();

router.post("/register", validateRequest(createDriverZodSchema), DriverControllers.createDriver );
router.get("/alldrivers" , checkAuth( Role.ADMIN, Role.SUPER_ADMIN)   ,DriverControllers.getAllDriver);
router.patch("/:id", validateRequest(updateDriverZodSchema), DriverControllers.UpdateDriver );

export const DriverRoutes = router;

import { Router } from "express"
import { Userrouter } from "../user/user.route"
import { AuthRoutes } from "../auth/auth.route"
import { DriverRoutes } from "../driver/driver.route"
import { Rideroute } from "../ride/ride.route"

export const router = Router()
const moduleRoutes = [
    {
        path : "/user",
        route : Userrouter
    },
    {
        path : "/driver",
        route : DriverRoutes
    },
    {
        path : "/rides",
        route : Rideroute
    },
    {
        path : "/auth",
        route : AuthRoutes
    },
]


moduleRoutes.forEach((route) =>{
    router.use(route.path , route.route)
})



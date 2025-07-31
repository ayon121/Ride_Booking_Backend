import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.contoller";
import { checkAuth } from "../../Middlewares/CheckAuth";
import { Role } from "../user/user.interface";
import passport from "passport";

const router = Router()

router.post("/user/login", AuthControllers.creadentialUserLogin)
router.post("/driver/login", AuthControllers.creadentialDriverLogin)
router.post("/refresh-token", AuthControllers.getNewAccessToken)
router.post("/logout" , AuthControllers.logout)
router.patch("/user/reset-password", checkAuth(...Object.values(Role)) , AuthControllers.resetPasswordUser)
router.patch("/driver/reset-password", checkAuth(...Object.values(Role)) , AuthControllers.resetPasswordDriver)
router.get("/me", checkAuth(...Object.values(Role)) , AuthControllers.getMe)




// google login for users
router.get("/google", async (req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || "/"
    passport.authenticate("google", { scope: ["profile", "email"], state: redirect as string })(req, res, next)
})

// api/v1/auth/google/callback?state=/booking
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), AuthControllers.googleCallbackController)


export const AuthRoutes = router;
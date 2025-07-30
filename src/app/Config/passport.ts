/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";

import { User } from "../Modules/user/user.model";
import { Role } from "../Modules/user/user.interface";
import { envVars } from "./env";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import Driver from "../Modules/driver/driver.model";


//  for riders and admins
passport.use("local",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        }
        , async (email: string, password: string, done: any ) => {
            try {
                const isUserExist = await User.findOne({ email })
                if (!isUserExist) {
                    return done(null, false, { message: "User Don't Exist" })
                }

                const isGoogleAuthenticated = isUserExist.auths.some(providersObject => providersObject.provider == "google")

                if (isGoogleAuthenticated && !isUserExist.password) {
                    return done(null, false, { message: "You have Authenticated through Google Login" })
                }
                const isPasswordMatch = await bcrypt.compare(password as string, isUserExist.password as string)

                if (!isPasswordMatch) {
                    return done(null, false, { message: "Incorrect Password" })
                }

                return done(null, isUserExist)


            } catch (error) {
                console.log(error);
                done(error)
            }

        })
)



// driver login system
passport.use("local-driver",
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
        }
        , async (email: string, password: string, done: any ) => {
            try {
                const isDriverExist = await Driver.findOne({ email })
                if (!isDriverExist) {
                    return done(null, false, { message: "Driver Don't Exist" })
                }

                const isGoogleAuthenticated = isDriverExist.auths.some(providersObject => providersObject.provider == "google")

                if (isGoogleAuthenticated && !isDriverExist.password) {
                    return done(null, false, { message: "You have Authenticated through Google Login" })
                }
                const isPasswordMatch = await bcrypt.compare(password as string, isDriverExist.password as string)

                if (!isPasswordMatch) {
                    return done(null, false, { message: "Incorrect Password" })
                }

                return done(null, isDriverExist)


            } catch (error) {
                console.log(error);
                done(error)
            }

        })
)




// google login for users
passport.use(
    new GoogleStrategy(
        {
            clientID: envVars.GOOGLE_CLIENT_ID,
            clientSecret: envVars.GOOGLE_CLIENT_SECRET,
            callbackURL: envVars.GOOGLE_CALLBACK_URL
        }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {

            try {
                const email = profile.emails?.[0].value;

                if (!email) {
                    return done(null, false, { mesaage: "No email found" })
                }

                let user = await User.findOne({ email })

                if (!user) {
                    user = await User.create({
                        email,
                        name: profile.displayName,
                        picture: profile.photos?.[0].value,
                        role: Role.USER,
                        isVerified: true,
                        auths: [
                            {
                                provider: "google",
                                providerid: profile.id
                            }
                        ]
                    })
                }

                return done(null, user)


            } catch (error) {
                console.log("Google Strategy Error", error);
                return done(error)
            }
        }
    )
)



passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
    done(null, user._id)
})

passport.deserializeUser(async (id: string, done: any) => {
    try {
        const user = await User.findById(id);
        done(null, user)
    } catch (error) {
        console.log(error);
        done(error)
    }
})
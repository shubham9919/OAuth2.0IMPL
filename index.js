import express from "express"
import passport from "passport"
import session from "express-session"
import cors from "cors"
import dotenv from 'dotenv';
import StoreUserDetails from './services/user-check.js'
import TokenUtilities from './utils/jwt-utils.js'
dotenv.config()
import "./auth.js"
function loggedIn(req, res, next) {
    console.log(`/${req.params[0]}`)
    const myPromise = new Promise((resolve, reject) => {
        new StoreUserDetails().isUserRegistered(req.params[0]).then((flag) => {
            console.log("flag is " + flag)
            if (flag) {
                resolve()
                next();
            } else {
                reject()
            }
        }).catch(() => {
            console.log("promise rejected")
            res.redirect(`${process.env.SUCCESS_REDIRECT}`)
        })
    })
}

/**
 * @todo
 * PROBLEM TO ADDRESS
 *  1. JWT Implementation - Done
 *  2. Store user details in DynamoDB or some persistent database
 * 
 */

const app = express()
app.use(cors({
    origin: "http://ec2-3-82-206-27.compute-1.amazonaws.com:3000",
    // origin: "http://localhost:8000",
    credentials: true
}))
app.use(passport.initialize());

app.use(session({ secret: "none" }));

app.use(passport.session());


app.get("/login", (req, res) => {
    // res.redirect("/auth/google")
    res.send('<a href= "/auth/google">Auth with google</a>')
})

/** In this method the passport.authenticate call will provede us a code and in exchange of that code 
 * we will get the profile information
 */

app.get("/auth/google",
    passport.authenticate('google', { scope: ['email', 'profile'] }), (req, res) => {
        // console.log(req)
    }
)

/** We are calling this passport.authenticate function again because this time we have the code that will
 * get exhnaged with identity provider and then we will get the profile info in exhabfe of that code 
 * */

app.get("/google/callback",
    passport.authenticate('google', {
        failureRedirect: '/authfailure'
    }), (req, res) => {
        /**
         * @see https://www.npmjs.com/package/jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
         * payload could be an object literal, buffer or string. 
         * exp is only set if the payload is an object literal.
         */
        const user = { userId: req.user.id }
        const JWT_TOKEN = new TokenUtilities().generateAccessToken(user)
        const JWT_REFRESH_TOKEN = new TokenUtilities().generateRefreshToken(user)
        res.redirect(`${process.env.SUCCESS_REDIRECT}?jwtToken=${JWT_TOKEN}&refreshToken=${JWT_REFRESH_TOKEN}`) // for dev
    }
),

app.get("/protected", new TokenUtilities().authenticateToken, (req, res) => {
    res.send("user found")
})

app.get("/authfailure", (req, res) => {
    res.send("something went wrong")
})


app.listen(5000, () => console.log("listening on 5000"))

//killall -9 node in case of listen EADDRINUSE while using nodejs
//https://stackoverflow.com/questions/9898372/how-to-fix-error-listen-eaddrinuse-while-using-nodejs

//https://stackoverflow.com/questions/4075287/node-express-eaddrinuse-address-already-in-use-kill-server

//https://computingforgeeks.com/how-to-install-nodejs-on-ubuntu-debian-linux-mint/
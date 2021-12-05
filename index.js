import express from "express"
import passport from "passport"
import session from "express-session"
import cors from "cors"
import dotenv from 'dotenv';
import StoreUserDetails from './services/user-check.js'
dotenv.config()
import "./auth.js"
function loggedIn(req, res, next) {
    // console.log(req.user)
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
 * PROBLEM TO ADDRESS
 *  1. when the frontend server makes call to the backend if the user is validated 
 *  the backend have no way to store previous login and validate 
 * 
 */

const app = express()
app.use(cors({
    origin: "http://ec2-3-88-39-229.compute-1.amazonaws.com:3000",
    // origin: "http://localhost:3000",
    credentials: true
}))
app.use(passport.initialize());

app.use(session({ secret: "cats" }));

app.use(passport.session());


app.get("/login", (req, res) => {
    // res.redirect("/auth/google")
    res.send('<a href= "/auth/google">Auth with google</a>')
})

app.get("/auth/google",
    passport.authenticate('google', { scope: ['email', 'profile'] }), (req, res) => {
        // console.log(req)
    }
)

app.get("/google/callback",
    passport.authenticate('google', {
        failureRedirect: '/authfailure'
        // successRedirect: process.env.SUCCESS_REDIRECT,
    }), (req, res) => {
        res.redirect(`${process.env.SUCCESS_REDIRECT}/user/${req.user.id}`)
    }
),

    app.get("/protected/*", loggedIn, (req, res) => {
        console.log("req is --> "+ req.query)
        res.send("user found")
    })

app.get("/authfailure", (req, res) => {
    res.send("something went wrong")
})


app.listen(5000, () => console.log("listening on 5000"))

//killall -9 node in case of listen EADDRINUSE while using nodejs
//https://stackoverflow.com/questions/9898372/how-to-fix-error-listen-eaddrinuse-while-using-nodejs

//https://stackoverflow.com/questions/4075287/node-express-eaddrinuse-address-already-in-use-kill-server
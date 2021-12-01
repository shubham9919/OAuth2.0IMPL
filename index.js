const express = require("express")
const passport = require("passport")
const session = require("express-session")
const cors =require("cors")
require('dotenv').config();

require("./auth")
function loggedIn(req, res, next){
    req.user? next() :res.send(401)
}



const app = express()
app.use(cors({
    origin: "http://localhost:3000",
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
    passport.authenticate('google', {scope: ['email', 'profile']}), (req, res) => {
        // console.log(req)
    }
)

app.get("/google/callback", 
passport.authenticate('google', {
    successRedirect: process.env.SUCCESS_REDIRECT,
    failureRedirect: '/authfailure'
}),
)

app.get("/protected", loggedIn, (req, res) => {
    res.send(req.user)
})

app.get("/authfailure", (req, res) => {
    res.send("something went wrong")
})


app.listen(5000, () => console.log("listening on 5000") )
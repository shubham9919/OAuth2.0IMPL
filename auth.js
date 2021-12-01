const passport = require("passport")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL, // ------your callbackurl for oauth token from google http://localhost:5000/google/callback
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      console.log(profile)
      return done(null, profile);
  }
));


passport.serializeUser(function(user, done){
    done(null, user)
})

passport.deserializeUser(function(user, done){
    done(null, user)
})
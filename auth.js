import passport from "passport"
import GoogleStrategy from 'passport-google-oauth2';
import  StoreUserDetails  from './services/store-user.js'
import dotenv  from 'dotenv';
dotenv.config()

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL, // ------your callbackurl for oauth token from google http://localhost:5000/google/callback
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    //   console.log(profile)
      const STORE_USERDETAILS_RESPONSE = new StoreUserDetails().storeUser(profile)
      // console.log(STORE_USERDETAILS_RESPONSE)
      return done(null, profile);
  }
));


passport.serializeUser(function(user, done){
    done(null, user)
})

passport.deserializeUser(function(user, done){
    done(null, user)
})
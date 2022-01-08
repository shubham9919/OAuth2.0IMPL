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

      const STORE_USERDETAILS_RESPONSE = new StoreUserDetails().storeUser(profile)

      /**
       *  This done method actually means we are ready for our next step.. 
       * In this case, the next step is to serialize the user for session management 
       * 1st param in done is error scenariao --> In our case we are passing null in case of error
       * 
       */
      
      return done(null, profile);
  }
));

/** */

passport.serializeUser(function(user, done){
    /** The next stage of serializeUser is deserializeUser */
    done(null, user)
})

passport.deserializeUser(function(user, done){
    done(null, user)
})
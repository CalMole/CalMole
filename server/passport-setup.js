const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv')
dotenv.config({path: path.join(__dirname, './config/config.env') })
const GoogleStrategy = require('passport-google-oauth20').Strategy;
console.log('clientid', process.env);

passport.use(new GoogleStrategy({
    clientID: '366734958535-jj77akvpkh0vq6k0telp9elm42iv0cn5.apps.googleusercontent.com',
    clientSecret: 'dXtJfgY64PXA1wQBb-eRXnED',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    // User.findById(id, function(err, user) {
      done(null, user);
    // });
  });


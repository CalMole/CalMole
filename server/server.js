const path = require('path');
const dotenv = require('dotenv')
const eventController = require(path.resolve(__dirname, './controllers/eventController'));
const cors = require('cors')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const apiRouter = require('./router/api');
const bodyParser = require('body-parser');
const passport = require('passport');
dotenv.config({path: path.resolve(__dirname, './config/config.env' )})
const GoogleStrategy = require('passport-google-oauth20').Strategy;

console.log('request came in here!');

//middleware
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
// app.use(cookieSession({
//     name: 'session',
//     keys: ['key1','key2'],
// }))
console.log(`http://localhost:${process.env.PORT}/auth/google/callback`);

//passport strategy
passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`,
},
async function(accessToken, refreshToken, profile, done) {
  // User.findOrCreate({ googleId: profile.id }, function (err, user) {
  //   return cb(err, user);
  // });
  console.log('access toke', accessToken);
  console.log('refresh token', refreshToken)
  console.log('profile', profile);

  //add user to db with their access token for future api calls
  try {
  await eventController.addUser(profile, accessToken, refreshToken);
  await eventController.pushCalEvents(accessToken, profile);
  } catch (err) {
    console.log(err);
  }

  return done(null, {
    profile: profile,
    accessToken: accessToken,
    refreshToken: refreshToken
  });
}
));
//passport hashing and dehashing
passport.serializeUser(function(user, cb) {
cb(null, user);
});

passport.deserializeUser(function(user, cb) {
// User.findById(id, function(err, user) {
  cb(null, user);
// });
});
console.log('made it just before redirect');

//passport routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'], accessType: 'offline',
  prompt: 'consent'
 }));
// ^^ provides read write access to user calendars and events within calendar, see https://developers.google.com/calendar/api/guides/auth
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/loginfailure'}),
  function(req, res) {
    console.log(path.resolve(__dirname, '../build/index.html'));
    res.redirect('http://localhost:3000/home');
    // Successful authentication, redirect home.

  });

//dummy routes to see if auth worked!
app.get("/loginfailure",(req, res) => res.send('Authentication failed. Please return to homepage and try again.'));
app.use(express.static(path.resolve(__dirname, '../build')))

console.log('request came in here 2');
//receives callback with token for user from google

//root route though build should have already handled this
app.get('/', (req, res) => {
  console.log(path.resolve(__dirname, '../build/index.html'));
  res.status(200).sendFile(path.resolve(__dirname, 'build/index.html'))
})
app.get('/home', (req, res) => {
  console.log(path.resolve(__dirname, '../build/index.html'));
  res.status(200).sendFile(path.resolve(__dirname, 'build/index.html'))
... (42 lines left)
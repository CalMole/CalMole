
const path = require('path');
const dotenv = require('dotenv')
const cors = require('cors')
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');
const apiRouter = require('./router/api');
const passport = require('passport');
const cookieSession = require('cookie-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// // Load config
dotenv.config({path: path.join(__dirname, './config/config.env' )})

console.log('request came in here!');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session({
    resave: false,
    saveUninitialized: true
}));
app.use(cookieSession({
    name: 'session',
    keys: ['key1','key2'],
}))

console.log('request came in here 2');
passport.use(new GoogleStrategy({
    clientID: '366734958535-jj77akvpkh0vq6k0telp9elm42iv0cn5.apps.googleusercontent.com',
    clientSecret: 'dXtJfgY64PXA1wQBb-eRXnED',
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    console.log('access toke', accessToken);
    console.log('refresh toke', refreshToken);
    console.log('profile', profile);
    return cb(null, profile);
  }
));



// Route all api calls to the api router
app.use('/api', apiRouter);

//oauth
// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// app.get('/', (req,res) => {
//     return res.status(200).sendFile()
// })

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));
 // 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/bad' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.json('you made it');
  });

app.get("/bad",(req, res) => res.json('failed'));
// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send('404 Fail whale'));

// Generic error handling
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

// Spin up server listening on port in config
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port: ${process.env.PORT}...`);
});

module.exports = app;

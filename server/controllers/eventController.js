const { query } = require('../../db/db.js');
const pool = require('../../db/db.js');
const {google} = require('googleapis');
const fs = require('fs')

// Declare empty event controller obj
const eventController = {};

//store user in db with token
eventController.addUser = (profile, accessToken, refreshToken) => {
  //store user in DB, upsert so if user already exists just updates token if it's changed
  pool.query(`INSERT INTO users(
    id,
    first_name,
    last_name,
    token,
    refreshtoken)VALUES(
      '${profile.id}',
      '${profile.name.givenName}',
      '${profile.name.familyName}',
      '${accessToken}',
      '${refreshToken}'
  ) ON CONFLICT (id) DO UPDATE
  SET token = '${accessToken}'`)
  .catch(err => {
    console.log('err in addUser', err)
  })
}

// Push the calendar events to the event database
eventController.pushCalEvents = async(accessToken, profile) => {
  //pull data from api for arr of event objects
  // const auth = new googleAuth();
  let oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      'http://localhost:5000/auth/google/callback'
  );

  //get both tokens including refresh
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: ['profile', 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events']
  });


  console.log(oAuth2Client);
  console.log('profile id', profile.id)
  //query db for user to get refresh token even if not first login
  const userObj = await pool.query(
    `SELECT * FROM "users" WHERE id = '${profile.id}'`
  )
  console.log('UserObj is here', userObj);

  // Now use OAuth response to get an user authenticated API client
  let credentials = {
      access_token: accessToken,
      token_type:'Bearer', // mostly Bearer
      refresh_token:userObj.rows[0].refreshtoken,
      // expiry_date:'EXPIRY_TIME'
  };
  oAuth2Client.setCredentials(credentials);

  const calendar = google.calendar({version: 'v3', auth: oAuth2Client});

  //grab next weeks worth of events
  calendar.events.list({
    calendarId: 'bgro63@gmail.com',
    timeMin: (new Date()).toISOString(),
    timeMax: (new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)).toISOString(),
    maxResults: 500,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    console.log('events', events);
      for (let i = 0; i < events.length; i++) {
        let params = [
            events[i].created,
            events[i].updated,
            events[i].start.dateTime,
            events[i].end.dateTime,
            events[i].iCalUID,
            events[i].status,
            events[i].summary,
            events[i].creator.email,
            events[i].organizer.email,
        ]
        let query = `
        INSERT INTO raw_cal_events( id, insertion_timestamp, event_created_ts, event_updated_ts, event_start_ts, event_end_ts, cal_owner_user_id, status, event_summary, event_creator_email, event_organizer_email )
        VALUES (DEFAULT, current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`
        pool.query(
          query,params, (err, res) => {
              console.log(err, res);
            })
      }
    }
  )
}

eventController.getEvents = (req, res, next) => {
  function converter(val) {
    const start = new Date('2021-08-20T13:30:00-04:00');
    console.log(start.getHours());

    const newObj = {
      hoursmins: {
        h: Number(start.getHours()),
        m: Number(start.getMinutes()),
      },
      date: Number(start.getDay()),
    };
    return newObj;
  }
  pool.query(
   'SELECT * FROM raw_cal_events', (err, data) => {
     if(err)return next(err)
     data.map(el => {
       el.formattedStart = converter(el.event_start_ts);
       el.formattedEnd = converter(el.event_end_ts)
       return el
     })
     res.locals.events = data;
   }
  )
}


// Analyzes events from the raw_cal_events table
eventController.analyzeEvents = (req, res, next) => {
  const analysisSql = fs.readFileSync('../../db/events_analytics.sql').toString();
  pool.query(analysisSql, (err, res) => {
    console.log(err, 'data successfully analyzed');
  })}


  // Gets proposed new events from analytics events table
  eventController.newEvents = (req, res, next) => {
    res.locals.currentEvents = pool.query(`
    SELECT
    event_summary,
    event_creator_email,
    new_start_ts AS event_start_ts,
    new_end_ts AS event_end_ts,
    recovered_focus_time

    FROM events_analytics

    WHERE new_start_ts > current_timestamp - interval '8' day
    AND new_start_ts < current_timestamp + interval '8' day
    `, (err, data) => {
      if(err)return next(err)
      data.map(el => {
        el.formattedStart = converter(el.event_start_ts);
        el.formattedEnd = converter(el.event_end_ts)
        return el
      })
      res.locals.newEvents = data;
    }
  }

module.exports = eventController

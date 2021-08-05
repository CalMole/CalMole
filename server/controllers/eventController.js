const { query } = require("../../db/db.js");
const pool = require("../../db/db.js");
const { google } = require("googleapis");
const fs = require("fs");

// Declare empty event controller obj
const eventController = {};

//store user in db with token
eventController.addUser = (profile, accessToken, refreshToken) => {
  //store user in DB, upsert so if user already exists just updates token if it's changed
  pool
    .query(
      `INSERT INTO users(
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
  SET token = '${accessToken}'`
    )
    .catch((err) => {
      console.log("err in addUser", err);
    });
};

// Push the calendar events to the event database
eventController.pushCalEvents = async (accessToken, profile) => {
  //pull data from api for arr of event objects
  // const auth = new googleAuth();
  let oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "http://localhost:5000/auth/google/callback"
  );

  //get both tokens including refresh
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline", // will return a refresh token
    scope: [
      "profile",
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/calendar.events",
    ],
  });

  console.log(oAuth2Client);
  console.log("profile id", profile.id);
  //query db for user to get refresh token even if not first login
  const userObj = await pool.query(
    `SELECT * FROM "users" WHERE id = '${profile.id}'`
  );
  console.log("UserObj is here", userObj);

  // Now use OAuth response to get an user authenticated API client
  let credentials = {
    access_token: accessToken,
    token_type: "Bearer", // mostly Bearer
    refresh_token: userObj.rows[0].refreshtoken,
    // expiry_date:'EXPIRY_TIME'
  };
  oAuth2Client.setCredentials(credentials);

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  //grab next weeks worth of events
  calendar.events.list(
    {
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      timeMax: new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      maxResults: 500,
      singleEvents: true,
      orderBy: "startTime",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const events = res.data.items;
      console.log("events", events);
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
        ];
        let query = `
        INSERT INTO raw_cal_events( id, insertion_timestamp, event_created_ts, event_updated_ts, event_start_ts, event_end_ts, cal_owner_user_id, status, event_summary, event_creator_email, event_organizer_email )
        VALUES (DEFAULT, current_timestamp, $1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
        pool.query(query, params, (err, res) => {
          console.log(err, res);
        });
      }
    }
  );
};

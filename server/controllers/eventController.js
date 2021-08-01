const { query } = require('../../db/db.js');
const pool = require('../../db/db.js');

// Declare empty event controller obj
const eventController = {};

// TODO: Currently commented out for the next step in the project (bringing in the google API data)
// Get the calendar events from the Google calendar api
// eventController.getCalEvents = (req, res, next) => {
//   const getEvents = [{date: '26/09/21', name: 'Michael\'s Birthday'},{date: '27/09/21', name: 'Day After Michael\'s Birthday'}]
//   res.locals.events = getEvents;
//   next();
// }

// Push the calendar events to the event database
eventController.pushCalEvents = (req, res, next) => {
  pool.query(
    `INSERT INTO raw_cal_events(
    id,
    insertion_timestamp,
    cal_owner_user_id,
    event_kind,
    event_tag,
    event_id,
    status,
    event_html_link,
    event_created_ts,
    event_updated_ts,
    event_summary,
    event_creator_email,
    event_organizer_email,
    event_start_ts,
    event_start_timezone,
    event_end_ts,
    event_end_timezone,
    recurring_event_id,
    event_original_start_ts,
    event_original_start_timezone,
    event_uid,
    event_sequence,
    event_type)VALUES(
      // TODO: Placeholder values until we are able to successfully pull directly from the Google API
      '1002030235',
      NOW(),
      'test1',
      'test2',
      'test3',
      'test4',
      'test5',
      'test6',
      '2003-2-1'::timestamp,
      '2003-2-1'::timestamp,
      'test7',
      'test8',
      'test9',
      '2003-2-1'::timestamp,
      'test10',
      '2003-2-1'::timestamp,
      'test',
      'test',
      '2003-2-1'::timestamp,
      'test',
      'test',
      'test',
      'test')
    `
    , (err, res) => {
        console.log(err, res);
      })
    }

module.exports = eventController

//const { query } = require('../models/???');
const query = require('./../../db/db.js');

// Declare empty event controller obj
const eventController = {};

// Create
eventController.getCalEvents = (req, res, next) => {
  console.log('reaches controller')
  const getEvents = [{
    kind: 'calendar#event',
    etag: '"3232143986818000"',
    id: 'chhj6e346cqj4bb1cksmab9k64o6abb274pmcb9l6di64ob170pmcp9hc4_20210804T010000Z',
    status: 'confirmed',
    htmlLink: 'https://www.google.com/calendar/event?eid=Y2hoajZlMzQ2Y3FqNGJiMWNrc21hYjlrNjRvNmFiYjI3NHBtY2I5bDZkaTY0b2IxNzBwbWNwOWhjNF8yMDIxMDgwNFQwMTAwMDBaIGJncm82M0Bt',
    created: '2021-03-18T12:53:13.000Z',
    updated: '2021-03-18T12:53:13.535Z',
    summary: 'Street cleaning',
    colorId: '10',
    creator: { email: 'bgro63@gmail.com', self: true },
    organizer: { email: 'bgro63@gmail.com', self: true },
    start: {
      dateTime: '2021-08-03T21:00:00-04:00',
      timeZone: 'America/New_York'
    },
    end: {
      dateTime: '2021-08-03T21:30:00-04:00',
      timeZone: 'America/New_York'
    },
    recurringEventId: 'chhj6e346cqj4bb1cksmab9k64o6abb274pmcb9l6di64ob170pmcp9hc4',
    originalStartTime: {
      dateTime: '2021-08-03T21:00:00-04:00',
      timeZone: 'America/New_York'
    },
    iCalUID: 'chhj6e346cqj4bb1cksmab9k64o6abb274pmcb9l6di64ob170pmcp9hc4@google.com',
    sequence: 0,
    reminders: { useDefault: false, overrides: [Array] },
    eventType: 'default'
  }]
  res.locals.events = getEvents;
  return next()
}

eventController.updateEvents = (req, res, next) => {
  console.log('reaches deposit middleware')
  for (const i in res.events) {
      const values = [
        DEFAULT,
        NOW(),
        'test',
        res.kind[i],
        res.etag[i],
        res.id[i],
        res.status[i],
        res.htmlLink[i],
        res.created[i],
        res.updated[i],
        res.summary[i],
        res.creator.email[i],
        res.organizer.email[i],
        res.start.dateTime[i],
        res.start.timeZone[i],
        res.end.dateTime[i],
        res.end.timeZone[i],
        res.recurringEventId[i],
        res.originalStartTime.dateTime[i],
        res.originalStartTime.timeZone[i],
        res.iCalUID[i],
        res.sequence[i],
        res.eventType[i]]

      const queryText = `INSERT INTO raw_cal_events(
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
        event_type
        )VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)`

        client.query(queryText,values, (err, result) => {
          release()
          if (err) {
            return console.error('Error executing query', err.stack)
          }})}
  return next()
        }

module.exports = eventController

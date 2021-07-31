//const { query } = require('../models/???');
//const db = require('../models/???');

// Declare empty event controller obj
const eventController = {};

// Create 
eventController.getCalEvents = (req, res, next) => {
  const getEvents = [{date: '26/09/21', name: 'Michael\'s Birthday'},{date: '27/09/21', name: 'Day After Michael\'s Birthday'}]
  res.locals.events = getEvents;
}

module.exports = eventController
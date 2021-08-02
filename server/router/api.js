const router = require('express').Router();
const eventController = require('../controllers/eventController.js');

// Get calendar events - send status 200 with events if success - catch err if not
// router.get('/getEvents',
// eventController.getEvents,(req, res) => {
//   try {
//     res.status(200).json(res.locals.events);
//   }
//   catch(err) {
//     console.log('There\'s an issue in the router: ',err)
//   }
// }
// );

module.exports = router;


const { Pool } = require('pg');
const path = require('path')
// // Load config
const dotenv = require('dotenv')
dotenv.config({path: path.join(__dirname, './config/config.env' )})
const apiRouter = require('./router/api');

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

fetch('')
  .then(response => response.json())
  .then(data => console.log(data));

// apiRouter.get("/", company.getUser, (req, res) => {
//   res.status(200).json(res.locals.User);
// });

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};

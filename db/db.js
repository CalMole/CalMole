const { Pool } = require('pg');
const path = require('path');
//const apiRouter = require('../server/router/api.js'); // This is due to be removed if we don't need to call apiRouter into this file
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '../server/config/config.env' )});

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: process.env.PG_URI,
});

// Export query functionality
module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};

// Currently commented out, are these in use @Eric? - From Michael
// fetch('')
//   .then(response => response.json())
//   .then(data => console.log(data));

// apiRouter.get("/", company.getUser, (req, res) => {
//   res.status(200).json(res.locals.User);
// });

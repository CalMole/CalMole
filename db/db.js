const { Pool } = require('pg');
const apiRouter = require('./router/api');

const PG_URI = "postgres://ehaxlbbw:ufL9jSIuQOqWUI4Fprd4HrstgeGRcEwa@chunee.db.elephantsql.com/ehaxlbbw ";

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
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

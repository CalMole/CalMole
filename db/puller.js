const { Pool } = require('pg');

const PG_URI = "postgres://ehaxlbbw:ufL9jSIuQOqWUI4Fprd4HrstgeGRcEwa@chunee.db.elephantsql.com/ehaxlbbw ";

// create a new pool here using the connection string above
const pool = new Pool({
  connectionString: PG_URI,
});


module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};

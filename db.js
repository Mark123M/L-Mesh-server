const {Pool} = require('pg');
const connectionString = process.env.PGSTRING;

/* const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
}); */

const pool = new Pool({
  connectionString,
});

module.exports = pool;

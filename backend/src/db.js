require('dotenv').config();
const { Pool, types } = require('pg');

// return DATE columns as plain 'YYYY-MM-DD' strings instead of JS Date objects
types.setTypeParser(1082, (value) => value);

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = pool;

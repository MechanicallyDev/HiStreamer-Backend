require('dotenv').config({ path: '../../' });

const config = {
  client: process.env.DATABASE_TYPE,
  connection: {
    host: '127.0.0.1',
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
module.exports = require('knex')(config);

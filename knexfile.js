require('dotenv').config({ path: './' });

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/dev_db.sqlite3',
    },
    migrations: {
      directory: './src/database/migrations',
    },
    useNullAsDefault: true,
  },

  production: {
    client: process.env.DATABASE_TYPE,
    connection: {
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
  },
};

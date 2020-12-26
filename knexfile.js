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
    client: 'mysql',
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
      directory: './src/database/migrations',
    },
  },
};

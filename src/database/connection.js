const knex = require('knex');

const configuration = require('../../knexfile');

if (process.env.NODE_ENV === 'development')
  const connection = knex(configuration.development);
else const connection = knex(configuration.production);
module.exports = connection;

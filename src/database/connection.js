const knex = require('knex');
require('dotenv').config({ path: '../../' });

const configuration = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';

const connection = knex(configuration[environment]);

module.exports = connection;

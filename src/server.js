const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./routes');
const config = require('./config');
const { auth } = require('./entities/users/auth/strategy');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
require('./database/redis/blocklist-accessToken');
require('./database/redis/allowlist-refreshToken');

const app = express();

var dbName = process.env.DATABASE_NAME;
var dbUser = process.env.DATABASE_USER;
var dbPassword = process.env.DATABASE_PASSWORD;

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@histreamerdb.jju4h.mongodb.net/${dbName}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

var originEnv =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://histreamer.com';
var corsOptions = {
  exposedHeaders: 'X-Total-Count',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  origin: originEnv,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
routes(app);

console.log(`Currently running on ${config.NODE_ENV} environment.`);

app.listen(config.PORT, config.HOST, () => {
  console.log(`API listening on http://${config.HOST}:${config.PORT}`);
});

const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const config = require('./config');
const { auth } = require('./entities/users/auth/strategy');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
require('./database/redis/blocklist-accessToken');
require('./database/redis/allowlist-refreshToken');

const app = express();

var whitelist = [
  'https://134.122.13.32',
  'http://localhost:3000',
  'https://www.histreamer.com',
];
var corsOptions = {
  exposedHeaders: 'X-Total-Count',
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
routes(app);

console.log(`Currently running on ${config.NODE_ENV} environment.`);

app.listen(config.PORT, config.HOST, () => {
  console.log(`API listening on http://${config.HOST}:${config.PORT}`);
});

const express = require('express');
bodyParser = require('body-parser');
const app = express();

const { auth } = require('./entities/users/auth/strategy');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

module.exports = app;

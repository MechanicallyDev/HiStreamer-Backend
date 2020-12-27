const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String,
  password: String,
  rule: String,
  picture: String,
  verified: Boolean,
  created_at: Date,
  updated_at: Date,
  last_login: Date,
});

module.exports = mongoose.model('user', userSchema);

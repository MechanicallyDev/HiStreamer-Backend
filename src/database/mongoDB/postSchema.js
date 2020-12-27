const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  image: String,
  author: String,
  slug: String,
  created_at: Date,
  updated_at: Date,
  last_login: Date,
});

module.exports = mongoose.model('post', postSchema);

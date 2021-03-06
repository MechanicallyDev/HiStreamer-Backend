const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  image: String,
  author: String,
  content: String,
  slug: String,
  tags: String,
  created_at: Date,
  updated_at: Date,
});

module.exports = mongoose.model('post', postSchema);

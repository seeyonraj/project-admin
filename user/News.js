const mongoose = require('mongoose');
const NewsSchema = new mongoose.Schema({
  title: String,
  description: String,
  url: String,
  imageUrl: String,
  published: Date
});
mongoose.model('24x7news', NewsSchema);

module.exports = mongoose.model('24x7news');
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
mongoose.model('24x7users', UserSchema);

module.exports = mongoose.model('24x7users');
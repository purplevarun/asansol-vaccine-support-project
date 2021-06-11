var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: String,
    password: String,
    dp: String
});
UserSchema.plugin(plm);
module.exports = mongoose.model('User', UserSchema);
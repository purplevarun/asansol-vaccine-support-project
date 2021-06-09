const mongoose = require('mongoose');
const passportlocalmongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
	email : {type: String, unique: true},
	username : String,
	password : String,
	dp : {type: String, default:"images/default-dp.png"},
	reserPasswordToken : String,
	resetPasswordExpires : Date
});

UserSchema.plugin(passportlocalmongoose);

module.exports = mongoose.model("User",UserSchema);
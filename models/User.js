const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  username: String,
  password: String,
  dp: {
    data: Buffer,
    contentType: String,
  },
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);

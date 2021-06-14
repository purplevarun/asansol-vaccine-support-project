const localstrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

// load user model

const User = require("./models/User");

module.exports = (passport) => {
  passport.use(
    new localstrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        // Match User
        User.findOne({ email: email }, (err, result) => {
          if (!result) {
            return done();
          }
        });
      }
    )
  );
};

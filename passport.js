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
            return done(null, false, {
              message: "This Email is not Registered!",
            });
          }
          // Match Password
          if (password === result.password) {
            return done(null, result);
          } else {
            return done(null, false, { message: "Password does not Match!" });
          }
        });
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

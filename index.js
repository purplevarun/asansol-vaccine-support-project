// importing stuff
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const local = require("passport-local");
const session = require("express-session");
// express config
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
// mongoose config
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
// passport config
const User = require("./models/User");
app.use(
  session({
    secret: "ye raaz bhi usi k saath chala gaya",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// routes config
const userRoutes = require("./routes/user");
const loginRoutes = require("./routes/login");
app.use("/", loginRoutes);
app.get("/*", (req, res) => {
  res.render("errorPage");
});
app.listen(port, () => {
  console.log("server started on port " + port);
});

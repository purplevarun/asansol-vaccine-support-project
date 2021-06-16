// importing stuff
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const User = require("./models/User");
const passport = require("passport");
const fs = require("fs");
// config
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
const mongourl = require("./data/mongoURL");
mongoose.connect(mongourl, (err) => {
  if (!err) console.log("mongo connected");
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.filename);
  },
});
const upload = multer({ storage: storage });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy(User.authenticate()));

// routes
var flash_type = null;
var flash_msg = null;
app.post("/register", upload.single("photo"), (req, res) => {
  var email = req.body.email;
  var pass = req.body.pass;
  var name = req.body.name;
  var pic;
  if (req.file) pic = req.file.path;
  else pic = "./uploads/default.png";
  const newUser = new User({
    email: email,
    name: name,
    password: pass,
    dp: {
      data: fs.readFileSync(pic),
      contentType: "image",
    },
  });
  console.log(newUser);
  res.redirect("/newUser/register");
});
app.get("/user/login", (req, res) => {
  res.render("login-page", { type: flash_type, msg: flash_msg });
});
app.get("/newUser/register", (req, res) => {
  res.render("register-page", { type: null, msg: null });
});
app.get("/", (req, res) => {
  res.render("home-page", {
    type: null,
    msg: null,
  });
});
app.get("/error", (req, res) => {
  res.render("error-page", {
    type: null,
    msg: null,
  });
});
app.get("/*", (req, res) => {
  res.redirect("/error");
});
app.listen(port, () => {
  console.log("server started..");
});

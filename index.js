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
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
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
app.use(
  session({ secret: "bihar ke lala", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
var flash_type = null;
var flash_msg = null;
app.post("/register", upload.single("photo"), (req, res, next) => {
  var email = req.body.email;
  var pass = req.body.pass;
  var name = req.body.name;
  var pic;
  if (req.file) pic = req.file.path;
  else pic = "./uploads/default.png";

  const newUser = new User({
    email: email,
    username: name,
    password: pass,
    dp: {
      data: fs.readFileSync(pic),
      contentType: "image",
    },
  });
  User.findOne({ email: email }, (err, result) => {
    if (result) {
      console.log("already reg result = " + result);
      flash_msg = "This Email is already registered..";
      flash_type = "alert alert-danger";
      return res.redirect("/newUser/register");
    } else {
      User.register(newUser, pass, (err, result) => {
        console.log("result = ", result);
        console.log("error = ", err);

        if (err) {
          flash_type = "alert alert-danger";
          flash_msg = err.message;
          res.redirect("/newUser/register");
        } else {
          flash_type = "alert alert-success";
          flash_msg = "Your Account has been created";
          res.redirect("/user/login");
        }
      });
    }
  });
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    console.log("user = ", user);
    console.log("info = ", info);
    if (!user) {
      flash_type = "alert alert-danger";
      flash_msg = info.message;
      return res.redirect("/user/login");
    } else {
      req.logIn(user, (err) => {
        if (err) return next(err);
        flash_type = "alert alert-success";
        flash_msg = "logged in";
        return res.redirect("/user/" + user.username);
      });
    }
  })(req, res, next);
});

app.get("/user/login", (req, res) => {
  res.render("login-page", { type: flash_type, msg: flash_msg });
  flash_type = null;
  flash_msg = null;
});

app.get("/user/:username", (req, res) => {
  if (!req.isAuthenticated()) {
    flash_type = "alert alert-danger";
    flash_msg = "You need to login to access that";
    res.redirect("/user/login");
  } else {
    const { username } = req.params;
    User.findOne({ username: username }, (err, result) => {
      res.render("dashboard", { user: result });
    });
  }
});
app.get("/newUser/register", (req, res) => {
  res.render("register-page", { type: flash_type, msg: flash_msg });
  flash_type = null;
  flash_msg = null;
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
app.get("*", (req, res) => {
  res.redirect("/error");
});
app.listen(port, () => {
  console.log("server started..");
});

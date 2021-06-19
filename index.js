// importing stuff
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const User = require("./models/User");
const Centers = require("./models/Centers");
const passport = require("passport");
const fs = require("fs");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const Clear = require("./data/Clear.js");
const mailer = require("nodemailer");
// Clear(); // Clears all the Database.. DO NOT USE
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
    cb(null, "uploads/temp");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
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
app.post("/register", upload.single("photo"), (req, res) => {
  var email = req.body.email;
  var pass = req.body.pass;
  var name = req.body.name;
  console.log("form photo = " + req.body.photo);
  var pic;
  console.log("req.file=" + req.file);
  if (req.file) pic = req.file.path;
  else pic = "./uploads/default.png";
  console.log("pic = " + pic);
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
app.get ('/guest', (req, res)=>{
	Centers.find({},(err,center)=>{
		res.render('guestDashboard', {Center:center});
	});
});
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    // console.log("user = ", user);
    // console.log("info = ", info);
    if (!user) {
      flash_type = "alert alert-danger";
      flash_msg = info.message;
      return res.redirect("/user/login");
    } else {
      req.logIn(user, (err) => {
        if (err) return next(err);
        // flash_type = "alert alert-success";
        // flash_msg = "logged in";
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
    flash_msg = "You need to login to access that page";
    res.redirect("/user/login");
  } else {
    if (req.user.username !== req.params.username) {
      flash_type = "alert alert-danger";
      flash_msg = "You cannot see other user's details";
      res.redirect("/user/login");
    } else {
      const { username } = req.params;
      User.findOne({ username: username }, (err, user) => {
        Centers.find({}, (err, centers) => {
          console.log("user=" + user + " centers = " + centers);
          res.render("dashboard", { user: user, centers: centers });
        });
      });
    }
  }
});
app.get("/user/:username/addCenter", (req, res) => {
  if (!req.isAuthenticated()) {
    flash_type = "alert alert-warning";
    flash_msg = "You need to login to access that page";
    res.redirect("/user/login");
  } else {
    User.findOne({ username: req.params.username }, (err, user) => {
      res.render("addcenter", { user: user });
    });
  }
});
app.post("/addcenter", upload.single("pic"), (req, res) => {
  var info = req.body;
  // console.log(info);
  var center_pic = req.file.path;
  console.log("vaccine center pic = " + center_pic);
  const newCenter = new Centers({
    name: info.name,
    address: info.address,
    contact: info.contact,
    vaccine_name: info.vaccine_name,
    photo: {
      data: fs.readFileSync(center_pic),
      contentType: "image",
    },
    doses: info.doses,
    by: info.by,
  });
  newCenter.save((err, result) => {
    console.log("result = " + result);
    console.log("error = " + err);
    if (!result) {
      console.log("there was error in inserting center");
      // console.log(err.message);
      res.redirect("/");
    } else {
      console.log("Center inserted successfully!");
      res.redirect("/user/" + info.by);
    }
  });
});
app.get("/newUser/register", (req, res) => {
  res.render("register-page", { type: flash_type, msg: flash_msg });
  flash_type = null;
  flash_msg = null;
});
app.get("/viewProfile/:username", (req, res) => {
  if (!req.isAuthenticated()) {
    flash_type = "alert alert-warning";
    flash_msg = "You need to Login to view other's profile";
    res.redirect("/user/login");
  } else {
    User.findOne({ username: req.params.username }, (err, user) => {
      Centers.find({}, (err2, Center) => {
        res.render("view-profile", { user: user, Centers: Center });
      });
    });
  }
});
app.get('/logout', (req, res)=>{
	req.logout();
	res.redirect('/');
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

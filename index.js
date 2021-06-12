var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;
var bodyparser = require("body-parser");
var multer = require("multer");
var passport = require("passport");
var nodemailer = require("nodemailer");
var express_session = require("express-session");
var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/uploads");
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  },
});
var upload = multer({ storage: storage });
var User = require("./DataBase_Model/User");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  express_session({
    secret: "hehe boi",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost/Vaccine", (err) => {
  if (!err) console.log("Connected to Database");
});
app.listen(port, () => {
  console.log(`server running at ${port}`);
});
app.get("/", (req, res) => {
  res.render("homepage");
});
app.get("/login", (req, res) => {
  res.render("loginpage");
});
app.get("/register", (req, res) => {
  res.render("registerpage");
});
app.post("/register", upload.single("photo"), (req, res) => {
  var data = req.body;
  var em = data["email"];
  var un = data["username"];
  var pw = data["password"];
  var pic;
  if (req.file) {
    console.log("dp is uploaded");
    pic = req.file.filename;
  } else {
    console.log("no dp was uploaded");
    pic = "defaultdp.jpg";
  }
  res.redirect("/register");
});

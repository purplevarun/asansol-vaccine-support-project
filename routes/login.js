const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const fs = require("fs");
const passport = require("passport");
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
});
const upload = multer({ storage: storage });
router.get("/", (req, res) => {
  res.render("home");
});
router.get("/login", (req, res) => {
  res.render("loginPage");
});
router.get("/register", (req, res) => {
  res.render("registerPage");
});
router.post("/register", upload.single("pic"), (req, res, next) => {
  var dp;
  if (req.file) {
    console.log("file was uploaded " + req.file.filename);
    dp = req.file.path;
  } else {
    console.log("no file was uploaded");
    dp = "uploads\\default.png";
  }
  var em = req.body.email,
    nm = req.body.name,
    pw = req.body.password;
  //console.log({ em, nm, pw, dp });
  var newUser = new User({
    email: em,
    username: nm,
    password: pw,
    dp: {
      data: fs.readFileSync(dp),
      contentType: "image",
    },
  });
  User.register(newUser, req.body.password, function (err, user, info) {
    if (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
    req.flash("success", "You can now Login!");
    res.redirect("/login");
  });
});
module.exports = router;

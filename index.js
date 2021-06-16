// importing stuff
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
// config
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
// routes
app.get("/user/login", (req, res) => {
  res.render("login-page", { type: null, msg: null });
});
app.get("/newUser/register", (req, res) => {
  res.render("register-page");
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

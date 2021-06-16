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
  res.render("login-page");
});
app.get("/newUser/register", (req, res) => {
  res.render("register-page");
});
app.get("/", (req, res) => {
  res.render("homepage", {
    heading: "Asansol Vaccine Support",
    type: null,
    msg: null,
  });
});
app.get("/*", (req, res) => {
  res.render("errorpage", {
    heading: "This Page is Not Available",
    type: null,
    msg: null,
  });
});
app.listen(port, () => {
  console.log("server started..");
});

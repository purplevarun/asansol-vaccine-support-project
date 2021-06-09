var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(express.static("public"));

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

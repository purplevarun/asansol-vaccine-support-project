var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;
var bodyparser = require("body-parser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
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
app.post("/register", (req, res) => {
  var data = req.body;
  console.log(data);
  res.redirect("/register");
});

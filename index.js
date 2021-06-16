const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const flash = require("connect-flash");
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/*", (req, res) => {
  res.render("errorpage");
});
app.listen(port, () => {
  console.log("server started on port " + port);
});

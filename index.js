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
app.get("/", (req, res) => {
  res.render("homepage",{heading:null,type:null,msg:null});
});
app.get("/*", (req, res) => {
  res.render("errorpage",{heading:'This Page is Not Available', type:null,msg:null});
});
app.listen(port, () => {
  console.log("server started..");
});

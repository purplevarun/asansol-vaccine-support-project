var express = require("express");
var app = express();
var mongoose = require("mongoose");
var port = process.env.PORT || 3000;
var bodyparser = require("body-parser");
var multer = require("multer");
var passport = require("passport");
var nodemailer = require("nodemailer");
var storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/uploads");
    },
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    },
});
var upload = multer({ storage: storage });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.connect('mongodb://localhost', (err) => {
    if (!err)
        console.log("Connected to Database");
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

    console.log(data);
    res.redirect("/register");
});
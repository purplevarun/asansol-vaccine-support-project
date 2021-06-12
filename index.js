const express = require("express");
const bodyparser = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const multer = require("multer");
// multer settings
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
});
const upload = multer({ storage: storage });
// express connection
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.listen(port, () => {
  console.log("Server Running at " + port);
});

// mongodb connection
const mongourl =
  "mongodb+srv://purplevarun:pikachu24@cluster0.emytc.mongodb.net/VaccineProject";
mongoose.set("useUnifiedTopology", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useCreateIndex", true);
mongoose.connect(mongourl, (err) => {
  if (err) console.log(err);
  console.log("DB Connected");
});

// routes
app.get("/", (req, res) => {
  res.render("front");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register");
});

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

// Schemas
const User = require("./models/User");
// routes
app.get("/", (req, res) => {
  res.render("front");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/register", (req, res) => {
  res.render("register", { error: "", msg: "" });
});
app.post("/register", upload.single("photo"), (req, res) => {
  // console.log(req.body);
  var em = req.body.email;
  var nm = req.body.name;
  var pw = req.body.password;
  var pic;
  if (req.file) {
    pic = req.file.filename;
    console.log("dp uploaded = " + pic);
  } else {
    pic = "defaultdp.jpg";
    console.log("no dp uploaded");
  }
  console.log(`${em}, ${nm}, ${pw}, ${pic}`);
  var error, msg;
  User.findOne({ email: em }).then((user) => {
    if (user) {
      console.log("already exist");
      error = "This Email already exists!";
      res.render("register", { error: error, msg: msg });
    } else {
      const NewUser = new User({
        email: em,
        name: nm,
        password: pw,
        dp: pic,
      });
      NewUser.save()
        .then(() => {
          console.log("New User added" + NewUser);
        })
        .catch((err) => console.log(err));
      res.render("/register", {
        error: "",
        msg: 'Your Account has been created! You can now <a href="/login">Login</a>',
      });
    }
  });
});

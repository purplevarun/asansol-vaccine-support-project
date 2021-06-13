const express = require("express");
const bodyparser = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const multer = require("multer");
const path = require("path");
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
// app.use(bodyparser.json());
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
  res.render("login", { error: "", regbtn: false });
});
app.get("/register", (req, res) => {
  res.render("register", { error: "", msg: "", loginbtn: false });
});
app.post("/register", upload.single("photo"), (req, res) => {
  console.log(req.body);
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
  // validation..
  if (pw.length < 6) {
    res.render("register", {
      error: "Password should be atleast 6 letters!",
      msg: "",
      loginbtn: false,
    });
  } else {
    User.findOne({ email: em }, (err, result) => {
      console.log("result = ", result);
      if (result) {
        console.log("already exist");
        res.render("register", {
          error: "This Email already exists",
          msg: "",
          loginbtn: false,
        });
      } else {
        const NewUser = new User({
          email: em,
          name: nm,
          password: pw,
          dp: pic,
        });
        NewUser.save((err, result) => {
          if (err) console.log(err);
          else console.log("new user added = ", result);
        });
        res.render("register", {
          error: "",
          msg: "Your Account has been created!",
          loginbtn: true,
        });
      }
    });
  }
});
app.post("/login", (req, res) => {
  var em = req.body.email;
  var pw = req.body.password;
  // console.log(em, pw);
  User.findOne({ email: em }, (err, result) => {
    if (err) console.log(err);
    else {
      // console.log("result = ", result);
      if (result == null) {
        res.render("login", {
          error: "You do not have an account yet!",
          regbtn: true,
        });
      } else {
        if (result.password == pw) {
          current_user = result.id;
          res.redirect("/dashboard/user/" + result.id);
        } else {
          res.render("login", { error: "Wrong Password!", regbtn: false });
        }
      }
    }
  });
});
app.get("/dashboard/user/:id", (req, res) => {
  var objid = req.params.id;
  User.findById(objid, (err, result) => {
    if (result) {
      res.render("dash", { info: result });
    } else {
      res.redirect("/user/not/found");
    }
  });
});
app.get("/*", (req, res) => {
  res.send(
    "<style>*{text-align:center;}</style>\
    <h1>Page Not Found</h1><a href='/login'>\
    <button>Go Back</button></a>"
  );
});

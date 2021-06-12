const express = require("express");
const bodyparser = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const mongourl =
  "mongodb+srv://purplevarun:pikachu24@cluster0.emytc.mongodb.net/VaccineProject/Users";
mongoose.set("useUnifiedTopology", true);
mongoose.set(useNewUrlParser, true);
mongoose.connect(mongourl, (err) => {
  if (err) console.log(err);
  console.log("DB Connected");
});
app.listen(port, () => {
  console.log("Server Running at " + port);
});

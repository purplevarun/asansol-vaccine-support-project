const User = require("../models/User.js");
const Centers = require("../models/Centers.js");
module.exports = () => {
  User.deleteOne({}, (err) => {
    if (err) console.log(err);
    console.log("Users Cleared");
  });
  Centers.deleteOne({}, (err) => {
    if (err) console.log(err);
    console.log("Centers Cleared");
  });
};

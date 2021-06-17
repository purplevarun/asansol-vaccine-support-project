var mongoose = require("mongoose");

var shopsSchema = new mongoose.Schema({
  name: String,
  address: String,
  contact: String,
  vaccine_name: String,
  doses: String,
  by: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Centers", shopsSchema);

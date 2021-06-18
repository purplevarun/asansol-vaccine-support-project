var mongoose = require("mongoose");

var centerSchema = new mongoose.Schema({
  name: String,
  address: String,
  contact: String,
  vaccine_name: String,
  photo: {
    type: Buffer,
    contentType: String,
  },
  doses: String,
  by: String,
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Centers", centerSchema);

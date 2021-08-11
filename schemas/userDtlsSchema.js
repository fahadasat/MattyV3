const mongoose = require("mongoose");

//database table for message that uses the userID for the unique id and saves the total message and messages for this month

const userDtlsSchema = mongoose.Schema({
  _id: String,
  username: String,
  totalMessage: Number,
  avgMessage: Number,
  avgVC: Number,
  channels: Array,
  totalTimeVC: Number,
  totalVC: Array,
  allWords: Array,
});

module.exports = mongoose.model("userDtls", userDtlsSchema);

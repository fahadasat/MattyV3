const mongoose = require("mongoose");

//database table relating to stocks

const stocksSchema = mongoose.Schema({
  _id: String,
  watchlist: Array,
  cash: Number,
  portfolio: Array,
});

module.exports = mongoose.model("stocks", stocksSchema);

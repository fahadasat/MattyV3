const mongoose = require("mongoose");

//database table for movies

const moviesSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
});

module.exports = mongoose.model("movies", moviesSchema);

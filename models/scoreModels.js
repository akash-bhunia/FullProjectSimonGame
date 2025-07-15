const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  highScore: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("Score", scoreSchema);

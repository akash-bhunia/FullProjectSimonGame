const Score = require("../models/scoreModels.js");

exports.renderGamePage = async (req, res) => {
  let score = await Score.findOne();
  if (!score) score = await Score.create({ highScore: 0 });
  res.render("index", { highScore: score.highScore });
};

exports.getHighScore = async (req, res) => {
  let record = await Score.findOne();
  if (!record) record = await Score.create({ highScore: 0 });
  res.json({ highScore: record.highScore });
};

exports.updateHighScore = async (req, res) => {
  const { score } = req.body;
  let record = await Score.findOne();
  if (!record) record = await Score.create({ highScore: score });

  if (score > record.highScore) {
    record.highScore = score;
    await record.save();
  }

  res.json({ highScore: record.highScore });
};

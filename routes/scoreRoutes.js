const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/scoreController");

router.get("/", scoreController.renderGamePage);
router.get("/score", scoreController.getHighScore);
router.post("/score", scoreController.updateHighScore);

module.exports = router;

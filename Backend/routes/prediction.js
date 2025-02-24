const express = require("express");
const { predictMarketTrend } = require("../controllers/predictionController");

const router = express.Router();

router.post("/trend", predictMarketTrend);

module.exports = router;

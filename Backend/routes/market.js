const express = require("express");
const Market = require("../models/Market");
const router = express.Router();
const {
  createMarket,
  settleMarket,
  listMarkets,
  fetchMarketData,
} = require("../controllers/marketController");

router.post("/create", createMarket);
router.put("/settle", settleMarket);
router.get("/list", listMarkets);
router.get("/data", fetchMarketData);

module.exports = router;

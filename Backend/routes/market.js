const express = require("express");
const Market = require("../models/Market");
const router = express.Router();
const settlementController = require("./controllers/MarketSettlementController");

router.post("/create", async (req, res) => {
  const { title, description, creator } = req.body;

  const market = new Market({ title, description, creator });
  await market.save();

  res.json(market);
});

router.get("/list", async (req, res) => {
  const markets = await Market.find().populate("creator");
  res.json(markets);
});

app.post("/:marketId/settle", async (req, res) => {
  try {
    const result = await settlementController.settleMarket(req.params.marketId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

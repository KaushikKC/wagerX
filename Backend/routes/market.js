const express = require("express");
const Market = require("../models/Market");
const router = express.Router();

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

module.exports = router;

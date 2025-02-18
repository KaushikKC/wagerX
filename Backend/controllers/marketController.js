const Market = require("../models/Market");

exports.createMarket = async (req, res) => {
  try {
    const { title, description, creator } = req.body;
    const market = new Market({ title, description, creator });
    await market.save();
    res.json(market);
  } catch (error) {
    res.status(500).json({ message: "Error creating market", error });
  }
};

exports.listMarkets = async (req, res) => {
  try {
    const markets = await Market.find().populate("creator");
    res.json(markets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching markets", error });
  }
};

exports.settleMarket = async (req, res) => {
  try {
    const { marketId, winner } = req.body;
    const market = await Market.findById(marketId);
    if (!market) return res.status(404).json({ message: "Market not found" });

    market.status = "completed";
    market.winner = winner;
    await market.save();

    res.json({ message: "Market settled", market });
  } catch (error) {
    res.status(500).json({ message: "Error settling market", error });
  }
};

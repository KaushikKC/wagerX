const Bet = require("../models/Bet");
const Market = require("../models/Market");

exports.placeBet = async (req, res) => {
  try {
    const { marketId, user, amount } = req.body;

    const market = await Market.findById(marketId);
    if (!market) return res.status(404).json({ message: "Market not found" });

    const bet = new Bet({ market: marketId, user, amount });
    await bet.save();

    res.json({ message: "Bet placed successfully", bet });
  } catch (error) {
    res.status(500).json({ message: "Error placing bet", error });
  }
};

exports.getBetsByMarket = async (req, res) => {
  try {
    const { marketId } = req.params;
    const bets = await Bet.find({ market: marketId }).populate("user");
    res.json(bets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bets", error });
  }
};

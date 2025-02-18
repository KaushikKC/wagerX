const Bet = require("../models/Bet");
const Market = require("../models/Market");
const User = require("../models/User");

exports.placeBet = async (req, res) => {
  try {
    const { marketId, amount, option, walletAddress } = req.body;

    const market = await Market.findById(marketId);
    if (!market || market.status !== "active") {
      return res.status(400).json({ message: "Invalid market" });
    }

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add bet to market
    market.bets.push({
      user: user._id,
      amount,
      option,
    });
    market.totalPool += amount;
    await market.save();

    // Update user's betting history
    user.bettingHistory.push({
      market: market._id,
      amount,
      outcome: "pending",
    });
    await user.save();

    // Broadcast bet placement
    WebSocketServer.broadcast("NEW_BET", {
      marketId,
      user: user.username,
      amount,
      option,
    });

    res.json({ message: "Bet placed successfully" });
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

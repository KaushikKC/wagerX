const Bet = require("../models/Bet");
const Market = require("../models/Market");
const User = require("../models/User");
const WebSocketServer = require("../utils/websocket").getInstance();

const executeBetOnChain = async (betData) => {
  return Promise.resolve({ success: true, txHash: "0xABC123" });
};

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

    const maxBet = user.riskTolerance * 100;
    if (amount > maxBet) {
      return res.status(400).json({
        message: `Bet amount exceeds risk tolerance. Maximum allowed: ${maxBet}`
      });
    }

    const onChainResult = await executeBetOnChain({
      marketId,
      amount,
      option,
      walletAddress
    });
    if (!onChainResult.success) {
      return res
        .status(500)
        .json({ message: "Smart contract execution failed" });
    }

    const bet = await Bet.create({
      market: market._id,
      user: user._id,
      amount,
      option
    });

    market.bets.push(bet._id);
    market.totalPool += amount;
    if (!market.participants.includes(user._id)) {
      market.participants.push(user._id);
    }
    await market.save();

    user.bettingHistory.push({
      market: market._id,
      amount,
      outcome: "pending"
    });
    await user.save();

    if (WebSocketServer) {
      WebSocketServer.broadcast("NEW_BET", {
        marketId,
        user: user.username,
        amount,
        option
      });
    } else {
      console.warn(
        "WebSocketServer instance is not available; skipping broadcast"
      );
    }

    res.json({ message: "Bet placed successfully", bet });
  } catch (error) {
    console.error("Error placing bet:", error);
    res
      .status(500)
      .json({ message: "Error placing bet", error: error.message });
  }
};

exports.getBetsByMarket = async (req, res) => {
  try {
    const { marketId } = req.params;
    const bets = await Bet.find({ market: marketId }).populate("user");
    res.json(bets);
  } catch (error) {
    console.error("Error fetching bets:", error);
    res
      .status(500)
      .json({ message: "Error fetching bets", error: error.message });
  }
};

exports.cancelBet = async (req, res) => {
  try {
    const { betId, walletAddress } = req.body;

    const bet = await Bet.findById(betId).populate("market user");
    console.log(bet);
    if (!bet) {
      return res.status(404).json({ message: "Bet not found" });
    }

    if (bet.user.walletAddress !== walletAddress) {
      return res
        .status(403)
        .json({ message: "Unauthorized to cancel this bet" });
    }

    const market = await Market.findById(bet.market._id);
    if (!market || market.status !== "active") {
      return res.status(400).json({ message: "Market is not active" });
    }

    // Remove the bet from the market
    market.bets = market.bets.filter((b) => b.toString() !== betId);
    market.totalPool -= bet.amount;
    await market.save();

    // Remove the bet from the user's history
    bet.user.bettingHistory = bet.user.bettingHistory.filter(
      (b) => b.market.toString() !== bet.market._id.toString()
    );
    await bet.user.save();

    // Delete the bet
    await Bet.findByIdAndDelete(betId);

    // Notify via WebSocket
    if (WebSocketServer) {
      WebSocketServer.broadcast("BET_CANCELLED", {
        marketId: market._id,
        user: bet.user.username,
        amount: bet.amount
      });
    }

    res.json({ message: "Bet cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling bet:", error);
    res
      .status(500)
      .json({ message: "Error cancelling bet", error: error.message });
  }
};

/**
 * Retrieves the current bet status from the smart contract.
 */
exports.getBetStatus = async (req, res) => {
  try {
    const { betId } = req.params;

    const bet = await Bet.findById(betId);
    if (!bet) {
      return res.status(404).json({ message: "Bet not found" });
    }

    // Simulating smart contract bet status retrieval
    const contractStatus = "pending"; // Replace with actual on-chain call

    res.json({ betId, status: contractStatus });
  } catch (error) {
    console.error("Error fetching bet status:", error);
    res
      .status(500)
      .json({ message: "Error fetching bet status", error: error.message });
  }
};

const axios = require("axios");
const Market = require("../models/Market");
const Bet = require("../models/Bet");
const User = require("../models/User");
const WebSocketServer = require("../utils/websocket").getInstance();

exports.createMarket = async (req, res) => {
  try {
    const { title, description, creator, endDate, options } = req.body;

    let user = await User.findOne({ walletAddress: creator });
    if (!user) {
      user = new User({ walletAddress: creator });
      await user.save();
    }

    const market = new Market({
      title,
      description,
      creator: user._id,
      endDate,
      options,
      status: "active",
      totalPool: 0
    });

    await market.save();

    const populatedMarket = await Market.findById(market._id).populate(
      "creator"
    );

    if (WebSocketServer) {
      WebSocketServer.broadcast("NEW_MARKET", {
        market: {
          ...populatedMarket.toObject(),
          marketId: market._id
        }
      });
    } else {
      console.warn(
        "WebSocketServer instance is not available; skipping broadcast"
      );
    }

    res.json({
      success: true,
      market: {
        ...populatedMarket.toObject(),
        marketId: market._id
      }
    });
  } catch (error) {
    console.error("Market creation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating market",
      error: error.message
    });
  }
};

exports.settleMarket = async (req, res) => {
  try {
    const { marketId, winningOption } = req.body;

    const market = await Market.findById(marketId).populate("bets.user");

    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }

    market.status = "completed";
    market.winningOption = winningOption;

    const winningBets = market.bets.filter(
      (bet) => bet.option === winningOption
    );
    const totalWinningBets = winningBets.reduce(
      (sum, bet) => sum + bet.amount,
      0
    );

    for (const bet of winningBets) {
      const winningAmount = (bet.amount / totalWinningBets) * market.totalPool;
      await bet.user.updateStats({
        won: true,
        amount: winningAmount
      });
    }

    await market.save();
    if (WebSocketServer) {
      WebSocketServer.broadcast("MARKET_SETTLED", {
        marketId,
        winningOption,
        totalPool: market.totalPool
      });
    }

    res.json({
      success: true,
      message: "Market settled successfully",
      marketId: market._id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error settling market",
      error: error.message
    });
  }
};

exports.listMarkets = async (req, res) => {
  try {
    const markets = await Market.find()
      .populate("creator")
      .select("-__v")
      .lean();

    const marketsWithId = markets.map((market) => ({
      ...market,
      marketId: market._id
    }));

    res.json({
      success: true,
      markets: marketsWithId
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching markets",
      error: error.message
    });
  }
};

// cross check with url, I hv added dummy url as of now
exports.fetchMarketData = async (req, res) => {
  try {
    const response = await axios.get(process.env.KANA_API_URL);
    const data = response.data;

    res.status(200).json({
      success: true,
      data,
      message: "Market data fetched successfully"
    });
  } catch (error) {
    console.error("Fetch Market Data error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching market data",
      details: error.message
    });
  }
};

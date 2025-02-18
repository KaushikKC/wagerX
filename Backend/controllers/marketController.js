const Market = require("../models/Market");

const { WebSocketServer } = require("../utils/websocket");

exports.createMarket = async (req, res) => {
  try {
    const { title, description, creator, endDate, options } = req.body;

    const market = new Market({
      title,
      description,
      creator,
      endDate,
      options,
      status: "active",
      totalPool: 0,
    });

    await market.save();
    WebSocketServer.broadcast("NEW_MARKET", { market });
    res.json(market);
  } catch (error) {
    res.status(500).json({ message: "Error creating market", error });
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

    // Calculate and distribute winnings
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
        amount: winningAmount,
      });
    }

    await market.save();

    // Broadcast market settlement
    WebSocketServer.broadcast("MARKET_SETTLED", {
      marketId,
      winningOption,
      totalPool: market.totalPool,
    });

    res.json({ message: "Market settled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error settling market", error });
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

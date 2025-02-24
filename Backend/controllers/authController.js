const User = require("../models/User");
const Market = require("../models/Market");

exports.loginUser = async (req, res) => {
  const { walletAddress } = req.body;

  try {
    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress });
      await user.save();
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.updateUserSettings = async (req, res) => {
  const { walletAddress, riskTolerance, leverage, aiAutomation } = req.body;

  try {
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (typeof riskTolerance !== "undefined")
      user.riskTolerance = riskTolerance;
    if (typeof leverage !== "undefined") user.leverage = leverage;
    if (typeof aiAutomation !== "undefined") user.aiAutomation = aiAutomation;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "User settings updated", user });
  } catch (error) {
    console.error("Update Settings Error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.getUserProfile = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const user = await User.findOne({ walletAddress })
      .select({
        walletAddress: 1,
        username: 1,
        totalBets: 1,
        winningBets: 1,
        totalWinnings: 1,
        riskTolerance: 1,
        leverage: 1,
        aiAutomation: 1,
        bettingHistory: 1,
        createdAt: 1,
        updatedAt: 1
      })
      .populate({
        path: "bettingHistory.market",
        model: "Market",
        select: "title description status winner createdAt"
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const stats = {
      winRate:
        user.totalBets > 0 ? (user.winningBets / user.totalBets) * 100 : 0,
      averageWinnings:
        user.winningBets > 0 ? user.totalWinnings / user.winningBets : 0
    };

    res.status(200).json({
      success: true,
      profile: {
        ...user.toObject(),
        stats
      }
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the user profile"
    });
  }
};

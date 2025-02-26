const User = require("../models/User");

exports.loginUser = async (req, res) => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    return res.status(400).json({ message: "Wallet address is required" });
  }

  let user = await User.findOne({ walletAddress });

  if (!user) {
    user = new User({ walletAddress, username: "Anon" });
    await user.save();
  }

  res.json({ user });
};

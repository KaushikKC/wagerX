const jwt = require("jsonwebtoken");

const authenticateMovementWallet = async (req, res, next) => {
  const { walletAddress } = req.body;

  if (!walletAddress)
    return res.status(401).json({ message: "No wallet provided" });

  // Generate JWT for user session
  req.user = { walletAddress };
  next();
};

module.exports = authenticateMovementWallet;

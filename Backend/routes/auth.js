const express = require("express");
const authenticateMovementWallet = require("../utils/movementAuth");
const User = require("../models/User");
const router = express.Router();

router.post("/login", authenticateMovementWallet, async (req, res) => {
  let user = await User.findOne({ walletAddress: req.user.walletAddress });

  if (!user) {
    user = new User({
      walletAddress: req.user.walletAddress,
      username: "Anon",
    });
    await user.save();
  }

  res.json({ user });
});

module.exports = router;

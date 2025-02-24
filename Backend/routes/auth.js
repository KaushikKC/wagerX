const express = require("express");
const {
  loginUser,
  updateUserSettings,
  getUserProfile
} = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginUser);
router.put("/update", updateUserSettings);
router.get("/profile/:walletAddress", getUserProfile);
module.exports = router;

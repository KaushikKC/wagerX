const express = require("express");
const {
  placeBet,
  getBetsByMarket,
  cancelBet,
  getBetStatus
} = require("../controllers/betController");

const router = express.Router();

router.post("/place", placeBet);
router.get("/:marketId", getBetsByMarket);
router.post("/cancel", cancelBet);
router.get("/status/:betId", getBetStatus);

module.exports = router;

const express = require("express");
const { placeBet, getBetsByMarket } = require("../controllers/betController");

const router = express.Router();

router.post("/place", placeBet);
router.get("/:marketId", getBetsByMarket);

module.exports = router;

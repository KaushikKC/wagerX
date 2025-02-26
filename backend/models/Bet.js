const mongoose = require("mongoose");

const BetSchema = new mongoose.Schema({
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bet", BetSchema);

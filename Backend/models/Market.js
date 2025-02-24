const mongoose = require("mongoose");

const MarketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  bets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bet" }],
  totalPool: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "completed"], default: "active" },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Market", MarketSchema);

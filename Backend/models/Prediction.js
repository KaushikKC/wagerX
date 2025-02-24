const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  market: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Market",
    required: true
  },
  predictedTrend: {
    type: String,
    enum: ["bullish", "bearish", "neutral"],
    required: true
  },
  tradeSignal: { type: String, enum: ["buy", "sell", "hold"], required: true },
  confidence: { type: Number, default: 0.5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prediction", PredictionSchema);

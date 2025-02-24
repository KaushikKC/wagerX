const Prediction = require("../models/Prediction");
const Market = require("../models/Market");

// Dummy function to simulate AI market trend analysis.
// Replace this with your actual AI logic later.
const analyzeMarketTrend = (marketData) => {
  const trends = ["bullish", "bearish", "neutral"];
  const signals = ["buy", "sell", "hold"];
  const randomTrend = trends[Math.floor(Math.random() * trends.length)];
  const randomSignal = signals[Math.floor(Math.random() * signals.length)];
  const confidence = parseFloat(Math.random().toFixed(2));
  return { predictedTrend: randomTrend, tradeSignal: randomSignal, confidence };
};

exports.predictMarketTrend = async (req, res) => {
  try {
    const { marketId } = req.body;

    let marketData = null;
    if (marketId) {
      marketData = await Market.findById(marketId);
      if (!marketData) {
        return res
          .status(404)
          .json({ success: false, message: "Market not found" });
      }
    }

    const predictionResult = analyzeMarketTrend(marketData);

    const prediction = new Prediction({
      market: marketId,
      predictedTrend: predictionResult.predictedTrend,
      tradeSignal: predictionResult.tradeSignal,
      confidence: predictionResult.confidence
    });

    await prediction.save();

    res.status(200).json({
      success: true,
      message: "Market trend predicted successfully",
      prediction
    });
  } catch (error) {
    console.error("Predict Market Trend error:", error);
    res.status(500).json({
      success: false,
      message: "Error predicting market trend",
      error: error.message
    });
  }
};

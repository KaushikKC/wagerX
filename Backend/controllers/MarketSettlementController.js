const Market = require("../models/Market");
const PythOracleService = require("../utils/PythOracleService");
const { WebSocketServer } = require("../utils/websocket");

class MarketSettlementController {
  constructor() {
    this.pythOracle = new PythOracleService();
  }

  async settleMarket(marketId) {
    try {
      const market = await Market.findById(marketId);
      if (!market || market.status !== "active") {
        throw new Error("Invalid market or market already settled");
      }

      const settlementData = {
        priceId: market.oracleConfig.priceId,
        targetPrice: market.oracleConfig.targetPrice,
        tolerance: market.oracleConfig.tolerance,
      };

      const settlementResult = await this.pythOracle.verifySettlement(
        marketId,
        settlementData
      );

      if (!settlementResult.verified) {
        throw new Error("Settlement verification failed");
      }

      const proof = await this.pythOracle.generateSettlementProof(
        marketId,
        settlementResult
      );

      // Update market status and settlement data
      market.status = "settled";
      market.settlementData = {
        price: settlementResult.settlementPrice,
        timestamp: settlementResult.pythTimestamp,
        proof: proof,
      };

      await this.distributeWinnings(market, settlementResult.settlementPrice);
      await market.save();

      // Broadcast settlement
      WebSocketServer.getInstance().broadcast("MARKET_SETTLED", {
        marketId: market._id,
        settlementData: market.settlementData,
      });

      return {
        success: true,
        settlement: market.settlementData,
      };
    } catch (error) {
      console.error("Market settlement failed:", error);
      throw error;
    }
  }

  async distributeWinnings(market, settlementPrice) {
    // Implement your winning distribution logic here
    // This would depend on your specific market rules
  }
}

module.exports = new MarketSettlementController();

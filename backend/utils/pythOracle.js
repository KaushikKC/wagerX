const axios = require("axios");
const { EvmPriceServiceConnection } = require("@pythnetwork/pyth-evm-js");
const { ethers } = require("ethers");

class PythOracleService {
  constructor(pythNetworkUrl = "https://xc-testnet.pyth.network") {
    this.connection = new EvmPriceServiceConnection(pythNetworkUrl);
    this.priceIds = new Map([
      [
        "ETH/USD",
        "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace",
      ],
      [
        "BTC/USD",
        "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43",
      ],
      [
        "SOL/USD",
        "0xef0d8b6fda2ceba41da15d4095d1da392a0d2f8ed0c6c7bc0f4cfac8c280b56d",
      ],
    ]);
  }

  async getPriceUpdateData(priceId) {
    try {
      const priceFeeds = await this.connection.getLatestPriceFeeds([priceId]);
      if (!priceFeeds || priceFeeds.length === 0) {
        throw new Error("No price feed data available");
      }

      const priceFeed = priceFeeds[0];
      return {
        price: priceFeed.price.price,
        conf: priceFeed.price.conf,
        timestamp: priceFeed.price.publishTime,
        expo: priceFeed.price.expo,
      };
    } catch (error) {
      console.error(`Error fetching price data for ${priceId}:`, error);
      throw error;
    }
  }

  async getVerifiedPrice(priceId) {
    try {
      const updateData = await this.getPriceUpdateData(priceId);
      const formattedPrice = this.formatPrice(
        updateData.price,
        updateData.expo
      );

      return {
        price: formattedPrice,
        confidence: this.formatPrice(updateData.conf, updateData.expo),
        timestamp: updateData.timestamp,
        verified: true,
      };
    } catch (error) {
      console.error("Error getting verified price:", error);
      throw error;
    }
  }

  formatPrice(price, expo) {
    return Number(price) * Math.pow(10, expo);
  }

  async verifySettlement(marketId, settlementData) {
    try {
      const { priceId, targetPrice, tolerance = 0.01 } = settlementData;

      if (!this.priceIds.has(priceId)) {
        throw new Error("Unsupported price feed");
      }

      const pythData = await this.getVerifiedPrice(this.priceIds.get(priceId));
      const priceDifference =
        Math.abs(pythData.price - targetPrice) / targetPrice;

      return {
        verified: priceDifference <= tolerance,
        settlementPrice: pythData.price,
        pythTimestamp: pythData.timestamp,
        confidence: pythData.confidence,
      };
    } catch (error) {
      console.error("Settlement verification failed:", error);
      throw error;
    }
  }

  async generateSettlementProof(marketId, settlementResult) {
    try {
      const proof = {
        marketId,
        timestamp: Date.now(),
        pythData: settlementResult,
        signature: await this.signSettlementData(settlementResult),
      };

      return proof;
    } catch (error) {
      console.error("Error generating settlement proof:", error);
      throw error;
    }
  }

  async signSettlementData(data) {
    // This would be implemented with your specific signing mechanism
    // Example using ethers wallet:
    const wallet = new ethers.Wallet(process.env.SETTLEMENT_PRIVATE_KEY);
    const message = ethers.utils.solidityKeccak256(
      ["string", "uint256", "uint256"],
      [data.marketId, data.settlementPrice, data.pythTimestamp]
    );
    return wallet.signMessage(ethers.utils.arrayify(message));
  }
}

module.exports = PythOracleService;

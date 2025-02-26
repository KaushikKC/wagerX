require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");

// MongoDB Models
const PriceSchema = new mongoose.Schema({
  id: String,
  price: Number,
  confidence: Number,
  publish_time: Number,
});

const BTCPrice = mongoose.model("BTCPrice", PriceSchema, "btc_prices");
const ETHPrice = mongoose.model("ETHPrice", PriceSchema, "eth_prices");

// API Constants
const API_URL = "https://hermes.pyth.network/v2/updates/price";
const BTC_ID =
  "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43";
const ETH_ID =
  "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace";

// Generate timestamps for the past 2 years (2 per month)
const generateTimestamps = () => {
  const timestamps = [];
  const now = Math.floor(Date.now() / 1000);

  for (let i = 0; i < 24; i++) {
    // First timestamp around beginning of month
    const timestamp1 = now - i * 30 * 24 * 60 * 60;
    timestamps.push(timestamp1);

    // Second timestamp around middle of month (15 days later)
    const timestamp2 = now - (i * 30 * 24 * 60 * 60 + 15 * 24 * 60 * 60);
    timestamps.push(timestamp2);
  }

  return timestamps.reverse();
};

// Normalize ID by removing '0x' prefix if present
const normalizeId = (id) => {
  return id.startsWith("0x") ? id.substring(2) : id;
};

// Fetch price data from Pyth API
const fetchPriceData = async (timestamp) => {
  try {
    const response = await axios.get(`${API_URL}/${timestamp}`, {
      params: { ids: [BTC_ID, ETH_ID] },
    });

    if (response.data && response.data.parsed) {
      return response.data.parsed.map((item) => ({
        id: item.id,
        price: parseFloat(item.price.price) * Math.pow(10, item.price.expo), // Adjust for exponent
        confidence: parseFloat(item.price.conf),
        publish_time: item.price.publish_time,
      }));
    }
  } catch (error) {
    console.error(
      `Error fetching data for timestamp ${timestamp}:`,
      error.message
    );
  }
  return [];
};

// Store data in MongoDB with proper validation
const storeDataInDB = async (data) => {
  for (const item of data) {
    try {
      const normalizedItemId = normalizeId(item.id);
      const normalizedBtcId = normalizeId(BTC_ID);
      const normalizedEthId = normalizeId(ETH_ID);

      console.log(`Received ID: ${normalizedItemId}`);
      console.log(`BTC ID to match: ${normalizedBtcId}`);
      console.log(`ETH ID to match: ${normalizedEthId}`);

      if (normalizedItemId === normalizedBtcId) {
        await BTCPrice.findOneAndUpdate(
          { publish_time: item.publish_time },
          item,
          { upsert: true }
        );
        console.log(
          `Stored BTC data for time ${new Date(
            item.publish_time * 1000
          ).toISOString()}`
        );
      } else if (normalizedItemId === normalizedEthId) {
        await ETHPrice.findOneAndUpdate(
          { publish_time: item.publish_time },
          item,
          { upsert: true }
        );
        console.log(
          `Stored ETH data for time ${new Date(
            item.publish_time * 1000
          ).toISOString()}`
        );
      } else {
        console.log(`Unknown coin ID: ${item.id}`);
      }
    } catch (error) {
      console.error(`Error storing data for ID ${item.id}:`, error.message);
    }
  }
};

// Main Function
const main = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://madhuvarsha:madhu1234@cluster0.jqjbs.mongodb.net/"
    );
    console.log("Connected to MongoDB");

    const timestamps = generateTimestamps();
    console.log(`Generated ${timestamps.length} timestamps for fetching data`);

    for (const timestamp of timestamps) {
      const date = new Date(timestamp * 1000).toISOString();
      console.log(`Fetching data for ${date}...`);

      const data = await fetchPriceData(timestamp);
      if (data.length > 0) {
        console.log(`Retrieved ${data.length} price points`);
        await storeDataInDB(data);
      } else {
        console.log(`No data available for ${date}`);
      }

      // Add a small delay to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log("Historical data fetching complete.");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

main();

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

// Generate timestamps for the past 2 years (1 per month)
const generateTimestamps = () => {
  const timestamps = [];
  const now = Math.floor(Date.now() / 1000);
  for (let i = 0; i < 24; i++) {
    const timestamp = now - i * 30 * 24 * 60 * 60; // Approximate monthly interval
    timestamps.push(timestamp);
  }
  return timestamps.reverse();
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

// Store data in MongoDB
const storeDataInDB = async (data) => {
  for (const item of data) {
    const Model = item.id === BTC_ID ? BTCPrice : ETHPrice;
    await Model.findOneAndUpdate({ publish_time: item.publish_time }, item, {
      upsert: true,
    });
  }
};

// Main Function
const main = async () => {
  await mongoose.connect(
    "mongodb+srv://madhuvarsha:madhu1234@cluster0.jqjbs.mongodb.net/"
  );
  console.log("Connected to MongoDB");

  const timestamps = generateTimestamps();

  for (const timestamp of timestamps) {
    console.log(`Fetching data for ${timestamp}...`);
    const data = await fetchPriceData(timestamp);
    if (data.length > 0) {
      await storeDataInDB(data);
      console.log(`Stored data for ${timestamp}`);
    }
  }

  console.log("Historical data fetching complete.");
  mongoose.disconnect();
};

main();

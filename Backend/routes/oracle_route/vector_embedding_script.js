require("dotenv").config();
const mongoose = require("mongoose");
const axios = require("axios");

// MongoDB Models
const PriceSchema = new mongoose.Schema({
  id: String,
  price: Number,
  confidence: Number,
  publish_time: Number,
  vectorEmbedding: [Number], // Array to store vector embeddings
});

const BTCPrice = mongoose.model("BTCPrice", PriceSchema, "btc_prices");
const ETHPrice = mongoose.model("ETHPrice", PriceSchema, "eth_prices");

// Function to get embeddings directly from OpenAI API
async function getEmbeddings(text) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/embeddings",
      {
        model: "text-embedding-ada-002",
        input: text,
      },
      {
        headers: {
          Authorization: `Bearer ${""}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (error) {
    console.error(
      "Error getting embeddings:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

// Format price data for embedding
const formatPriceDataForEmbedding = (priceData, cryptoType) => {
  // Create timestamp in human-readable format
  const date = new Date(priceData.publish_time * 1000);
  const formattedDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format

  // Format the text that will be converted to embedding
  // Including both price and date information
  return `${cryptoType} price on ${formattedDate} was ${priceData.price.toFixed(
    2
  )} USD with a confidence of ${priceData.confidence}`;
};

// Generate and store embeddings for a collection
const generateEmbeddings = async (Model, cryptoType) => {
  console.log(`Starting to generate embeddings for ${cryptoType}...`);

  // Get all records without embeddings
  const records = await Model.find({ vectorEmbedding: { $exists: false } });
  console.log(
    `Found ${records.length} ${cryptoType} records that need embeddings`
  );

  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        records.length / batchSize
      )} for ${cryptoType}`
    );

    // Process each record in the batch sequentially to avoid parallel API calls
    for (const record of batch) {
      try {
        // Format data for embedding
        const textToEmbed = formatPriceDataForEmbedding(record, cryptoType);
        console.log(`Getting embedding for: ${textToEmbed}`);

        // Generate embedding
        const embeddingVector = await getEmbeddings(textToEmbed);

        // Update record with embedding
        await Model.findByIdAndUpdate(
          record._id,
          { $set: { vectorEmbedding: embeddingVector } },
          { new: true }
        );

        console.log(
          `Successfully updated ${cryptoType} record ${record._id} with embedding`
        );

        // Add a small delay between individual API calls
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(
          `Error processing ${cryptoType} record ${record._id}:`,
          error.message
        );
      }
    }

    // Add a larger delay between batches
    if (i + batchSize < records.length) {
      console.log("Pausing for rate limiting...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.log(`Finished generating embeddings for ${cryptoType}`);
};

// Main function
const main = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(
      "mongodb+srv://madhuvarsha:madhu1234@cluster0.jqjbs.mongodb.net/"
    );
    console.log("Connected to MongoDB");

    // Generate embeddings for BTC records
    await generateEmbeddings(BTCPrice, "BTC");

    // Generate embeddings for ETH records
    await generateEmbeddings(ETHPrice, "ETH");

    console.log("All embeddings generated successfully");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
main();

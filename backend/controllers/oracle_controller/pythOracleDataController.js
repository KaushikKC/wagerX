async function getLatestPriceUpdates(priceIds) {
  const baseUrl = "https://hermes.pyth.network/v2/updates/price/latest";
  const queryParams = priceIds
    .map((id) => `ids[]=${encodeURIComponent(id)}`)
    .join("&");
  const url = `${baseUrl}?${queryParams}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API Response:", JSON.stringify(data, null, 2)); // Debugging log

    return data.parsed; // Return only parsed object
  } catch (error) {
    console.error("Error fetching price updates:", error.message);
    throw error;
  }
}

// Express route handler
async function getPythOracleData(req, res) {
  const priceIds = [
    "0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43", // BTC/USD
    "0xff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace", // ETH/USD
  ];

  try {
    const priceUpdates = await getLatestPriceUpdates(priceIds);
    res.json({ success: true, data: priceUpdates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { getPythOracleData, getLatestPriceUpdates };

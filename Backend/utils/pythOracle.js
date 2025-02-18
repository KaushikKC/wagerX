const axios = require("axios");

const getPythData = async () => {
  try {
    const response = await axios.get("https://pyth.network/api/latest");
    return response.data;
  } catch (error) {
    console.error("Error fetching Pyth data", error);
    return null;
  }
};

module.exports = getPythData;

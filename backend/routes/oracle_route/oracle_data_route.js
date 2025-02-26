const express = require("express");
const router = express.Router();
const {
  getPythOracleData,
} = require("../../controllers/oracle_controller/pythOracleDataController");

router.get("/get-oracle-data", getPythOracleData);

module.exports = router;

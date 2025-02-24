const express = require("express");
const {
  createAIAgent,
  updateAIStrategy,
  deleteAIAgent
} = require("../controllers/aiAgentController");

const router = express.Router();

router.post("/create", createAIAgent);
router.put("/updateAI", updateAIStrategy);
router.delete("/:agentId", deleteAIAgent);
module.exports = router;

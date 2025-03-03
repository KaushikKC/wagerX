const express = require("express");
const {
  createAIAgent,
  updateAIStrategy,
  deleteAIAgent,
  agentMutlisigExecution,
} = require("../controllers/aiAgentController");

const router = express.Router();

router.post("/create", createAIAgent);
router.put("/updateAI", updateAIStrategy);
router.delete("/:agentId", deleteAIAgent);
router.post("/agent-multisig-execution", agentMutlisigExecution);

module.exports = router;

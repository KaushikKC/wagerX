const express = require("express");
const {
  createAIAgent,
  updateAIStrategy,
  deleteAIAgent,
  agentMutlisigExecution,
  authorizeAgent,
} = require("../controllers/aiAgentController");

const router = express.Router();

router.post("/create", createAIAgent);
router.put("/updateAI", updateAIStrategy);
router.delete("/:agentId", deleteAIAgent);
router.post("/agent-multisig-execution", agentMutlisigExecution);
router.post("/agent-authorize", authorizeAgent);

module.exports = router;

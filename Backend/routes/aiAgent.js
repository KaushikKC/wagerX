const express = require("express");
const {
  createAIAgent,
  updateAIStrategy,
  deleteAIAgent,
  agentMutlisigExecution,
  authorizeAgent,
  monitorAgents,
  triggerMonitoring,
  startCronJob,
  stopCronJob,
} = require("../controllers/aiAgentController");

const router = express.Router();

router.post("/create", createAIAgent);
router.put("/updateAI", updateAIStrategy);
router.delete("/:agentId", deleteAIAgent);
router.post("/agent-multisig-execution", agentMutlisigExecution);
router.post("/agent-authorize", authorizeAgent);

router.post("/monitor", monitorAgents);
// Manually trigger monitoring
router.post("/trigger-monitoring", triggerMonitoring);

router.post("/start-cron", startCronJob);
router.post("/stop-cron", stopCronJob);

module.exports = router;

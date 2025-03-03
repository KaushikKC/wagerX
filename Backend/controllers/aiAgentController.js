const AIAgent = require("../models/AIAgent");
const { Account, Aptos, AptosConfig, Network } = require("@aptos-labs/ts-sdk");

exports.createAIAgent = async (req, res) => {
  const { userId, strategy } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const validStrategies = ["low risk", "moderate risk", "high risk"];
    if (strategy && !validStrategies.includes(strategy)) {
      return res.status(400).json({
        error:
          "Invalid strategy. Must be one of: conservative, balanced, aggressive",
      });
    }

    const existingAgent = await AIAgent.findOne({ user: userId, active: true });
    if (existingAgent) {
      return res.status(400).json({
        error: "User already has an active AI agent",
      });
    }

    const aiAgent = new AIAgent({ user: userId, strategy });
    await aiAgent.save();

    res.status(201).json({
      success: true,
      aiAgent,
      message: "AI Agent created successfully",
    });
  } catch (error) {
    console.error("AI Agent creation error:", error);
    res.status(500).json({
      error: "Failed to create AI Agent",
      details: error.message,
    });
  }
};

exports.updateAIStrategy = async (req, res) => {
  const { agentId, strategy } = req.body;

  try {
    const validStrategies = ["low risk", "moderate risk", "high risk"];
    if (strategy && !validStrategies.includes(strategy)) {
      return res.status(400).json({
        error:
          "Invalid strategy. Must be one of: low risk, moderate risk, high risk",
      });
    }

    const aiAgent = await AIAgent.findById(agentId);
    if (!aiAgent) {
      return res.status(404).json({ error: "AI Agent not found" });
    }

    aiAgent.strategy = strategy || aiAgent.strategy;

    // Save updated agent
    await aiAgent.save();

    res.status(200).json({
      success: true,
      aiAgent,
      message: "AI Agent strategy updated successfully",
    });
  } catch (error) {
    console.error("Update AI Agent strategy error:", error);
    res.status(500).json({
      error: "Failed to update AI Agent strategy",
      details: error.message,
    });
  }
};

exports.deleteAIAgent = async (req, res) => {
  const { agentId } = req.params;

  try {
    const aiAgent = await AIAgent.findById(agentId);
    if (!aiAgent) {
      return res.status(404).json({ error: "AI Agent not found" });
    }

    await aiAgent.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "AI Agent deleted successfully" });
  } catch (error) {
    console.error("Delete AI Agent error:", error);
    res
      .status(500)
      .json({ error: "Failed to delete AI Agent", details: error.message });
  }
};

// Add this function to the existing aiAgentController.js file

exports.agentMutlisigExecution = async (req, res) => {
  const { privateKey } = req.body;

  try {
    if (!privateKey) {
      return res.status(400).json({ error: "Private key is required" });
    }
    // Find the user's AI agent from the private_key given by the user which we store in db and fetch here to get the address
    const agent_account = Account.fromPrivateKey({ privateKey });
    console.log("Account from private-key:", account);

    // Store the private key securely
    // Note: In a production environment, you should encrypt this key before storing
    // You might want to set a flag indicating the private key has been provided
    // Save the updated agent

    //Owner address from DB only to the respective AGENT address from the private-key
    const ownerAddress =
      "e8570053e69a5fc0ee9d22e42160e072e7ce324c03f2f07c1b10e23eeb4c4905";
    console.log(ownerAddress, "OwnerAddress");

    const config = new AptosConfig({ network: Network.DEVNET });
    const aptos = new Aptos(config);

    // Build the transaction
    const transaction = await aptos.transaction.build.multiAgent({
      sender: agent_account,
      secondarySignerAddresses: [ownerAddress],
      data: {
        // REPLACE WITH YOUR MULTI-AGENT FUNCTION HERE
        function:
          "<REPLACE WITH YOUR MULTI AGENT MOVE ENTRY FUNCTION> (Syntax {address}::{module}::{function})",
        functionArguments: [],
      },
    });
    console.log("Transaction:", transaction);

    res.status(200).json({
      success: true,
      message: "Transaction executed successfully",
    });
  } catch (error) {
    console.error("Private key submission error:", error);
    res.status(500).json({
      error: "Failed to process private key",
      details: error.message,
    });
  }
};

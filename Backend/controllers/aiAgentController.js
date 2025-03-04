const AIAgent = require("../models/AIAgent");
const {
  Account,
  Aptos,
  AptosConfig,
  AptosAccount,
  Network,
  Ed25519PrivateKey,
} = require("@aptos-labs/ts-sdk");

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
  const {
    agentPrivateKey,
    ownerPrivateKey, // For now, we'll get this directly
    marketId,
    amount,
    predictedOutcome,
    odds,
    expiryTimestamp,
  } = req.body;

  try {
    if (
      !marketId ||
      !amount ||
      predictedOutcome === undefined ||
      !odds ||
      !expiryTimestamp
    ) {
      return res.status(400).json({
        error: "Missing required parameters",
        required: "marketId, amount, predictedOutcome, odds, expiryTimestamp",
      });
    }

    console.log("Agent private key:", agentPrivateKey);

    // Create proper Ed25519PrivateKey objects from the hex strings
    const agentPrivateKeyObj = new Ed25519PrivateKey(
      Buffer.from(agentPrivateKey, "hex")
    );

    const ownerPrivateKeyObj = new Ed25519PrivateKey(
      Buffer.from(ownerPrivateKey, "hex")
    );

    // Create account objects from private keys
    const agent_account = Account.fromPrivateKey({
      privateKey: agentPrivateKeyObj,
    });

    const owner_account = Account.fromPrivateKey({
      privateKey: ownerPrivateKeyObj,
    });

    console.log(
      "Agent account address:",
      agent_account.accountAddress.toString()
    );
    console.log(
      "Owner account address:",
      owner_account.accountAddress.toString()
    );
    // const agent_account =
    //   "913c78f117f734c9e38fd9804720d5219e2c26996eed3bfde387db46d64efd8d";
    // const owner_account =
    //   "e8570053e69a5fc0ee9d22e42160e072e7ce324c03f2f07c1b10e23eeb4c4905";

    // console.log("Agent account address:", agent_account.accountAddress);
    // console.log("Owner account address:", owner_account.accountAddress);

    const config = new AptosConfig({ network: Network.DEVNET });
    const aptos = new Aptos(config);

    // The address where the betting_contract module is deployed
    const contractAddress =
      "e8570053e69a5fc0ee9d22e42160e072e7ce324c03f2f07c1b10e23eeb4c4905";

    console.log(contractAddress, "contractAddress");

    // Build the transaction
    const transaction = await aptos.transaction.build.multiAgent({
      // sender: agent_account.accountAddress,
      sender: agent_account.accountAddress,

      secondarySignerAddresses: [owner_account.accountAddress],
      data: {
        function: `${contractAddress}::bet_nft::place_bet`,
        functionArguments: [
          marketId, // market_id: u64
          amount, // amount: u64
          predictedOutcome, // predicted_outcome: u8
          odds, // odds: u64
          expiryTimestamp, // expiry_timestamp: u64
        ],
      },
    });

    console.log("Transaction built successfully");

    // Sign the transaction with both accounts

    const agentAuthenticator = aptos.transaction.sign({
      signer: agent_account,
      transaction,
    });

    console.log(agentAuthenticator, "agentAuth success after build");

    const ownerAuthenticator = aptos.transaction.sign({
      signer: owner_account,
      transaction,
    });

    console.log("Transaction signed by both parties");

    // Submit the transaction with both signatures
    const committedTransaction = await aptos.transaction.submit.multiAgent({
      transaction,
      senderAuthenticator: agentAuthenticator,
      additionalSignersAuthenticators: [ownerAuthenticator],
    });

    console.log("Transaction submitted:", committedTransaction.hash);

    // Wait for the transaction to be confirmed
    const executedTransaction = await aptos.waitForTransaction({
      transactionHash: committedTransaction.hash,
    });

    console.log("Transaction executed:", executedTransaction);

    res.status(200).json({
      success: true,
      message: "Bet placed successfully",
      transactionHash: committedTransaction.hash,
      transactionDetails: executedTransaction,
    });
  } catch (error) {
    console.error("Transaction execution error:", error);
    res.status(500).json({
      error: "Failed to execute transaction",
      details: error.message,
    });
  }
};

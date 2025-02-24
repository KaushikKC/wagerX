const mongoose = require("mongoose");

const AIAgentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  strategy: {
    type: String,
    enum: ["low risk", "moderate risk", "high risk"],
    default: "low risk"
  },
  active: { type: Boolean, default: true }
});

module.exports = mongoose.model("AIAgent", AIAgentSchema);

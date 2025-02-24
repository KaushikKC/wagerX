const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      default: "Anon"
    },
    totalBets: {
      type: Number,
      default: 0
    },
    winningBets: {
      type: Number,
      default: 0
    },
    totalWinnings: {
      type: Number,
      default: 0
    },
    riskTolerance: {
      type: Number,
      default: 5
    },
    leverage: {
      type: Number,
      default: 1
    },
    aiAutomation: {
      type: Boolean,
      default: false
    },

    bettingHistory: [
      {
        market: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Market"
        },
        amount: Number,
        outcome: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

userSchema.methods.updateStats = async function (betResult) {
  this.totalBets += 1;
  if (betResult.won) {
    this.winningBets += 1;
    this.totalWinnings += betResult.amount;
  }
  await this.save();
};

module.exports = mongoose.model("User", userSchema);

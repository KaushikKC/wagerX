const WebSocket = require("ws");
const User = require("../models/User");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Maps walletAddress to WebSocket connection

    this.wss.on("connection", (ws) => {
      ws.on("message", async (message) => {
        const data = JSON.parse(message);

        if (data.type === "AUTH") {
          const user = await User.findOne({
            walletAddress: data.walletAddress,
          });
          if (user) {
            this.clients.set(data.walletAddress, ws);
            ws.walletAddress = data.walletAddress;

            // Send initial data
            this.sendUserUpdate(data.walletAddress);
            this.sendLeaderboardUpdate(user.groups);
          }
        }
      });

      ws.on("close", () => {
        if (ws.walletAddress) {
          this.clients.delete(ws.walletAddress);
        }
      });
    });
  }

  broadcast(type, data) {
    const message = JSON.stringify({ type, data });
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  async sendUserUpdate(walletAddress) {
    const ws = this.clients.get(walletAddress);
    if (!ws) return;

    const user = await User.findOne({ walletAddress }).populate(
      "bettingHistory.market"
    );

    ws.send(
      JSON.stringify({
        type: "USER_UPDATE",
        data: {
          bettingHistory: user.bettingHistory,
          stats: {
            totalBets: user.totalBets,
            winningBets: user.winningBets,
            totalWinnings: user.totalWinnings,
          },
        },
      })
    );
  }

  async sendLeaderboardUpdate(groupIds) {
    const leaderboardData = await Promise.all(
      groupIds.map(async (groupId) => {
        const users = await User.find({ groups: groupId })
          .sort({ totalWinnings: -1 })
          .limit(10)
          .select("username totalWinnings");

        return {
          groupId,
          rankings: users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            totalWinnings: user.totalWinnings,
          })),
        };
      })
    );

    this.broadcast("LEADERBOARD_UPDATE", { leaderboards: leaderboardData });
  }
}

let instance = null;

module.exports = {
  initialize: (server) => {
    instance = new WebSocketServer(server);
    return instance;
  },
  getInstance: () => instance,
};

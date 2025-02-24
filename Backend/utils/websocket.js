const WebSocket = require("ws");
const User = require("../models/User");

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map(); // Maps walletAddress to WebSocket connection

    this.wss.on("connection", (ws) => {
      console.log("New WebSocket connection established");

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message);

          if (data.type === "AUTH") {
            const user = await User.findOne({
              walletAddress: data.walletAddress
            });

            if (user) {
              this.clients.set(data.walletAddress, ws);
              ws.walletAddress = data.walletAddress;
              console.log(`User authenticated: ${data.walletAddress}`);

              // Send initial data
              await this.sendUserUpdate(data.walletAddress);
              await this.sendLeaderboardUpdate(user.groups);

              // Send confirmation back to client
              ws.send(
                JSON.stringify({
                  type: "AUTH_SUCCESS",
                  data: { walletAddress: data.walletAddress }
                })
              );
            } else {
              ws.send(
                JSON.stringify({
                  type: "AUTH_ERROR",
                  data: { message: "User not found" }
                })
              );
            }
          }
        } catch (error) {
          console.error("WebSocket message handling error:", error);
          ws.send(
            JSON.stringify({
              type: "ERROR",
              data: { message: "Failed to process message" }
            })
          );
        }
      });

      ws.on("close", () => {
        if (ws.walletAddress) {
          this.clients.delete(ws.walletAddress);
          console.log(`Connection closed for: ${ws.walletAddress}`);
        }
      });

      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        if (ws.walletAddress) {
          this.clients.delete(ws.walletAddress);
        }
      });
    });
  }

  broadcast(type, data) {
    try {
      if (!this.wss) {
        console.warn("WebSocket server not initialized");
        return;
      }

      const message = JSON.stringify({ type, data });
      let sentCount = 0;

      this.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
          sentCount++;
        }
      });

      console.log(`Broadcast ${type} sent to ${sentCount} clients`);
    } catch (error) {
      console.error("Broadcast error:", error);
    }
  }

  async sendUserUpdate(walletAddress) {
    try {
      const ws = this.clients.get(walletAddress);
      if (!ws) {
        console.log(`No active connection for wallet: ${walletAddress}`);
        return;
      }

      const user = await User.findOne({ walletAddress }).populate(
        "bettingHistory.market"
      );

      if (!user) {
        console.log(`User not found for wallet: ${walletAddress}`);
        return;
      }

      ws.send(
        JSON.stringify({
          type: "USER_UPDATE",
          data: {
            bettingHistory: user.bettingHistory,
            stats: {
              totalBets: user.totalBets,
              winningBets: user.winningBets,
              totalWinnings: user.totalWinnings
            }
          }
        })
      );

      console.log(`User update sent to ${walletAddress}`);
    } catch (error) {
      console.error("Send user update error:", error);
    }
  }

  async sendLeaderboardUpdate(groupIds) {
    try {
      if (!Array.isArray(groupIds)) {
        console.warn("Invalid groupIds provided for leaderboard update");
        return;
      }

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
              totalWinnings: user.totalWinnings
            }))
          };
        })
      );

      this.broadcast("LEADERBOARD_UPDATE", { leaderboards: leaderboardData });
      console.log(`Leaderboard update sent for ${groupIds.length} groups`);
    } catch (error) {
      console.error("Send leaderboard update error:", error);
    }
  }

  // Helper method to get connected clients count
  getConnectedClientsCount() {
    return this.clients.size;
  }
}

// Singleton instance
let instance = null;

module.exports = {
  initialize: (server) => {
    if (!instance) {
      instance = new WebSocketServer(server);
      console.log("WebSocket server initialized");
    }
    return instance;
  },
  getInstance: () => {
    if (!instance) {
      console.warn(
        "WebSocket server not initialized. Call initialize() first."
      );
    }
    return instance;
  }
};

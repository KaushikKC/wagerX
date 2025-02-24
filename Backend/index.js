const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const { initialize: initializeWebSocket } = require("./utils/websocket");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/ai", require("./routes/aiAgent"));
app.use("/api/market", require("./routes/market"));
app.use("/api/prediction", require("./routes/prediction"));
app.use("/api/bet", require("./routes/bet"));

// Socket.IO events (if needed)
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("placeBet", (bet) => {
    io.emit("updateBets", bet);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// Initialize your custom WebSocket server right after the HTTP server is created
initializeWebSocket(server);

const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();

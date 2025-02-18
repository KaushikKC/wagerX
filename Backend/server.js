const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("./config/db");
const { initialize: initializeWebSocket } = require("./utils/websocket");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/market", require("./routes/market"));
app.use("/api/bet", require("./routes/bet"));

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("placeBet", (bet) => {
    io.emit("updateBets", bet);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
initializeWebSocket(server);

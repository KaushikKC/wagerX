const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const cors = require("cors");
const { initialize: initializeWebSocket } = require("./utils/websocket");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// CORS Configuration
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3002"], // Add your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable credentials (cookies, authorization headers, etc)
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Pre-flight requests
app.options("*", cors(corsOptions));

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

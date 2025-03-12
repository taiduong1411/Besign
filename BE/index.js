const express = require("express");
const app = express();
// const http = require('http');
const { createServer } = require("http");
const httpServer = createServer(app);
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const database = require("./src/database/config");
database.connect();
require("dotenv").config();

const port = process.env.PORT || 3000;

// Express Config
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
  })
);
// CORS config
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// socket config
const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  path: "/socket",
  wssEngine: ["ws", "wss"],
  transports: ["websocket", "polling"],
  allowEIO3: true,
});
io.on("connection", (socket) => {
  socket.on("newMessage", (message) => {
    // handle when connected
    socket.broadcast.emit("messageReceived", 1);
  });

  socket.on("disconnect", () => {
    // handle when disconnect
  });
});

// Router
const adminRoute = require("./src/router/AdminRoute");
const accountRoute = require("./src/router/AccountRoute");
const newsRoute = require("./src/router/NewsRoute");
const userRoute = require("./src/router/UserRoute");
const contactRoute = require("./src/router/ContactRoute");
// API
app.use("/api/admin", adminRoute);
app.use("/api/account", accountRoute);
app.use("/api/news", newsRoute);
app.use("/api/user", userRoute);
app.use("/api/contact", contactRoute);

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 3001;

// In-memory users
let members = [];

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // USER JOIN
  socket.on("user:join", ({ name }) => {
    const user = {
      id: socket.id,
      name,
      status: "En ligne",
    };

    members.push(user);

    console.log(name, "joined");

    io.emit("members:update", members);
  });

  // STATUS CHANGE
  socket.on("status:change", ({ status }) => {
    members = members.map((m) =>
      m.id === socket.id ? { ...m, status } : m
    );

    console.log("Status updated:", status);

    io.emit("members:update", members);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    members = members.filter((m) => m.id !== socket.id);

    console.log("User disconnected:", socket.id);

    io.emit("members:update", members);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
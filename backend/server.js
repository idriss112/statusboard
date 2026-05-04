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
let history = [];

const allowedStatuses = ["En ligne", "Absent", "Occupé"];

function getTime() {
  return new Date().toLocaleTimeString("fr-CA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addHistory(message, tone) {
  history.unshift({
    id: `${Date.now()}-${Math.random()}`,
    message,
    time: getTime(),
    tone,
  });

  history = history.slice(0, 8);
}

function emitState() {
  io.emit("members:update", members);
  io.emit("history:update", history);
}

function getToneFromStatus(status) {
  if (status === "En ligne") return "online";
  if (status === "Absent") return "away";
  return "busy";
}

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.emit("members:update", members);
  socket.emit("history:update", history);

  // USER JOIN
  socket.on("user:join", ({ name }) => {
    const cleanName = name && name.trim();

    if (!cleanName) {
      return;
    }

    const alreadyJoined = members.find((member) => member.id === socket.id);

    if (alreadyJoined) {
      return;
    }

    const normalizedName = cleanName.toLowerCase();

    members = members.filter(
      (member) => member.name.trim().toLowerCase() !== normalizedName
    );

    const user = {
      id: socket.id,
      name: cleanName,
      status: "En ligne",
    };

    members.push(user);

    console.log(cleanName, "joined");

    addHistory(`${cleanName} a rejoint le board`, "online");
    emitState();
  });

  // STATUS CHANGE
  socket.on("status:change", ({ status }) => {
    if (!allowedStatuses.includes(status)) {
      return;
    }

    const member = members.find((item) => item.id === socket.id);

    if (!member) {
      return;
    }

    if (member.status === status) {
      return;
    }

    member.status = status;

    console.log("Status updated:", status);

    addHistory(`${member.name} → ${status}`, getToneFromStatus(status));
    emitState();
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    const leavingMember = members.find((member) => member.id === socket.id);

    members = members.filter((m) => m.id !== socket.id);

    console.log("User disconnected:", socket.id);

    if (leavingMember) {
      addHistory(`${leavingMember.name} a quitté le board`, "busy");
    }

    emitState();
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

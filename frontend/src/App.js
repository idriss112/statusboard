import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import LoginForm from "./components/LoginForm";
import StatusBoard from "./components/StatusBoard";
import "./App.css";

const socket = io("https://statusboard-0uns.onrender.com", {
  transports: ["websocket"],
});

function App() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    socket.on("members:update", (data) => {
      setMembers(data);
    });

    socket.on("history:update", (data) => {
      setEvents(data);
    });

    return () => {
      socket.off("members:update");
      socket.off("history:update");
    };
  }, []);

  const handleJoin = (name) => {
    const cleanName = name.trim();

    if (!cleanName) {
      return;
    }

    setUser(cleanName);
    socket.emit("user:join", { name: cleanName });
  };

  const changeStatus = (status) => {
    socket.emit("status:change", { status });
  };

  return (
    <div>
      <StatusBoard
        members={members}
        currentUser={user}
        onStatusChange={changeStatus}
        events={events}
      />

      {!user && <LoginForm onJoin={handleJoin} />}
    </div>
  );
}

export default App;

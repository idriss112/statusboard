import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import LoginForm from "./components/LoginForm";
import StatusBoard from "./components/StatusBoard";
import "./App.css";

const socket = io("http://localhost:3001");

function App() {
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket.on("members:update", (data) => {
      setMembers(data);
    });

    return () => socket.off("members:update");
  }, []);

  const handleJoin = (name) => {
    setUser(name);
    socket.emit("user:join", { name });
  };

  const changeStatus = (status) => {
    socket.emit("status:change", { status });
  };

  return (
    <div>
      {!user ? (
        <LoginForm onJoin={handleJoin} />
      ) : (
        <StatusBoard
          members={members}
          currentUser={user}
          onStatusChange={changeStatus}
        />
      )}
    </div>
  );
}

export default App;
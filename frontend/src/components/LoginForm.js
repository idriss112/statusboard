import React, { useState } from "react";

export default function LoginForm({ onJoin }) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onJoin(name);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.box}>
        <h2>StatusBoard</h2>
        <p>Entrez votre nom pour rejoindre</p>

        <input
          placeholder="Votre nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSubmit} style={styles.button}>
          Rejoindre →
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f6fa",
  },
  box: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    marginTop: "15px",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#6c5ce7",
    color: "white",
    cursor: "pointer",
  },
};
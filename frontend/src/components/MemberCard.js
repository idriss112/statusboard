import React from "react";

const getClass = (status) => {
  if (status === "En ligne") return "badge green";
  if (status === "Absent") return "badge orange";
  return "badge red";
};

export default function MemberCard({ member, isMe, onStatusChange }) {
  const initials = member.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="card">
      
      <div style={{ fontWeight: "bold" }}>
        {initials} - {member.name} {isMe && "(vous)"}
      </div>

      <div className={getClass(member.status)}>
        {member.status}
      </div>

      {isMe && (
        <div className="btn-group" style={{ marginTop: "10px" }}>
          <button className="btn-green" onClick={() => onStatusChange("En ligne")}>
            En ligne
          </button>
          <button className="btn-orange" onClick={() => onStatusChange("Absent")}>
            Absent
          </button>
          <button className="btn-red" onClick={() => onStatusChange("Occupé")}>
            Occupé
          </button>
        </div>
      )}
    </div>
  );
}
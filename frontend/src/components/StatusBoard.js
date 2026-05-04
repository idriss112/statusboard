import React from "react";
import MemberCard from "./MemberCard";

export default function StatusBoard({
  members,
  currentUser,
  onStatusChange,
  events,
}) {
  const online = members.filter((m) => m.status === "En ligne").length;
  const absent = members.filter((m) => m.status === "Absent").length;
  const busy = members.filter((m) => m.status === "Occupé").length;

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <div>
          <span className="logo">StatusBoard</span>
          <span className="online-count"> {online} en ligne</span>
        </div>

        <div>Connecté : {currentUser || "—"}</div>
      </div>

      {/* BODY */}
      <div className="container">
        {/* SIDEBAR */}
        <div className="sidebar">
          <h4>STATUTS</h4>

          <div className="status-item">
            <span>🟢 En ligne</span>
            <span>{online}</span>
          </div>

          <div className="status-item">
            <span>🟡 Absent</span>
            <span>{absent}</span>
          </div>

          <div className="status-item">
            <span>🔴 Occupé</span>
            <span>{busy}</span>
          </div>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="members-section">
            <h3>Membres connectés</h3>

            {members.length === 0 ? (
              <div className="members-empty">
                Aucun membre connecté pour le moment.
              </div>
            ) : (
              <div className="grid">
                {members.map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    isMe={member.name === currentUser}
                    onStatusChange={onStatusChange}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="history-section">
            <h3>Historique des événements</h3>

            {events.length === 0 ? (
              <p className="history-empty">Aucune action pour le moment.</p>
            ) : (
              <div className="history-list">
                {events.map((event) => (
                  <div key={event.id} className="history-item">
                    <span className={`history-dot ${event.tone}`}></span>
                    <span className="history-text">{event.message}</span>
                    <span className="history-time">{event.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

import { useState } from "react";
import "./MissionStatus.css";

const STATUS_CONFIG = {
  "🟢 Online": { label: "Online", message: "All systems operational", color: "#4ade80", icon: "✅" },
  "🔴 Offline": { label: "Offline", message: "Communication lost", color: "#f87171", icon: "❌" },
  "🟡 In Maintenance": { label: "In Maintenance", message: "Engineers are performing maintenance", color: "#facc15", icon: "🛠" }
};

function MissionStatus() {
  const [status, setStatus] = useState("🟢 Online");
  const current = STATUS_CONFIG[status];

  return (
    <div className="mission-status-card">
      <div className="mission-status-header">
        <h2>Mission Status</h2>
        <span className="status-badge" style={{ color: current.color, borderColor: current.color }}>
          <span className="status-dot" style={{ background: current.color }} />
          {current.label}
        </span>
      </div>

      <p className="mission-status-message">
        {current.icon} {current.message}
      </p>

      <div className="status-buttons">
        <button
          className={status === "🔴 Offline" ? "status-btn active offline" : "status-btn"}
          onClick={() => setStatus("🔴 Offline")}
        >
          🔴 Go Offline
        </button>
        <button
          className={status === "🟢 Online" ? "status-btn active online" : "status-btn"}
          onClick={() => setStatus("🟢 Online")}
        >
          🟢 Go Online
        </button>
        <button
          className={status === "🟡 In Maintenance" ? "status-btn active maintenance" : "status-btn"}
          onClick={() => setStatus("🟡 In Maintenance")}
        >
          🟡 Maintenance
        </button>
      </div>
    </div>
  );
}

export default MissionStatus;
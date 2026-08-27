import "./MissionStatus.css";

const STATUS_CONFIG = {
  active: { label: "Online", message: "All systems operational", color: "#4ade80", icon: "✅" },
  offline: { label: "Offline", message: "Communication lost", color: "#f87171", icon: "❌" },
  maintenance: { label: "In Maintenance", message: "Engineers are performing maintenance", color: "#facc15", icon: "🛠" },
  mixed: { label: "Mixed", message: "Satellites are reporting different statuses", color: "#94a3b8", icon: "🔀" },
  empty: { label: "No Data", message: "Add a satellite to see mission status", color: "#94a3b8", icon: "🛰" }
};

function getFleetStatus(satellites) {
  if (satellites.length === 0) return "empty";
  const statuses = new Set(satellites.map((s) => s.status));
  return statuses.size === 1 ? [...statuses][0] : "mixed";
}

function MissionStatus({ satellites, onBulkStatusChange }) {
  const fleetStatus = getFleetStatus(satellites);
  const current = STATUS_CONFIG[fleetStatus] || STATUS_CONFIG.mixed;

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
          className={fleetStatus === "offline" ? "status-btn active offline" : "status-btn"}
          onClick={() => onBulkStatusChange("offline")}
        >
          🔴 Go Offline
        </button>
        <button
          className={fleetStatus === "active" ? "status-btn active online" : "status-btn"}
          onClick={() => onBulkStatusChange("active")}
        >
          🟢 Go Online
        </button>
        <button
          className={fleetStatus === "maintenance" ? "status-btn active maintenance" : "status-btn"}
          onClick={() => onBulkStatusChange("maintenance")}
        >
          🟡 Maintenance
        </button>
      </div>

      <p className="mission-status-hint">
        Sets every satellite in your fleet to this status at once.
      </p>
    </div>
  );
}

export default MissionStatus;
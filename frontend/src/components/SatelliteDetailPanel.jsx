import "./SatelliteDetailPanel.css";
import { orbitalSpeed } from "../utils/orbital";

const statusStyles = {
  active: { label: "Active", color: "#4ade80" },
  offline: { label: "Offline", color: "#ff4d4d" },
  maintenance: { label: "Maintenance", color: "#facc15" }
};

function TelemetryBar({ icon, label, value, unit, color }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="telemetry-row">
      <span className="telemetry-icon">{icon}</span>
      <span className="telemetry-label">{label}</span>
      <div className="telemetry-track">
        <div
          className="telemetry-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="telemetry-value">
        {value.toFixed(1)}
        {unit}
      </span>
    </div>
  );
}

function SatelliteDetailPanel({ satellite }) {
  if (!satellite) {
    return (
      <div className="satellite-detail-panel empty">
        <p>Select a satellite to view its details.</p>
      </div>
    );
  }

  const status = statusStyles[satellite.status] || statusStyles.active;
  const speed = orbitalSpeed(satellite.altitude || 0);

  return (
    <div className="satellite-detail-panel">
      <div className="panel-header">
        <span>Selected Satellite</span>
        <span
          className="status-pill"
          style={{ color: status.color, borderColor: status.color }}
        >
          {status.label}
        </span>
      </div>

      <div className="satellite-name-row">
        <span className="dot" style={{ background: status.color }} />
        <h2>{satellite.name}</h2>
      </div>

      <div className="satellite-illustration">🛰️</div>

      <div className="info-list">
        <div className="info-row">
          <span>Country</span>
          <strong>{satellite.country || "—"}</strong>
        </div>
        <div className="info-row">
          <span>Launch Date</span>
          <strong>{satellite.launchDate || "Unknown"}</strong>
        </div>
        <div className="info-row">
          <span>Altitude</span>
          <strong>{satellite.altitude?.toFixed(1)} km</strong>
        </div>
        <div className="info-row">
          <span>Speed</span>
          <strong>{speed.toFixed(2)} km/s</strong>
        </div>
        <div className="info-row">
          <span>Status</span>
          <strong style={{ color: status.color }}>{status.label}</strong>
        </div>
      </div>

      <h3 className="telemetry-heading">Live Telemetry</h3>
      <TelemetryBar
        icon="🔋"
        label="Battery"
        value={satellite.battery || 0}
        unit="%"
        color="#4ade80"
      />
      <TelemetryBar
        icon="📶"
        label="Signal Strength"
        value={satellite.signal || 0}
        unit="%"
        color="#38bdf8"
      />
      <TelemetryBar
        icon="🌡"
        label="Temperature"
        value={satellite.temperature || 0}
        unit="°C"
        color="#ff4d4d"
      />
    </div>
  );
}

export default SatelliteDetailPanel;
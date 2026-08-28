import "./SatelliteDetailPanel.css";
import { orbitalSpeed, orbitalPeriodMinutes } from "../utils/orbital";
import { getOrbitalProfile } from "../utils/satelliteProfile";
import { getCommunicationStatus } from "../utils/alerts";

const statusStyles = {
  active: { label: "Active", color: "#4ade80" },
  offline: { label: "Offline", color: "#ff4d4d" },
  maintenance: { label: "Maintenance", color: "#facc15" }
};

const COMM_COLORS = {
  Connected: "#4ade80",
  Intermittent: "#facc15",
  Lost: "#f87171"
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
  const profile = getOrbitalProfile(satellite.name);
  const altitude = satellite.altitude ?? profile.altitudeKm;
  const speed = orbitalSpeed(altitude);
  const periodMinutes = orbitalPeriodMinutes(altitude);
  const commStatus = getCommunicationStatus(satellite.signal || 0);
  const commColor = COMM_COLORS[commStatus];
  const lastUpdated = satellite.lastUpdated ? new Date(satellite.lastUpdated) : new Date();

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

      {!profile.isReal && <div className="simulated-badge">Simulated Spacecraft</div>}

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
      </div>

      <h3 className="telemetry-heading">Orbit</h3>
      <div className="info-list">
        <div className="info-row">
          <span>Orbital Altitude</span>
          <strong>{altitude.toFixed(1)} km</strong>
        </div>
        <div className="info-row">
          <span>Orbital Speed</span>
          <strong>{speed.toFixed(2)} km/s</strong>
        </div>
        <div className="info-row">
          <span>Inclination</span>
          <strong>{profile.inclinationDeg.toFixed(1)}°</strong>
        </div>
        <div className="info-row">
          <span>Orbital Period</span>
          <strong>{periodMinutes.toFixed(1)} min</strong>
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
        icon="📡"
        label="Signal"
        value={satellite.signal || 0}
        unit="%"
        color="#38bdf8"
      />
      <TelemetryBar
        icon="🌡"
        label="Temperature"
        value={satellite.temperature || 0}
        unit="°C"
        color="#f87171"
      />

      <div className="comm-status-row">
        <span
          className="comm-dot"
          style={{ background: commColor, boxShadow: `0 0 8px ${commColor}` }}
        />
        <span>Communication</span>
        <strong style={{ color: commColor }}>{commStatus}</strong>
      </div>

      <div className="last-telemetry">
        <div className="last-telemetry-title">Last Telemetry</div>
        <div className="last-telemetry-time">{lastUpdated.toLocaleTimeString()}</div>
        <div className="last-telemetry-row">Signal: {satellite.signal?.toFixed(1)}%</div>
        <div className="last-telemetry-row">Battery: {satellite.battery?.toFixed(1)}%</div>
        <div className="last-telemetry-row">Temperature: {satellite.temperature?.toFixed(1)}°C</div>
      </div>
    </div>
  );
}

export default SatelliteDetailPanel;
import { useState } from "react";
import "./SatelliteDetailPanel.css";
import { orbitalSpeed, orbitalPeriodMinutes } from "../utils/orbital";
import { getOrbitalProfile } from "../utils/satelliteProfile";
import { formatMissionDuration } from "../utils/dateUtils";
import {
  getCommunicationStatus,
  getBatteryLevel,
  getSignalLevel,
  getTemperatureLevel
} from "../utils/alerts";

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

const LEVEL_NOTES = {
  signal: {
    normal: "Signal strong and stable.",
    warning: "Signal degrading.",
    critical: "Signal critically weak or lost."
  },
  power: {
    normal: "Battery nominal.",
    warning: "Battery low — consider prioritizing charge.",
    critical: "Battery critical — immediate action recommended."
  },
  environment: {
    normal: "Temperature within nominal range.",
    warning: "Temperature approaching operational limits.",
    critical: "Temperature outside safe operating range."
  }
};

const EXPLORE_TABS = [
  { id: "signal", label: "📡 Signal" },
  { id: "power", label: "🔋 Power" },
  { id: "environment", label: "🌡 Environment" },
  { id: "alerts", label: "🚨 Alerts" }
];

// Compares the most recent reading against one from a few ticks back, so a
// single noisy sample doesn't flip the arrow — needs a real, sustained move.
function getTrend(history) {
  if (!Array.isArray(history) || history.length < 4) return "flat";
  const recent = history[history.length - 1];
  const earlier = history[Math.max(0, history.length - 5)];
  const diff = recent - earlier;
  if (Math.abs(diff) < 0.3) return "flat";
  return diff > 0 ? "up" : "down";
}

const TREND_ICON = { up: "▲", down: "▼", flat: "–" };

function TelemetryBar({ icon, label, value, unit, color, trend }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="telemetry-row">
      <span className="telemetry-icon">{icon}</span>
      <span className="telemetry-label">{label}</span>
      <div className="telemetry-track">
        <div className="telemetry-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className={`telemetry-trend trend-${trend}`}>{TREND_ICON[trend]}</span>
      <span className="telemetry-value">
        {value.toFixed(1)}
        {unit}
      </span>
    </div>
  );
}

const STATUS_ACTIONS = [
  { value: "active", label: "🟢 Active" },
  { value: "offline", label: "🔴 Offline" },
  { value: "maintenance", label: "🟡 Maintenance" }
];

function SatelliteDetailPanel({ satellite, onChangeStatus }) {
  const [exploreTab, setExploreTab] = useState("signal");

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
  const missionDuration = formatMissionDuration(satellite.launchDate);

  const signalLevel = getSignalLevel(satellite.signal ?? 0);
  const batteryLevel = getBatteryLevel(satellite.battery ?? 0);
  const temperatureLevel = getTemperatureLevel(satellite.temperature ?? 0);

  const batteryTrend = getTrend(satellite.history?.battery);
  const signalTrend = getTrend(satellite.history?.signal);
  const temperatureTrend = getTrend(satellite.history?.temperature);

  const activeAlerts = satellite.alerts || [];

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
        {missionDuration && (
          <div className="info-row">
            <span>Mission Duration</span>
            <strong>{missionDuration}</strong>
          </div>
        )}
        {profile.noradId && (
          <div className="info-row">
            <span>NORAD ID</span>
            <strong>{profile.noradId}</strong>
          </div>
        )}
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
      <TelemetryBar icon="🔋" label="Battery" value={satellite.battery || 0} unit="%" color="#4ade80" trend={batteryTrend} />
      <TelemetryBar icon="📡" label="Signal" value={satellite.signal || 0} unit="%" color="#38bdf8" trend={signalTrend} />
      <TelemetryBar icon="🌡" label="Temperature" value={satellite.temperature || 0} unit="°C" color="#f87171" trend={temperatureTrend} />

      <h3 className="telemetry-heading">Explore</h3>
      <div className="detail-tabs">
        {EXPLORE_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`detail-tab-btn ${exploreTab === tab.id ? "active" : ""}`}
            onClick={() => setExploreTab(tab.id)}
          >
            {tab.label}
            {tab.id === "alerts" && activeAlerts.length > 0 && (
              <span className="tab-badge">{activeAlerts.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="detail-tab-content">
        {exploreTab === "signal" && (
          <>
            <div className="comm-status-row">
              <span
                className="comm-dot"
                style={{ background: commColor, boxShadow: `0 0 8px ${commColor}` }}
              />
              <span>Communication</span>
              <strong style={{ color: commColor }}>{commStatus}</strong>
            </div>
            <p className="tab-note">{LEVEL_NOTES.signal[signalLevel]}</p>
          </>
        )}
        {exploreTab === "power" && (
          <p className="tab-note">{LEVEL_NOTES.power[batteryLevel]}</p>
        )}
        {exploreTab === "environment" && (
          <p className="tab-note">{LEVEL_NOTES.environment[temperatureLevel]}</p>
        )}
        {exploreTab === "alerts" && (
          activeAlerts.length === 0 ? (
            <p className="tab-note">✅ No active alerts for {satellite.name}.</p>
          ) : (
            <div className="panel-alert-list">
              {activeAlerts.map((alert, i) => (
                <div key={i} className={`panel-alert-row ${alert.level}`}>
                  <span>⚠</span>
                  <span>{alert.message}</span>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {onChangeStatus && (
        <>
          <h3 className="telemetry-heading">Quick Actions</h3>
          <div className="quick-action-row">
            {STATUS_ACTIONS.map((action) => (
              <button
                key={action.value}
                className={`quick-action-btn ${satellite.status === action.value ? "active" : ""}`}
                onClick={() => onChangeStatus(satellite.name, action.value)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </>
      )}

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
import { useState } from "react";
import "./SatelliteCard.css";
import TelemetryChart from "./TelemetryChart";

const STATUS_META = {
  active: { label: "Active", color: "#4ade80" },
  offline: { label: "Offline", color: "#f87171" },
  maintenance: { label: "Maintenance", color: "#facc15" }
};

function SatelliteCard({ satellite, deleteSatellite, editSatellite, changeStatus }) {
  const [chartType, setChartType] = useState("battery");
  const meta = STATUS_META[satellite.status] || STATUS_META.active;

  return (
    <div className="satellite-card">
      <div className="satellite-card-header">
        <h3>{satellite.name}</h3>
        <span className="status-chip" style={{ color: meta.color, borderColor: meta.color }}>
          <span className="status-chip-dot" style={{ background: meta.color }} />
          {meta.label}
        </span>
      </div>

      <p className="satellite-country">🌍 {satellite.country}</p>

      <div className="telemetry-grid">
        <div className="telemetry-chip">
          <span>🔋</span>
          <div>
            <div className="chip-label">Battery</div>
            <div className="chip-value">{satellite.battery?.toFixed(1)}%</div>
          </div>
        </div>
        <div className="telemetry-chip">
          <span>🌡</span>
          <div>
            <div className="chip-label">Temp</div>
            <div className="chip-value">{satellite.temperature?.toFixed(1)}°C</div>
          </div>
        </div>
        <div className="telemetry-chip">
          <span>📶</span>
          <div>
            <div className="chip-label">Signal</div>
            <div className="chip-value">{satellite.signal?.toFixed(1)}%</div>
          </div>
        </div>
        <div className="telemetry-chip">
          <span>🛰</span>
          <div>
            <div className="chip-label">Altitude</div>
            <div className="chip-value">{satellite.altitude?.toFixed(1)} km</div>
          </div>
        </div>
      </div>

      <div className="chart-toggle">
        <button className={chartType === "battery" ? "active" : ""} onClick={() => setChartType("battery")}>
          Battery
        </button>
        <button className={chartType === "signal" ? "active" : ""} onClick={() => setChartType("signal")}>
          Signal
        </button>
      </div>

      {satellite.history?.battery?.length > 0 && satellite.history?.signal?.length > 0 && (
        <>
          {chartType === "battery" && <TelemetryChart data={satellite.history.battery} label="Battery" />}
          {chartType === "signal" && <TelemetryChart data={satellite.history.signal} label="Signal" />}
        </>
      )}

      {satellite.alerts && satellite.alerts.length > 0 && (
        <div className="alert-list">
          {satellite.alerts.map((alert, index) => (
            <div key={index} className={`alert-chip ${alert.level}`}>
              ⚠ {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="satellite-card-actions">
        <button className="icon-btn" onClick={() => editSatellite(satellite)}>✏️ Edit</button>
        <button className="icon-btn danger" onClick={() => deleteSatellite(satellite.name)}>🗑 Delete</button>
        <select value={satellite.status} onChange={(e) => changeStatus(satellite.name, e.target.value)}>
          <option value="active">Active</option>
          <option value="offline">Offline</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
    </div>
  );
}

export default SatelliteCard;
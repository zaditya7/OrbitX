import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import "./Analytics.css";

const METRIC_META = {
  battery: { label: "Battery", color: "#4ade80", unit: "%" },
  signal: { label: "Signal", color: "#38bdf8", unit: "%" },
  temperature: { label: "Temperature", color: "#f87171", unit: "°C" }
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-label">Sample {label}</div>
      {payload.map((entry) => {
        const meta = METRIC_META[entry.dataKey];
        if (!meta || entry.value === undefined || entry.value === null) return null;
        return (
          <div key={entry.dataKey} className="chart-tooltip-row">
            <span className="chart-tooltip-dot" style={{ background: meta.color }} />
            <span className="chart-tooltip-name">{meta.label}</span>
            <span className="chart-tooltip-value">
              {entry.value.toFixed(1)}
              {meta.unit}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Analytics({ satellites }) {
  const [selected, setSelected] = useState(0);
  const [showBattery, setShowBattery] = useState(true);
  const [showSignal, setShowSignal] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);

  const sat = satellites[selected];

  if (!sat) {
    return (
      <div>
        <h1>Analytics</h1>
        <p className="analytics-empty">Add a satellite to see telemetry history.</p>
      </div>
    );
  }

  const chartData = (sat.history?.battery || []).map((value, i) => ({
    time: i,
    battery: value,
    signal: (sat.history?.signal || [])[i],
    temperature: (sat.history?.temperature || [])[i]
  }));

  const latestBattery = sat.history?.battery?.[sat.history.battery.length - 1] || 0;
  const latestSignal = sat.history?.signal?.[sat.history.signal.length - 1] || 0;
  const latestTemp = sat.history?.temperature?.[sat.history.temperature.length - 1] || 0;

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1>Analytics</h1>
          <p className="analytics-subtitle">Telemetry history per satellite</p>
        </div>

        <div className="satellite-select-wrapper">
          <span className="satellite-select-icon">🛰</span>
          <select value={selected} onChange={(e) => setSelected(Number(e.target.value))}>
            {satellites.map((satellite, i) => (
              <option key={satellite.name} value={i}>
                {satellite.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="analytics-cards">
        <div className="analytics-card">
          <h3>🔋 Battery</h3>
          <strong>{latestBattery.toFixed(1)}%</strong>
        </div>
        <div className="analytics-card">
          <h3>📶 Signal</h3>
          <strong>{latestSignal.toFixed(1)}%</strong>
        </div>
        <div className="analytics-card">
          <h3>🌡 Temperature</h3>
          <strong>{latestTemp.toFixed(1)}°C</strong>
        </div>
        <div className="analytics-card">
          <h3>🛰 Status</h3>
          <strong className={`status-text ${sat.status}`}>{sat.status}</strong>
        </div>
      </div>

      <div className="chart-controls">
        <button
          className={`chart-toggle-btn battery ${showBattery ? "active" : ""}`}
          onClick={() => setShowBattery(!showBattery)}
        >
          🔋 Battery
        </button>
        <button
          className={`chart-toggle-btn signal ${showSignal ? "active" : ""}`}
          onClick={() => setShowSignal(!showSignal)}
        >
          📶 Signal
        </button>
        <button
          className={`chart-toggle-btn temperature ${showTemperature ? "active" : ""}`}
          onClick={() => setShowTemperature(!showTemperature)}
        >
          🌡 Temperature
        </button>
      </div>

      <div className="chart-card">
        <ResponsiveContainer width="100%" height={360}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
            <XAxis dataKey="time" stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis stroke="#64748b" tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />

            {showBattery && (
              <Line type="monotone" dataKey="battery" stroke="#4ade80" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            )}
            {showSignal && (
              <Line type="monotone" dataKey="signal" stroke="#38bdf8" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            )}
            {showTemperature && (
              <Line type="monotone" dataKey="temperature" stroke="#f87171" strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Analytics;
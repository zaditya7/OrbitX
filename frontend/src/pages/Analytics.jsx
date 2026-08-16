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

function Analytics({ satellites }) {
  const [selected, setSelected] = useState(0);
  const [showBattery, setShowBattery] = useState(true);
  const [showSignal, setShowSignal] = useState(true);
  const [showTemperature, setShowTemperature] = useState(true);

  const sat = satellites[selected];

  if (!sat) {
    return <h1>Analytics</h1>;
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
    <div>
      <h1>Analytics</h1>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 8 }}>Satellite: </label>
        <select
          value={selected}
          onChange={(e) => setSelected(Number(e.target.value))}
        >
          {satellites.map((satellite, i) => (
            <option key={satellite.name} value={i}>
              🛰 {satellite.name}
            </option>
          ))}
        </select>
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
          <strong>{sat.status}</strong>
        </div>
      </div>

      <div className="chart-controls">
        <button
          onClick={() => setShowBattery(!showBattery)}
          style={{
            background: showBattery ? "#00ff88" : "#555",
            color: showBattery ? "#000" : "#fff"
          }}
        >
          🔋 Battery
        </button>
        <button
          onClick={() => setShowSignal(!showSignal)}
          style={{
            background: showSignal ? "#00aaff" : "#555",
            color: showSignal ? "#000" : "#fff"
          }}
        >
          📶 Signal
        </button>
        <button
          onClick={() => setShowTemperature(!showTemperature)}
          style={{
            background: showTemperature ? "#ff4444" : "#555",
            color: showTemperature ? "#fff" : "#fff"
          }}
        >
          🌡 Temperature
        </button>
      </div>

      <ResponsiveContainer width="100%" height={360}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />

          {showBattery && (
            <Line type="monotone" dataKey="battery" stroke="#00ff88" />
          )}
          {showSignal && (
            <Line type="monotone" dataKey="signal" stroke="#00aaff" />
          )}
          {showTemperature && (
            <Line type="monotone" dataKey="temperature" stroke="#ff4444" />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Analytics;

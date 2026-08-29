import { useEffect, useState } from "react";
import "./DashboardHero.css";
import { computeFleetHealth } from "../utils/alerts";

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function DashboardHero({ satellites, streakAnchor }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const health = computeFleetHealth(satellites);
  const streakMs = Math.max(0, now - streakAnchor);
  const circumference = 2 * Math.PI * 40;
  const dashOffset = circumference * (1 - health / 100);
  const healthColor = health >= 80 ? "#4ade80" : health >= 50 ? "#facc15" : "#f87171";

  return (
    <div className="dashboard-hero">
      <div className="dashboard-hero-glow" />

      <div className="dashboard-hero-text">
        <div className="dashboard-hero-eyebrow">MISSION CONTROL</div>
        <h1 className="dashboard-hero-title">FLEET OVERVIEW</h1>
        <p className="dashboard-hero-tagline">
          Tracking {satellites.length} spacecraft in real time.
        </p>

        <div className="dashboard-streak">
          <span className="streak-flame">🔥</span>
          <span>No critical alerts for</span>
          <strong>{formatDuration(streakMs)}</strong>
        </div>
      </div>

      <div className="dashboard-hero-ring">
        <svg viewBox="0 0 100 100" width="110" height="110">
          <circle cx="50" cy="50" r="40" className="ring-track" />
          <circle
            cx="50"
            cy="50"
            r="40"
            className="ring-progress"
            style={{ stroke: healthColor, strokeDasharray: circumference, strokeDashoffset: dashOffset }}
          />
        </svg>
        <div className="ring-label">
          <div className="ring-value" style={{ color: healthColor }}>{health}%</div>
          <div className="ring-caption">Fleet Health</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHero;
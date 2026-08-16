import { useState, useEffect } from "react";
import "./MissionStats.css";

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = now.toISOString().substring(11, 19);
  const date = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="mission-stat-card clock-card">
      <span className="clock-icon">🕒</span>
      <div>
        <div className="clock-time">{time} UTC</div>
        <div className="clock-date">{date}</div>
      </div>
    </div>
  );
}

function MissionStats({ satellites }) {
  const total = satellites.length;
  const active = satellites.filter((s) => s.status === "active").length;

  return (
    <div className="mission-stats">
      <div className="mission-stat-card">
        <span className="dot active" />
        <div>
          <div className="stat-label">Active Satellites</div>
          <div className="stat-value">{active}</div>
        </div>
      </div>

      <div className="mission-stat-card">
        <span className="dot total" />
        <div>
          <div className="stat-label">Total Satellites</div>
          <div className="stat-value">{total}</div>
        </div>
      </div>

      <div className="mission-stat-card">
        <span className="dot missions" />
        <div>
          <div className="stat-label">Active Missions</div>
          <div className="stat-value">{active}</div>
        </div>
      </div>

      <LiveClock />
    </div>
  );
}

export default MissionStats;
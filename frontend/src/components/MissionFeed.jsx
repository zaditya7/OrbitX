import "./MissionFeed.css";

function relativeTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}

const LEVEL_DOT = {
  critical: "#f87171",
  warning: "#facc15",
  resolved: "#4ade80",
  info: "#38bdf8"
};

function MissionFeed({ events }) {
  return (
    <div className="mission-feed-card">
      <div className="mission-feed-header">
        <h2>📋 Mission Log</h2>
        <span className="feed-live-dot" />
      </div>

      {events.length === 0 ? (
        <p className="feed-empty">No events yet — this fills up as your fleet's status changes.</p>
      ) : (
        <div className="feed-list">
          {events.map((event) => (
            <div key={event.id} className="feed-row">
              <span className="feed-dot" style={{ background: LEVEL_DOT[event.level] || "#94a3b8" }} />
              <span className="feed-message">{event.message}</span>
              <span className="feed-time">{relativeTime(event.time)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MissionFeed;
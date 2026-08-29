import "./FleetLeaderboard.css";

const MEDALS = ["🥇", "🥈", "🥉"];

function FleetLeaderboard({ satellites }) {
  const ranked = [...satellites].sort((a, b) => (b.signal || 0) - (a.signal || 0));

  return (
    <div className="leaderboard-card">
      <h2>📶 Signal Leaderboard</h2>

      {ranked.length === 0 ? (
        <p className="leaderboard-empty">Add satellites to see rankings.</p>
      ) : (
        <div className="leaderboard-list">
          {ranked.map((sat, index) => (
            <div key={sat.name} className="leaderboard-row">
              <span className="leaderboard-rank">{MEDALS[index] || `#${index + 1}`}</span>
              <span className="leaderboard-name">{sat.name}</span>
              <div className="leaderboard-bar-track">
                <div
                  className="leaderboard-bar-fill"
                  style={{ width: `${Math.max(0, Math.min(100, sat.signal || 0))}%` }}
                />
              </div>
              <span className="leaderboard-value">{sat.signal?.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FleetLeaderboard;
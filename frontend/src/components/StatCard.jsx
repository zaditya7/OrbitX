import "./StatCard.css";

function StatCard({ title, value, icon, accent = "#3b82f6" }) {
  return (
    <div
      className="stat-card"
      style={{
        "--accent": accent,
        "--accent-soft": `${accent}26`,
        "--accent-glow": `${accent}55`
      }}
    >
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <h3>{title}</h3>
        <h1>{value}</h1>
      </div>
    </div>
  );
}

export default StatCard;
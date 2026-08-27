import "./Alerts.css";

const TYPE_ICON = {
  battery: "🔋",
  temperature: "🌡",
  signal: "📶"
};

function generateAlerts(satellite) {
  const alerts = [];

  if (satellite.battery < 30) {
    alerts.push({
      type: "battery",
      satellite: satellite.name,
      message: "Low battery",
      level: "critical"
    });
  }

  if (satellite.temperature > 50 || satellite.temperature < -20) {
    alerts.push({
      type: "temperature",
      satellite: satellite.name,
      message: "Temperature critical",
      level: "critical"
    });
  }

  if (satellite.signal < 30) {
    alerts.push({
      type: "signal",
      satellite: satellite.name,
      message: "Weak signal",
      level: "warning"
    });
  }

  return alerts;
}

function Alerts({ satellites }) {
  const alerts = satellites.flatMap((s) => generateAlerts(s));
  const criticalCount = alerts.filter((a) => a.level === "critical").length;
  const warningCount = alerts.filter((a) => a.level === "warning").length;

  return (
    <div className="alerts-page">
      <div className="alerts-header">
        <h1>Alerts</h1>
        <p className="alerts-subtitle">Live issues across your fleet</p>
      </div>

      <div className="alerts-summary">
        <div className="alerts-summary-card">
          <span className="summary-label">Total Alerts</span>
          <span className="summary-value">{alerts.length}</span>
        </div>
        <div className="alerts-summary-card critical">
          <span className="summary-label">Critical</span>
          <span className="summary-value">{criticalCount}</span>
        </div>
        <div className="alerts-summary-card warning">
          <span className="summary-label">Warning</span>
          <span className="summary-value">{warningCount}</span>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="alerts-empty">
          <div className="alerts-empty-icon">🚀</div>
          <h2>All clear</h2>
          <p>No active alerts — every satellite is within normal ranges.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {alerts.map((alert, i) => (
            <div key={i} className={`alert-card ${alert.level}`}>
              <div className="alert-icon">{TYPE_ICON[alert.type] || "⚠"}</div>
              <div className="alert-body">
                <div className="alert-satellite">{alert.satellite}</div>
                <div className="alert-message">{alert.message}</div>
              </div>
              <span className={`alert-badge ${alert.level}`}>{alert.level}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;
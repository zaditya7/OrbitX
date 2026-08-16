function Alerts({ satellites }) {
  const generateAlerts = (satellite) => {
    const alerts = [];

    if (satellite.battery < 30) {
      alerts.push({
        type: "battery",
        message: `${satellite.name}: Low battery`,
        level: "critical"
      });
    }

    if (satellite.temperature > 50 || satellite.temperature < -20) {
      alerts.push({
        type: "temperature",
        message: `${satellite.name}: Temperature critical`,
        level: "critical"
      });
    }

    if (satellite.signal < 30) {
      alerts.push({
        type: "signal",
        message: `${satellite.name}: Weak signal`,
        level: "warning"
      });
    }

    return alerts;
  };

  const alerts = satellites.flatMap((s) => generateAlerts(s));

  return (
    <>
      <h1>Alerts</h1>

      {alerts.length === 0 ? (
        <p>No alerts 🚀</p>
      ) : (
        alerts.map((alert, i) => (
          <p
            key={i}
            style={{ color: alert.level === "critical" ? "red" : "orange" }}
          >
            ⚠ {alert.message}
          </p>
        ))
      )}
    </>
  );
}

export default Alerts;


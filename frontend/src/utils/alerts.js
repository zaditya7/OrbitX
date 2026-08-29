// Centralized alert thresholds — the same rules generate alerts everywhere
// (the live simulation tick, the Alerts page, satellite cards) so a
// satellite can't show a warning in one place and nothing in another. This
// replaces three separate copies of near-identical threshold logic that
// previously lived in App.jsx, SatelliteList.jsx, and Alerts.jsx.
export const THRESHOLDS = {
  battery: { warning: 30, critical: 15 },
  signal: { warning: 40, critical: 20 },
  temperature: { warningLow: 0, warningHigh: 30, criticalLow: -5, criticalHigh: 35 }
};

export function getBatteryLevel(value) {
  if (value < THRESHOLDS.battery.critical) return "critical";
  if (value < THRESHOLDS.battery.warning) return "warning";
  return "normal";
}

export function getSignalLevel(value) {
  if (value < THRESHOLDS.signal.critical) return "critical";
  if (value < THRESHOLDS.signal.warning) return "warning";
  return "normal";
}

export function getTemperatureLevel(value) {
  if (value < THRESHOLDS.temperature.criticalLow || value > THRESHOLDS.temperature.criticalHigh) {
    return "critical";
  }
  if (value < THRESHOLDS.temperature.warningLow || value > THRESHOLDS.temperature.warningHigh) {
    return "warning";
  }
  return "normal";
}

export function getCommunicationStatus(signal) {
  if (signal < THRESHOLDS.signal.critical) return "Lost";
  if (signal < THRESHOLDS.signal.warning) return "Intermittent";
  return "Connected";
}

// Rough fleet-wide health score: what fraction of (satellite × metric) checks
// are currently within normal range. Reuses the same thresholds as alerts,
// so a 100% score genuinely means "nothing would trigger an alert right now."
export function computeFleetHealth(satellites) {
  if (!satellites.length) return 100;
  let normalCount = 0;
  let totalChecks = 0;

  satellites.forEach((s) => {
    totalChecks += 3;
    if (getBatteryLevel(s.battery ?? 0) === "normal") normalCount += 1;
    if (getSignalLevel(s.signal ?? 0) === "normal") normalCount += 1;
    if (getTemperatureLevel(s.temperature ?? 0) === "normal") normalCount += 1;
  });

  return Math.round((normalCount / totalChecks) * 100);
}

export function generateAlerts(satellite) {
  const alerts = [];

  const batteryLevel = getBatteryLevel(satellite.battery ?? 0);
  if (batteryLevel !== "normal") {
    alerts.push({
      type: "battery",
      satellite: satellite.name,
      message: batteryLevel === "critical" ? "Critical battery" : "Low battery",
      level: batteryLevel
    });
  }

  const signalLevel = getSignalLevel(satellite.signal ?? 0);
  if (signalLevel !== "normal") {
    alerts.push({
      type: "signal",
      satellite: satellite.name,
      message: signalLevel === "critical" ? "Signal lost" : "Weak signal",
      level: signalLevel
    });
  }

  const temperatureLevel = getTemperatureLevel(satellite.temperature ?? 0);
  if (temperatureLevel !== "normal") {
    alerts.push({
      type: "temperature",
      satellite: satellite.name,
      message: temperatureLevel === "critical" ? "Temperature critical" : "Temperature out of range",
      level: temperatureLevel
    });
  }

  return alerts;
}
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Satellites from "./pages/Satellites";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Mission from "./pages/Mission";

function App() {
  const [satellites, setSatellites] = useState([
    {
      name: "Hubble",
      status: "active",
      country: "USA",
      battery: 20,
      temperature: -18,
      signal: 47,
      altitude: 8.9,
      alerts: [],
      history: {
        battery: [],
        temperature: [],
        signal: []
      }
    }
  ]);

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

  const setSatellitesWithAlerts = (value) => {
    setSatellites((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      return Array.isArray(next)
        ? next.map((satellite) => ({
            ...satellite,
            alerts: generateAlerts(satellite)
          }))
        : next;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSatellitesWithAlerts((prev) =>
        prev.map((s) => {
          const updated = {
            ...s,
            battery: Math.max(0, s.battery - Math.random() * 2),
            signal: Math.max(0, s.signal - Math.random()),
            temperature: s.temperature + (Math.random() * 2 - 1)
          };

          return {
            ...updated,
            alerts: generateAlerts(updated)
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const alertCount = satellites.reduce(
    (total, s) => total + (s.alerts?.length || 0),
    0
  );

  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar alertCount={alertCount} />

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  satellites={satellites}
                  setSatellites={setSatellitesWithAlerts}
                />
              }
            />
            <Route
              path="/satellites"
              element={
                <Satellites
                  satellites={satellites}
                  setSatellites={setSatellitesWithAlerts}
                />
              }
            />
            <Route path="/alerts" element={<Alerts satellites={satellites} />} />
            <Route
              path="/analytics"
              element={<Analytics satellites={satellites} />}
            />
            <Route path="/mission" element={<Mission />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

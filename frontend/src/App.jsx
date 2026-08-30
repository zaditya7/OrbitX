import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Satellites from "./pages/Satellites";
import Alerts from "./pages/Alerts";
import Analytics from "./pages/Analytics";
import Mission from "./pages/Mission";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import SpaceBackground from "./components/SpaceBackground";
import { getOrbitalProfile } from "./utils/satelliteProfile";
import { orbitalPeriodMinutes } from "./utils/orbital";
import { generateAlerts } from "./utils/alerts";

function AppLayout({ satellites, setSatellitesWithAlerts, missions, events, streakAnchor, addEvent, alertCount }) {
  return (
    <div className="app-shell">
      <Sidebar alertCount={alertCount} />

      <div className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard
                  satellites={satellites}
                  setSatellites={setSatellitesWithAlerts}
                  missions={missions}
                  events={events}
                  streakAnchor={streakAnchor}
                  addEvent={addEvent}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/satellites"
            element={
              <ProtectedRoute>
                <Satellites
                  satellites={satellites}
                  setSatellites={setSatellitesWithAlerts}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute>
                <Alerts satellites={satellites} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics satellites={satellites} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mission"
            element={
              <ProtectedRoute>
                <Mission 
                  satellites={satellites} 
                  missions={missions} 
                  setSatellites={setSatellitesWithAlerts}
                  addEvent={addEvent} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin
                  satellites={satellites}
                  setSatellites={setSatellitesWithAlerts}
                  addEvent={addEvent}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const hubbleProfile = getOrbitalProfile("Hubble");

  const [satellites, setSatellites] = useState([
    {
      name: "Hubble",
      status: "active",
      country: "USA",
      battery: 72.4,
      temperature: 11.6,
      signal: 48.7,
      altitude: hubbleProfile.altitudeKm,
      launchDate: "24 Apr 1990",
      lastUpdated: Date.now(),
      alerts: [],
      history: {
        battery: [],
        temperature: [],
        signal: []
      }
    }
  ]);

  const [missions] = useState([
    {
      id: "MISSION-001",
      name: "Hubble Observation Mission",
      satelliteName: "Hubble",
      target: "Deep Space Observation",
      status: "active",
      progress: 67
    }
  ]);

  // Rolling activity log — sourced from real state changes (alerts
  // appearing/clearing, operator status changes), not synthetic filler.
  const [events, setEvents] = useState([]);
  const addEvent = (message, level = "info") => {
    setEvents((prev) =>
      [{ id: `${Date.now()}-${Math.random()}`, time: Date.now(), message, level }, ...prev].slice(0, 30)
    );
  };

  // "Streak" anchor for the Dashboard hero: resets to now() the moment any
  // satellite goes critical, so the counter is genuinely "time since the
  // last critical event," not decorative.
  const sessionStartRef = useRef(Date.now());
  const [streakAnchor, setStreakAnchor] = useState(sessionStartRef.current);
  const prevAlertKeysRef = useRef({});

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

  // Diff alerts after each commit (not inside the state updater, which must
  // stay pure) to turn alert onset/resolution into feed entries.
  useEffect(() => {
    satellites.forEach((sat) => {
      const currentKeys = new Set((sat.alerts || []).map((a) => `${a.type}:${a.level}`));
      const prevKeys = prevAlertKeysRef.current[sat.name] || new Set();

      currentKeys.forEach((key) => {
        if (!prevKeys.has(key)) {
          const alert = sat.alerts.find((a) => `${a.type}:${a.level}` === key);
          if (!alert) return;
          addEvent(
            `${alert.level === "critical" ? "🔴" : "🟡"} ${sat.name}: ${alert.message}`,
            alert.level
          );
          if (alert.level === "critical") {
            setStreakAnchor(Date.now());
          }
        }
      });

      prevKeys.forEach((key) => {
        if (!currentKeys.has(key)) {
          const [type] = key.split(":");
          addEvent(`✅ ${sat.name}: ${type} back to normal`, "resolved");
        }
      });

      prevAlertKeysRef.current[sat.name] = currentKeys;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [satellites]);

  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;

      setSatellitesWithAlerts((prev) =>
        prev.map((s) => {
          const profile = getOrbitalProfile(s.name);

          const altitude =
            profile.altitudeKm + 2 * Math.sin(elapsedSeconds * 0.05 + profile.inclinationDeg);

          const periodMinutes = orbitalPeriodMinutes(profile.altitudeKm);
          const angularSpeed = (2 * Math.PI) / (periodMinutes * 60);
          const temperature =
            5 + 15 * Math.sin(elapsedSeconds * angularSpeed) + (Math.random() - 0.5) * 0.4;

          const battery = Math.min(100, Math.max(5, s.battery + (Math.random() - 0.55) * 0.6));
          const signal = Math.min(100, Math.max(5, s.signal + (Math.random() - 0.5) * 3));

          const updated = {
            ...s,
            altitude,
            temperature,
            battery,
            signal,
            lastUpdated: Date.now()
          };

          const newHistory = {
            battery: [...(s.history?.battery || []), battery].slice(-20),
            temperature: [...(s.history?.temperature || []), temperature].slice(-20),
            signal: [...(s.history?.signal || []), signal].slice(-20)
          };

          return { ...updated, history: newHistory };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const alertCount = satellites.reduce(
    (total, s) => total + (s.alerts?.length || 0),
    0
  );

  return (
    <>
      <SpaceBackground />
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/*"
            element={
              <AppLayout
                satellites={satellites}
                setSatellitesWithAlerts={setSatellitesWithAlerts}
                missions={missions}
                events={events}
                streakAnchor={streakAnchor}
                addEvent={addEvent}
                alertCount={alertCount}
              />
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
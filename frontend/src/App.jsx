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

function AppLayout({ satellites, setSatellitesWithAlerts, missions, alertCount }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar alertCount={alertCount} />

      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard
                  satellites={satellites}
                  setSatellites={setSatellitesWithAlerts}
                  missions={missions}
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
                <Mission satellites={satellites} missions={missions} />
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

  // Satellites and missions are deliberately separate concepts: a satellite
  // is a piece of hardware, a mission is what it's currently tasked with.
  // Dashboard/Mission Control stats now read from this instead of reusing
  // the active-satellite count.
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

  // Single source of truth for the live simulation loop. This used to be
  // duplicated in SatelliteList.jsx too — two intervals independently
  // randomizing the same fields is what caused altitude/battery to swing
  // wildly between renders. There's exactly one tick now, and values are
  // derived from elapsed time rather than randomly walked, so they can't
  // compound into something implausible.
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;

      setSatellitesWithAlerts((prev) =>
        prev.map((s) => {
          const profile = getOrbitalProfile(s.name);

          // Altitude: real baseline for this satellite with a small, bounded
          // oscillation — recomputed fresh from elapsed time every tick, so
          // it can never drift into an unrealistic value.
          const altitude =
            profile.altitudeKm + 2 * Math.sin(elapsedSeconds * 0.05 + profile.inclinationDeg);

          // Temperature drifts on a slow cycle tied to this satellite's real
          // orbital period (a simplified stand-in for sunlight/eclipse
          // transitions), plus a touch of sensor noise.
          const periodMinutes = orbitalPeriodMinutes(profile.altitudeKm);
          const angularSpeed = (2 * Math.PI) / (periodMinutes * 60);
          const temperature =
            5 + 15 * Math.sin(elapsedSeconds * angularSpeed) + (Math.random() - 0.5) * 0.4;

          // Battery/signal: small bounded random walk (slight downward bias
          // on battery, to feel like real drain) instead of a one-directional
          // crash or a big jump every tick.
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
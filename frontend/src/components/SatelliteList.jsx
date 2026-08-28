import "./SatelliteList.css";
import SatelliteCard from "./SatelliteCard";
import { useState, useEffect, useRef } from "react";
import { getOrbitalProfile } from "../utils/satelliteProfile";

function SatelliteList({ satellites, setSatellites, changeStatus }) {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [editingSatellite, setEditingSatellite] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  useEffect(() => {
    const savedSatellites = localStorage.getItem("satellites");
    if (savedSatellites !== null) {
      const parsedSatellites = JSON.parse(savedSatellites);
      const fixedSatellites = parsedSatellites.map((sat) => ({
        ...sat,
        history: sat.history || { battery: [], temperature: [], signal: [] }
      }));
      setSatellites(fixedSatellites);
    }
  }, []);

  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    localStorage.setItem("satellites", JSON.stringify(satellites));
  }, [satellites]);

  const addSatellite = () => {
    if (name === "" || country === "") return;

    if (editingSatellite === null) {
      // Seed new satellites with a physically plausible LEO altitude instead
      // of a totally arbitrary one — see utils/satelliteProfile.js.
      const profile = getOrbitalProfile(name);
      const newSatellite = {
        name,
        status: "active",
        country,
        battery: 60 + Math.random() * 30,
        temperature: 5 + Math.random() * 10,
        signal: 50 + Math.random() * 30,
        altitude: profile.altitudeKm,
        lastUpdated: Date.now(),
        history: { battery: [], temperature: [], signal: [] }
      };
      setSatellites([...satellites, newSatellite]);
    } else {
      const updatedSatellites = satellites.map((satellite) =>
        satellite.name === editingSatellite.name ? { ...satellite, name, country } : satellite
      );
      setSatellites(updatedSatellites);
      setEditingSatellite(null);
    }

    setName("");
    setCountry("");
  };

  const deleteSatellite = (name) => {
    setSatellites(satellites.filter((satellite) => satellite.name !== name));
  };

  const editSatellite = (satellite) => {
    setEditingSatellite(satellite);
    setName(satellite.name);
    setCountry(satellite.country);
  };

  let result = [...satellites]
    .filter((satellite) => satellite.name.toLowerCase().includes(search.toLowerCase()))
    .filter((satellite) => statusFilter === "all" || satellite.status === statusFilter);

  if (sortOrder === "az") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === "za") {
    result.sort((a, b) => b.name.localeCompare(a.name));
  }

  return (
    <div className="satellite-list-section">
      <div className="satellite-list-heading">
        <h2>🛰 Satellites</h2>
        <span className="satellite-count">{result.length} of {satellites.length}</span>
      </div>

      <div className="satellite-toolbar">
        <div className="toolbar-row">
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search satellites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="none">Sort: None</option>
            <option value="az">Sort: A-Z</option>
            <option value="za">Sort: Z-A</option>
          </select>

          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="offline">Offline</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>

        <div className="toolbar-row add-row">
          <input
            type="text"
            placeholder="Satellite name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          <button className="add-satellite-btn" onClick={addSatellite}>
            {editingSatellite === null ? "+ Add Satellite" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="satellite-list">
        {result.map((satellite) => (
          <SatelliteCard
            key={satellite.name}
            satellite={satellite}
            deleteSatellite={deleteSatellite}
            editSatellite={editSatellite}
            changeStatus={changeStatus}
          />
        ))}
      </div>

      {result.length === 0 && <p className="no-results">No satellites match your filters.</p>}
    </div>
  );
}

export default SatelliteList;
import { useState } from "react";
import MissionGlobe from "../components/MissionGlobe";
import MissionStats from "../components/MissionStats";
import SatelliteDetailPanel from "../components/SatelliteDetailPanel";
import "./Mission.css";

function Mission({ satellites = [], missions = [] }) {
  const [selectedName, setSelectedName] = useState(satellites[0]?.name || null);
  const selectedSatellite = satellites.find((s) => s.name === selectedName) || null;

  return (
    <div>
      <div className="mission-header">
        <div>
          <h1>Mission Control</h1>
          <p className="mission-subtitle">Live orbital visualization</p>
        </div>
        <MissionStats satellites={satellites} missions={missions} />
      </div>

      <div className="mission-content">
        <MissionGlobe
          satellites={satellites}
          selectedName={selectedName}
          onSelect={(sat) => setSelectedName(sat.name)}
        />
        <SatelliteDetailPanel satellite={selectedSatellite} />
      </div>
    </div>
  );
}

export default Mission;
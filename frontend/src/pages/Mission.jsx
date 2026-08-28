import { useState } from "react";
import MissionGlobe from "../components/MissionGlobe";
import MissionStats from "../components/MissionStats";
import SatelliteDetailPanel from "../components/SatelliteDetailPanel";
import SatelliteComparePanel from "../components/SatelliteComparePanel";
import "./Mission.css";

function Mission({ satellites = [], missions = [] }) {
  const [selectedName, setSelectedName] = useState(satellites[0]?.name || null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(satellites[0]?.name || null);
  const [compareB, setCompareB] = useState(satellites[1]?.name || satellites[0]?.name || null);

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

      <div className="compare-toggle-row">
        <button className="compare-toggle-btn" onClick={() => setCompareMode((v) => !v)}>
          {compareMode ? "✕ Close Comparison" : "🔬 Compare Satellites"}
        </button>
      </div>

      {compareMode && (
        <SatelliteComparePanel
          satellites={satellites}
          nameA={compareA || satellites[0]?.name}
          nameB={compareB || satellites[1]?.name}
          onChangeA={setCompareA}
          onChangeB={setCompareB}
        />
      )}
    </div>
  );
}

export default Mission;
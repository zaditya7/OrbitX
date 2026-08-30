import "./SatelliteComparePanel.css";
import { orbitalSpeed, orbitalPeriodMinutes } from "../utils/orbital";
import { getOrbitalProfile } from "../utils/satelliteProfile";
import { getSatelliteColor } from "../utils/orbitColors";

function buildRows(satellite) {
  if (!satellite) return null;
  const profile = getOrbitalProfile(satellite.name);
  const altitude = satellite.altitude ?? profile.altitudeKm;
  return {
    altitude: `${altitude.toFixed(1)} km`,
    speed: `${orbitalSpeed(altitude).toFixed(2)} km/s`,
    inclination: `${profile.inclinationDeg.toFixed(1)}°`,
    period: `${orbitalPeriodMinutes(altitude).toFixed(1)} min`,
    battery: `${satellite.battery?.toFixed(1) ?? "—"}%`,
    signal: `${satellite.signal?.toFixed(1) ?? "—"}%`,
    temperature: `${satellite.temperature?.toFixed(1) ?? "—"}°C`,
    status: satellite.status
  };
}

const FIELDS = [
  { key: "altitude", label: "Altitude" },
  { key: "speed", label: "Velocity" },
  { key: "inclination", label: "Inclination" },
  { key: "period", label: "Orbital Period" },
  { key: "battery", label: "Battery" },
  { key: "signal", label: "Signal" },
  { key: "temperature", label: "Temperature" },
  { key: "status", label: "Status" }
];

function SatelliteComparePanel({ satellites, nameA, nameB, onChangeA, onChangeB }) {
  if (satellites.length < 2) {
    return (
      <div className="compare-panel">
        <p className="compare-empty">Add at least two satellites to compare them.</p>
      </div>
    );
  }

  const satA = satellites.find((s) => s.name === nameA);
  const satB = satellites.find((s) => s.name === nameB);
  const indexA = satellites.findIndex((s) => s.name === nameA);
  const indexB = satellites.findIndex((s) => s.name === nameB);
  const rowsA = buildRows(satA);
  const rowsB = buildRows(satB);

  return (
    <div className="compare-panel">
      <div className="compare-header">
        <select value={nameA || ""} onChange={(e) => onChangeA(e.target.value)}>
          {satellites.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
        <span className="compare-vs">vs</span>
        <select value={nameB || ""} onChange={(e) => onChangeB(e.target.value)}>
          {satellites.map((s) => (
            <option key={s.name} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>

      {satA && satB ? (
        <div className="compare-table-scroll">
          <table className="compare-table">
            <thead>
              <tr>
                <th></th>
                <th>
                  <span className="compare-name-dot" style={{ background: getSatelliteColor(indexA) }} />
                  {satA.name}
                </th>
                <th>
                  <span className="compare-name-dot" style={{ background: getSatelliteColor(indexB) }} />
                  {satB.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {FIELDS.map((field) => (
                <tr key={field.key}>
                  <td className="compare-field-label">{field.label}</td>
                  <td>{rowsA[field.key]}</td>
                  <td>{rowsB[field.key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="compare-empty">Pick two satellites to compare.</p>
      )}
    </div>
  );
}

export default SatelliteComparePanel;
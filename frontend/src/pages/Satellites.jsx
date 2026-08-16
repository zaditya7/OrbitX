import SatelliteList from "../components/SatelliteList";

function Satellites({ satellites, setSatellites }) {
  return (
    <>
      <h1>Satellites</h1>
      <SatelliteList satellites={satellites} setSatellites={setSatellites} />
    </>
  );
}

export default Satellites;

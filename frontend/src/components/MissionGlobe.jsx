import Globe from "react-globe.gl";

function MissionGlobe() {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Globe
        width={900}
        height={600}
        backgroundColor="#050b18"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        atmosphereColor="#4da6ff"
        atmosphereAltitude={0.15}
        enablePointerInteraction={true}
      />
    </div>
  );
}

export default MissionGlobe;
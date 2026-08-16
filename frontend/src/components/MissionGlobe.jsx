import Globe from "react-globe.gl";

function MissionGlobe() {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <Globe
        width={900}
        height={600}
        backgroundColor="#020817"
        globeMaterial={{
          color: "#071a2e",
          emissive: "#03101f",
          emissiveIntensity: 0.6,
          shininess: 0.8
        }}
        atmosphereColor="#00aaff"
        atmosphereAltitude={0.12}
        enablePointerInteraction={true}
      />
    </div>
  );
}

export default MissionGlobe;
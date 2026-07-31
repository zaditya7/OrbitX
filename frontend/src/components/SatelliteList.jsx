import "./SatelliteList.css";
import SatelliteCard from "./SalelliteCard";

function SatelliteList () {
    
    const satellites = [
            { name: "🛰 Hubble", status: "active", country: "USA" },
            { name: "🛰 ISS", status: "active", country: "USA" },
            { name: "🛰 Starlink", status: "offline", country: "USA" },
            { name: "🛰 Chandrayaan-3", status: "maintanence", country: "India" }
    ];

    return(
        <div>
            <h2>🛰 Satellites</h2>
            <div className="satellite-list">
                {satellites.map((satellite) => (
                    <SatelliteCard key={satellite.name} satellite={satellite} />
                ))}
            </div>
        </div>
    );
}

export default SatelliteList;
import "./SatelliteList.css";
import SatelliteCard from "./SalelliteCard";

function SatelliteList () {
    
    const satellites = [
            { name: "🛰 Hubble", status: "🟢 Active", country: "USA" },
            { name: "🛰 ISS", status: "🟢 Active", country: "USA" },
            { name: "🛰 Starlink", status: "🔴 Offline", country: "USA" },
            { name: "🛰 Chandrayaan-3", status: "🟡 Maintanence", country: "India" }
    ];

    return(
        <div className="satellite-list">
            <h2>🛰 Satellites</h2>
            
            <ul>

                {satellites.map((satellite) => (
                    <SatelliteCard key={satellite.name} satellite={satellite} />
                ))}
            </ul>
        </div>
    );
}

export default SatelliteList;
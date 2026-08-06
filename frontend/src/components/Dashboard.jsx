import StatCard from "./StatCard";
import "./Dashboard.css";
import MissionStatus from "./MissionStatus";
import SatelliteList from "./SatelliteList";
import { useState } from "react";

function Dashboard() {

    const [satellites, setSatellites] = useState ( [
            { name: "🛰 Hubble", status: "active", country: "USA" },
            { name: "🛰 ISS", status: "active", country: "USA" },
            { name: "🛰 Starlink", status: "offline", country: "USA" },
            { name: "🛰 Chandrayaan-3", status: "maintanence", country: "India" }
    ] ) ;

    return(
        <main>
            <h1>Dashboard</h1>
            <p>Welcome to Orbitx mission control.</p>
            <div className="cards">
                <StatCard title="Total satellites" value={satellites.length}/>
                <StatCard title="active missions" value= { satellites.filter( (satellite) =>
                    satellite.status ==="active").length} />
                <StatCard title="Critical Alerts" value= { satellites.filter((satellite) => status === "offline").length}/>
                <StatCard title = "Signal Strength" value="98%"/>
            </div>
            <MissionStatus />
            <SatelliteList
                satellites = {satellites}
                setSatellites = {setSatellites} />
        </main>
    );
}

export default Dashboard;
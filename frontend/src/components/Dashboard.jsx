import StatCard from "./StatCard";
import "./Dashboard.css";
import MissionStatus from "./MissionStatus";
import SatelliteList from "./SatelliteList";
import { useState } from "react";

function Dashboard() {

    const [satellites, setSatellites] = useState([
        {
            name: "Hubble",
            status: "active",
            country: "USA",

            battery: 20,
            temperature: -18,
            signal: 47,
            altitude: 8.9,

            history: {
            battery: [],
            temperature: [],
            signal: []
            }
        },
        {
            name: "ISS",
            status: "active",
            country: "USA",

            battery: 19,
            temperature: 30,
            signal: 43,
            altitude: 0.2,

            history: {
            battery: [],
            temperature: [],
            signal: []
            }
        }
        ]);

    const changeStatus = (name , status) => {

        const updatedSatellites = satellites.map((satellite) => { 
            if (satellite.name === name) {
                return {
                    ...satellite,
                    status: status
                };
            }

            return satellite;
        });

        setSatellites(updatedSatellites);
    };

    return(
        <main>
            <h1>Dashboard</h1>
            <p>Welcome to Orbitx mission control.</p>
            <div className="cards">
                <StatCard title="Total satellites" value={satellites.length}/>
                <StatCard title="active missions" value= { satellites.filter( (satellite) =>
                    satellite.status ==="active").length} />
                <StatCard title="Critical Alerts" value= { satellites.filter((satellite) => satellite.status === "offline").length}/>
                <StatCard title = "Signal Strength" value="98%"/>
            </div>
            <MissionStatus />
            <SatelliteList
                satellites = {satellites}
                setSatellites = {setSatellites}
                changeStatus = {changeStatus} />
        </main>
    );
}

export default Dashboard;
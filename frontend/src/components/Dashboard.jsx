import StatCard from "./StatCard";
import "./Dashboard.css";
import MissionStatus from "./MissionStatus";
import SatelliteList from "./SatelliteList";

function Dashboard({ satellites, setSatellites }) {
    const changeStatus = (name , status) => {
        setSatellites((prevSatellites) =>
            prevSatellites.map((satellite) => {
                if (satellite.name === name) {
                    return {
                        ...satellite,
                        status: status
                    };
                }

                return satellite;
            })
        );
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
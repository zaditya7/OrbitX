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

    const averageSignal = satellites.length
        ? satellites.reduce((sum, satellite) => sum + (Number(satellite.signal) || 0), 0) / satellites.length
        : 0;

    const criticalAlertsCount = satellites.reduce(
        (count, satellite) => count + ((satellite.alerts || []).filter((alert) => alert.level === "critical").length),
        0
    );

    return(
        <main>
            <h1>Dashboard</h1>
            <p>Welcome to Orbitx mission control.</p>
            <div className="cards">
                <StatCard title="Total satellites" value={satellites.length}/>
                <StatCard title="active missions" value= { satellites.filter( (satellite) =>
                    satellite.status ==="active").length} />
                <StatCard title="Critical Alerts" value={criticalAlertsCount}/>
                <StatCard title = "Signal Strength" value={`${Math.round(averageSignal)}%`}/>
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
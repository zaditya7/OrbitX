import StatCard from "./StatCard";
import "./Dashboard.css";
import MissionStatus from "./MissionStatus";
import SatelliteList from "./SatelliteList";

function Dashboard({ satellites, setSatellites }) {
    const changeStatus = (name, status) => {
        setSatellites((prevSatellites) =>
            prevSatellites.map((satellite) => {
                if (satellite.name === name) {
                    return { ...satellite, status };
                }
                return satellite;
            })
        );
    };

    const changeAllStatus = (status) => {
        setSatellites((prevSatellites) =>
            prevSatellites.map((satellite) => ({ ...satellite, status }))
        );
    };

    const activeCount = satellites.filter((s) => s.status === "active").length;
    const criticalCount = satellites.filter((s) => s.status === "offline").length;
    const avgSignal = satellites.length
        ? Math.round(
              satellites.reduce((sum, s) => sum + (s.signal || 0), 0) / satellites.length
          )
        : 0;

    return (
        <main className="dashboard">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p>Welcome back — here's the current state of your fleet.</p>
            </div>

            <div className="cards">
                <StatCard title="Total Satellites" value={satellites.length} icon="🛰️" accent="#38bdf8" />
                <StatCard title="Active Missions" value={activeCount} icon="🚀" accent="#4ade80" />
                <StatCard title="Critical Alerts" value={criticalCount} icon="⚠️" accent="#f87171" />
                <StatCard title="Avg Signal Strength" value={`${avgSignal}%`} icon="📡" accent="#a78bfa" />
            </div>

            <section className="dashboard-section">
                <MissionStatus satellites={satellites} onBulkStatusChange={changeAllStatus} />
            </section>

            <section className="dashboard-section">
                <SatelliteList
                    satellites={satellites}
                    setSatellites={setSatellites}
                    changeStatus={changeStatus}
                />
            </section>
        </main>
    );
}

export default Dashboard;
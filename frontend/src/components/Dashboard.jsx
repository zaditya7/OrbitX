import StatCard from "./StatCard";
import DashboardHero from "./DashboardHero";
import MissionFeed from "./MissionFeed";
import FleetLeaderboard from "./FleetLeaderboard";
import "./Dashboard.css";
import MissionStatus from "./MissionStatus";
import SatelliteList from "./SatelliteList";

function Dashboard({ satellites, setSatellites, missions = [], events = [], streakAnchor, addEvent }) {
    const changeStatus = (name, status) => {
        setSatellites((prevSatellites) =>
            prevSatellites.map((satellite) => {
                if (satellite.name === name) {
                    if (addEvent) addEvent(`🔧 ${name} set to ${status}`, "info");
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
        if (addEvent) addEvent(`🔧 Fleet set to ${status}`, "info");
    };

    const activeSatelliteCount = satellites.filter((s) => s.status === "active").length;
    const activeMissionCount = missions.filter((m) => m.status === "active").length;
    const criticalAlertCount = satellites.reduce(
        (total, s) => total + (s.alerts?.filter((a) => a.level === "critical").length || 0),
        0
    );
    const avgSignal = satellites.length
        ? Math.round(
              satellites.reduce((sum, s) => sum + (s.signal || 0), 0) / satellites.length
          )
        : 0;

    return (
        <main className="dashboard">
            <DashboardHero satellites={satellites} streakAnchor={streakAnchor} />

            <div className="cards">
                <StatCard title="Total Satellites" value={satellites.length} icon="🛰️" accent="#38bdf8" />
                <StatCard title="Active Satellites" value={activeSatelliteCount} icon="📡" accent="#4ade80" />
                <StatCard title="Active Missions" value={activeMissionCount} icon="🚀" accent="#a78bfa" />
                <StatCard title="Critical Alerts" value={criticalAlertCount} icon="⚠️" accent="#f87171" />
                <StatCard title="Avg Signal Strength" value={`${avgSignal}%`} icon="📶" accent="#facc15" />
            </div>

            <section className="dashboard-section">
                <MissionStatus satellites={satellites} onBulkStatusChange={changeAllStatus} />
            </section>

            <section className="dashboard-section dashboard-widgets">
                <MissionFeed events={events} />
                <FleetLeaderboard satellites={satellites} />
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
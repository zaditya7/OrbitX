import StatCard from "./StatCard";
import "./Dashboard.css";

function Dashboard() {
    return(
        <main>
            <h1>Dashboard</h1>
            <p>Welcome to Orbitx mission control.</p>
            <div className="cards">
                <StatCard title="Total satellites" value="18"/>
                <StatCard title="active missions" value="7" />
                <StatCard title="Critical Alerts" value="2"/>
                <StatCard title = "Signal Strength" value="98%"/>
            </div>
        </main>
    );
}

export default Dashboard;
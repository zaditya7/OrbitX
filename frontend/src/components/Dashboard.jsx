import StatCard from "./StatCard";
import "./Dashboard.css";

function Dashboard() {
    return(
        <main>
            <h1>Dashboard</h1>
            <p>Welcome to Orbitx mission control.</p>
            <div className="cards">
                <StatCard />
                <StatCard />
                <StatCard />
                <StatCard />
            </div>
        </main>
    );
}

export default Dashboard;
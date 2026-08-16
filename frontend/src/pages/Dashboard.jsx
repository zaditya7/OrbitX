import DashboardComponent from "../components/Dashboard";

function Dashboard({ satellites, setSatellites }) {
  return (
    <DashboardComponent satellites={satellites} setSatellites={setSatellites} />
  );
}

export default Dashboard;
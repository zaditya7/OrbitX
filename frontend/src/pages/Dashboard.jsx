import DashboardComponent from "../components/Dashboard";

function Dashboard({ satellites, setSatellites, missions }) {
  return (
    <DashboardComponent satellites={satellites} setSatellites={setSatellites} missions={missions} />
  );
}

export default Dashboard;
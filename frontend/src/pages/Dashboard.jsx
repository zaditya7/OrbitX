import DashboardComponent from "../components/Dashboard";

function Dashboard({ satellites, setSatellites, missions, events, streakAnchor, addEvent }) {
  return (
    <DashboardComponent
      satellites={satellites}
      setSatellites={setSatellites}
      missions={missions}
      events={events}
      streakAnchor={streakAnchor}
      addEvent={addEvent}
    />
  );
}

export default Dashboard;
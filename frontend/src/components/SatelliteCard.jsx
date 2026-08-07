import "./SatelliteCard.css" ;

function SatelliteCard({satellite, deleteSatellite, editSatellite, changeStatus })
{
    let statusText = " ";
    let statusColour = " ";

    if (satellite.status === "active") {
        statusText = "🟢 Active"; statusColour = "limegreen" ;}

    else if (satellite.status === "offline") {
        statusText = "🔴 Offline"; statusColour = "red" ; }

    else if (satellite.status === "maintenance") {
        statusText = "🟡 Maintenance" ; statusColour = "gold" ; }

        
    return(
        <div className="satellite-card">
            <h3> {satellite.name}</h3>

            <p style ={{ color: statusColour}}>{statusText}</p>

            <p>🌍{satellite.country}</p>

            <button onClick ={() => 
                editSatellite(satellite)} > Edit</button>
            <button onClick={() => 
                deleteSatellite(satellite.name)} > Delete</button>
            <button onClick ={() =>
                changeStatus(satellite.name,"active")}> Active </button>
            <button onClick ={() =>
                changeStatus(satellite.name,"offline")}>  Offline </button>
            <button onClick ={() =>
                changeStatus(satellite.name,"maintenance")}> Maintenance </button>
        </div>
    );
}

export default SatelliteCard;
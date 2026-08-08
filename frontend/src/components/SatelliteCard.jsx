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

            <button onClick ={() => editSatellite(satellite)} > Edit</button>

            <button onClick={() => deleteSatellite(satellite.name)} > Delete</button>
            
            <select value={satellite.status}
                onChange={(e) => changeStatus(satellite.name, e.target.value)}>

            <option value="active"> Active </option>

            <option value="offline">  Offline </option>
            
            <option value="maintenance"> Maintenance </option>

            </select>

        </div>
    );
}

export default SatelliteCard;
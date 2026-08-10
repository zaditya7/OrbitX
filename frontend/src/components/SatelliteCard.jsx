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

            <p>🔋 Battery: {satellite.battery?.toFixed(1)}%</p>
            <p>🌡 Temp: {satellite.temperature?.toFixed(1)}°C</p>
            <p>📶 Signal: {satellite.signal?.toFixed(1)}%</p>
            <p>🛰 Altitude: {satellite.altitude?.toFixed(1)} km</p>

            {satellite.alerts && satellite.alerts.length > 0 && (
                <div style={{ marginTop: "10px" }}>
                    {satellite.alerts.map((alert, index) => (
                    <p key={index} className="alert">⚠ {alert}</p>
                    ))}
                </div>
                )}

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
function SatelliteCard({satellite})
{
    return(
        <div>
            <h3> {satellite.name}</h3>

            <p>{satellite.status}</p>

            <p>🌍{satellite.country}</p>
        </div>
    );
}

export default SatelliteCard;
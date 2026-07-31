import "./SatelliteList.css";
import SatelliteCard from "./SalelliteCard";
import {useState} from "react" ;

function SatelliteList () {
    
    const [satellites, setSatellites] = useState ( [
            { name: "🛰 Hubble", status: "active", country: "USA" },
            { name: "🛰 ISS", status: "active", country: "USA" },
            { name: "🛰 Starlink", status: "offline", country: "USA" },
            { name: "🛰 Chandrayaan-3", status: "maintanence", country: "India" }
    ] ) ;

    const [name , setName] = useState ("");

    const [country , setCountry ] = useState ("");

    const addSatellite = () => {

        if (name === "" || country === "") {
            return; }
        

        const newSatellite = {
            name: name ,
            status:"active" ,
            country: country
        };

        setSatellites([...satellites, newSatellite]);

        setName("");
        setCountry("");
    };

    return(
        <div>
            <h2>🛰 Satellites</h2>

            <input type = "text" placeholder="Satellite Name" value = {name} 
            onChange = {(e) => setName (e.target.value)} />

            
            <input type="text" placeholder= "Country name" value={country} 
            onChange={(e) => setCountry (e.target.value)} />


            <button onClick={addSatellite} > Add Satellite </button>


            <div className="satellite-list">

                {satellites.map((satellite) => (
                    <SatelliteCard key={satellite.name} satellite={satellite} />
                ))}

            </div>
        </div>
    );
}

export default SatelliteList;
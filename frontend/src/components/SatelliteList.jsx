import "./SatelliteList.css";
import SatelliteCard from "./SatelliteCard";
import {useState, useEffect, useRef} from "react" ;

function SatelliteList ({satellites, setSatellites, changeStatus}) {

    const [name , setName] = useState ("");

    const [country , setCountry ] = useState ("");

    const [editingSatellite, setEditingSatellite] = useState(null) ;

    const [search , setSearch ] = useState("");

    const [statusFilter, setStatusFilter] = useState ("all");

    const [sortOrder, setSortOrder] = useState("none")



    useEffect(() => {
        const savedSatellites = localStorage.getItem("satellites");

        if (savedSatellites !== null) {
            const parsedSatellites = JSON.parse(savedSatellites);

            setSatellites(parsedSatellites);
        }
    }, []);

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        localStorage.setItem("satellites", JSON.stringify(satellites));
    }, [satellites]);

    const addSatellite = () => {

        if (name === "" || country === "") {
            return; }

        if (editingSatellite === null ) {

            const newSatellite = {
            name: name ,
            status:"active" ,
            country: country
            };

            setSatellites([...satellites, newSatellite]);
            
        } else {

            const updatedSatellites = satellites.map((satellite) => {
                if (satellite.name === editingSatellite.name) {
                    return {
                        ...satellite,
                        name: name,
                        country: country
                    };
                }

                return satellite;
            });
            setSatellites(updatedSatellites);
            setEditingSatellite(null);

        }


        setName("");
        setCountry("");
    };

    const deleteSatellite = (name) => {

        const updateSatellites = satellites.filter((satellite) => satellite.name !== name );
        setSatellites(updateSatellites);
    };

    const editSatellite = (satellite) => {
        setEditingSatellite(satellite);

        setName(satellite.name);
        setCountry(satellite.country);
    };

    const filteredSatellites = satellites
    
        let result = satellites
        
            .filter((satellite) => 
            satellite.name.toLowerCase().includes(search.toLowerCase()))

            .filter((satellite) => 
                statusFilter === "all" || satellite.status === statusFilter);

            console.log(sortOrder);

            if (sortOrder === "az") {
                result.sort((a,b) => 
                a.name.localeCompare(b.name)); }

            else if (sortOrder ==="za") {
                result.sort((a,b) => 
                b.name.localeCompare(a.name)); }

    return(
        <div>
            <h2>🛰 Satellites</h2>

            <input type="text" placeholder ="Search satellites..." value = {search} 
            onChange={(e) => setSearch(e.target.value)} />

            <select value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}>
                <option value="none">None</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>

            </select>

            <select value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}>

                <option value = "all" >All</option>

                <option value = "active">Active</option>

                <option value = "offline">Offline</option>

                <option value = "maintenance">Maintenance</option>
                
            </select>

            <input type = "text" placeholder="Satellite Name" value = {name} 
            onChange = {(e) => setName (e.target.value)} />

            
            <input type="text" placeholder= "Country name" value={country} 
            onChange={(e) => setCountry (e.target.value)} />


            <button onClick={addSatellite} > {editingSatellite === null ? "Add Satellite" : "Save Changes"}</button>


            <div className="satellite-list">

                { result
                
                    .map((satellite) => (
                        <SatelliteCard 
                        key={satellite.name} 
                        satellite={satellite}
                        deleteSatellite = {deleteSatellite}
                        editSatellite={editSatellite}
                        changeStatus = {changeStatus} />
                    ))
                }

            </div>
        </div>
    );
}

export default SatelliteList;
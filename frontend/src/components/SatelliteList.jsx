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

            const fixedSatellites = parsedSatellites.map((sat) => ({
                ...sat,
                history: sat.history || {
                    battery: [],
                    temperature: [],
                    signal: []
                }
            }));

            setSatellites(fixedSatellites);
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSatellites((prev) =>
                prev.map((sat) => {

                    // 🔋 Battery
                    let newBattery = sat.battery - Math.random() * 0.5;
                    if (newBattery <= 0) newBattery = 100;

                    // 🌡 Temp
                    const newTemp = Math.max(
                        -20,
                        Math.min(50, sat.temperature + (Math.random() * 2 - 1))
                    );

                    // 📶 Signal
                    let newSignal = sat.signal + (Math.random() * 4 - 2);
                    newSignal = Math.max(20, Math.min(100, newSignal));

                    // 🛰 Altitude
                    let newAltitude = sat.altitude + (Math.random() * 2 - 1);
                    if (newAltitude < 0) newAltitude = 0;

                    // 🚨 Alerts
                    let alerts = [];

                    if (newBattery < 20) alerts.push("Low Battery");
                    if (newTemp > 40) alerts.push("High Temperature");
                    if (newSignal < 30) alerts.push("Weak Signal");

                    // 📊 History
                    const newHistory = {
                        battery: [...(sat.history?.battery || []), newBattery].slice(-20),
                        temperature: [...(sat.history?.temperature || []), newTemp].slice(-20),
                        signal: [...(sat.history?.signal || []), newSignal].slice(-20)
                    };

                    return {
                        ...sat,
                        battery: newBattery,
                        temperature: newTemp,
                        signal: newSignal,
                        altitude: newAltitude,
                        alerts: alerts,
                        history: newHistory
                    };
                })
            );
        }, 1000);

        return () => clearInterval(interval);
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
                name: name,
                status: "active",
                country: country,
                battery: Math.floor(Math.random() * 50) + 50,
                temperature: Math.floor(Math.random() * 20) + 10,
                signal: Math.floor(Math.random() * 40) + 60,
                altitude: Math.floor(Math.random() * 200) + 400,

                history: {
                    battery: [],
                    temperature: [],
                    signal: []
                }
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
    
        let result = [...satellites]
        
            .filter((satellite) => 
            satellite.name.toLowerCase().includes(search.toLowerCase()))

            .filter((satellite) => 
                statusFilter === "all" || satellite.status === statusFilter);

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
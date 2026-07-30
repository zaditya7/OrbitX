import {useState} from "react";
import "./MissionStatus.css";

function MissionStatus() {
    const [status, setStatus] = useState("Current Status: 🟢 Online");

    return(
        <div>
            <h2>Mission Status</h2>

            <h3>{status}</h3>
            <div className="status-buttons">
                <button onClick={() => setStatus("Current Status: 🔴 Offline")}> Go Offline </button>

                <button onClick={() => setStatus("Current Status: 🟢 Online")} >Go Online</button>

                <button onClick={() => setStatus("Current Status: 🟡 In Maintenance")} >Maintence</button>
            </div> 
        </div>
    );
}
export default MissionStatus;
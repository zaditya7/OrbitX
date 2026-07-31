import {useState} from "react";
import "./MissionStatus.css";

function MissionStatus() {
    const [status, setStatus] = useState("🟢 Online");

    let message = " ";

    if (status == "🟢 Online") {
        message = "✅ All systems operational";
    } else if (status == "🔴 Offline") {
        message = "❌ Communication lost";
    } else {
        message = "🛠 Engineers are performing maintenance";
    }

    return(
        <div>
            <h2>Mission Status</h2>

            <h3>Current Status: {status}</h3>
            <p>{message}</p>

            <div className="status-buttons">
                <button onClick={() => setStatus("🔴 Offline")}> Go Offline </button>

                <button onClick={() => setStatus("🟢 Online")} >Go Online</button>

                <button onClick={() => setStatus("🟡 In Maintenance")} >Maintence</button>
            </div> 
        </div>
    );
}
export default MissionStatus;
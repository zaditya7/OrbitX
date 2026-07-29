import "./Sidebar.css";

function Sidebar() {
    return(
        <aside className="sidebar">
            <h3>Mission Menu</h3>

            <ul>
                <li>Dashbord</li>
                <li>Satellites</li>
                <li>Mission</li>
                <li>Alerts</li>
                <li>Analytics</li>
                <li>Settings</li>
            </ul>
            
        </aside>
    );
}

export default Sidebar;
import "./Sidebar.css";

function Sidebar() {
    const menuItems = [
        "Dashboard",
        "Satellite",
        "Mission",
        "Alert",
        "Analytics",
        "Settings",
    ];
    return(
        <aside className="sidebar">
            <h3>Mission Menu</h3>

            <ul>
                {menuItems.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
            
        </aside>
    );
}

export default Sidebar;
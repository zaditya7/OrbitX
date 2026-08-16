import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ alertCount }) {
  return (
    <div className="sidebar">
      <h2>Mission Menu</h2>

      <ul>
        <li>
          <Link to="/">Dashboard</Link>
        </li>
        <li>
          <Link to="/satellites">Satellite</Link>
        </li>
        <li>
          <Link to="/mission">Mission</Link>
        </li>
        <li>
          <Link to="/alerts">
            Alerts
            {alertCount > 0 && (
              <span className="alert-badge">{alertCount}</span>
            )}
          </Link>
        </li>
        <li>
          <Link to="/analytics">Analytics</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

function Sidebar({ alertCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
        {user?.role === "admin" && (
          <li>
            <Link to="/admin">Admin</Link>
          </li>
        )}
      </ul>

      {user && (
        <div className="sidebar-user">
          <div className="sidebar-username">👤 {user.username}</div>
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
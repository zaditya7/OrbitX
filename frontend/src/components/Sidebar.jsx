import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", accent: "#38bdf8" },
  { to: "/satellites", label: "Satellites", accent: "#4ade80" },
  { to: "/mission", label: "Mission Control", accent: "#a78bfa" },
  { to: "/alerts", label: "Alerts", accent: "#f87171", badgeKey: "alerts" },
  { to: "/analytics", label: "Analytics", accent: "#facc15" }
];

function Sidebar({ alertCount }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Auto-close the drawer whenever the route changes, so tapping a link
  // doesn't leave the overlay sitting open on top of the new page.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const items = [...NAV_ITEMS];
  if (user?.role === "admin") {
    items.push({ to: "/admin", label: "Admin", accent: "#38bdf8" });
  }

  return (
    <>
      <button
        className="mobile-nav-toggle"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {mobileOpen && (
        <div className="sidebar-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <span className="brand-mark-dot" />
          </div>
          <div>
            <div className="brand-title">ORBITX</div>
            <div className="brand-subtitle">Mission Control</div>
          </div>
        </div>

        <div className="sidebar-divider" />

        <nav className="sidebar-nav">
          {items.map((item) => {
            const isActive = location.pathname === item.to;
            const badge = item.badgeKey === "alerts" ? alertCount : 0;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                style={{
                  "--link-accent": item.accent,
                  "--link-accent-soft": `${item.accent}22`
                }}
              >
                <span className="sidebar-link-icon">◆</span>
                <span className="sidebar-link-label">{item.label}</span>
                {badge > 0 && <span className="sidebar-badge">{badge}</span>}
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="sidebar-footer">
            <div className="sidebar-divider" />

            {user.username === "demo" && (
              <div className="demo-badge">🎓 Demo Account</div>
            )}

            <div className="system-status">
              <span className="status-pulse" />
              <span>SYSTEM ONLINE</span>
            </div>

            <div className="sidebar-user">
              <div className="user-avatar">{user.username?.[0]?.toUpperCase() || "?"}</div>
              <div>
                <div className="sidebar-username">{user.username}</div>
                <div className="sidebar-role">
                  {user.role === "admin" ? "Administrator" : "Operator"}
                </div>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Sidebar;
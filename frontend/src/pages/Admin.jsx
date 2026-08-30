import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import SatelliteList from "../components/SatelliteList";
import "./Admin.css";

function UserRow({ u, isSelf, onRoleChange, onDelete }) {
  return (
    <tr>
      <td>{u.username}</td>
      <td>{u.email}</td>
      <td>
        <span className={`role-pill ${u.role}`}>{u.role}</span>
      </td>
      <td>{new Date(u.created_at).toLocaleDateString()}</td>
      <td className="user-actions">
        {u.role === "user" ? (
          <button onClick={() => onRoleChange(u.id, u.username, "admin")}>Make admin</button>
        ) : (
          <button onClick={() => onRoleChange(u.id, u.username, "user")} disabled={isSelf}>
            Remove admin
          </button>
        )}
        <button className="danger" onClick={() => onDelete(u.id, u.username)} disabled={isSelf}>
          Delete
        </button>
      </td>
    </tr>
  );
}

function Admin({ satellites, setSatellites, addEvent }) {
  const { token, user, apiBase } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/users`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to load users");
      setUsers(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = async (id, username, role) => {
    if (!window.confirm(`${role === "admin" ? "Grant" : "Remove"} admin access for "${username}"?`)) {
      return;
    }
    setError("");
    try {
      const res = await fetch(`${apiBase}/users/${id}/role`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ role })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to update role");
      }
      if (addEvent) {
        addEvent(
          `👤 ${username} ${role === "admin" ? "promoted to admin" : "demoted to user"}`,
          "info"
        );
      }
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Permanently delete the account "${username}"? This cannot be undone.`)) {
      return;
    }
    setError("");
    try {
      const res = await fetch(`${apiBase}/users/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to delete user");
      }
      if (addEvent) addEvent(`🗑 Account "${username}" deleted`, "warning");
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = (name, status) => {
    setSatellites((prev) =>
      prev.map((sat) => (sat.name === name ? { ...sat, status } : sat))
    );
    if (addEvent) addEvent(`🔧 ${name} set to ${status}`, "info");
  };

  const adminCount = users.filter((u) => u.role === "admin").length;
  const criticalAlertCount = satellites.reduce(
    (total, s) => total + (s.alerts?.filter((a) => a.level === "critical").length || 0),
    0
  );

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1>Admin</h1>
      <p className="admin-subtitle">Manage users and satellites</p>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-value">{users.length}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Admins</div>
          <div className="admin-stat-value">{adminCount}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Satellites</div>
          <div className="admin-stat-value">{satellites.length}</div>
        </div>
        <div className="admin-stat-card critical">
          <div className="admin-stat-label">Critical Alerts</div>
          <div className="admin-stat-value">{criticalAlertCount}</div>
        </div>
      </div>

      <section className="admin-section">
        <div className="admin-section-header">
          <h2>Users</h2>
          <input
            className="admin-search"
            type="text"
            placeholder="Search by username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {error && <p className="auth-error">{error}</p>}
        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <UserRow
                    key={u.id}
                    u={u}
                    isSelf={u.id === user.id}
                    onRoleChange={handleRoleChange}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && filteredUsers.length === 0 && (
          <p className="admin-empty">No users match "{search}".</p>
        )}
      </section>

      <section className="admin-section">
        <h2>Satellites</h2>
        <SatelliteList
          satellites={satellites}
          setSatellites={setSatellites}
          changeStatus={changeStatus}
        />
      </section>
    </div>
  );
}

export default Admin;
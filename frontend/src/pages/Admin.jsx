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
          <button onClick={() => onRoleChange(u.id, "admin")}>Make admin</button>
        ) : (
          <button onClick={() => onRoleChange(u.id, "user")} disabled={isSelf}>
            Remove admin
          </button>
        )}
        <button className="danger" onClick={() => onDelete(u.id)} disabled={isSelf}>
          Delete
        </button>
      </td>
    </tr>
  );
}

function Admin({ satellites, setSatellites }) {
  const { token, user, apiBase } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

  const handleRoleChange = async (id, role) => {
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
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
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
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = (name, status) => {
    setSatellites((prev) =>
      prev.map((sat) => (sat.name === name ? { ...sat, status } : sat))
    );
  };

  return (
    <div>
      <h1>Admin</h1>
      <p className="admin-subtitle">Manage users and satellites</p>

      <section className="admin-section">
        <h2>Users</h2>
        {error && <p className="auth-error">{error}</p>}
        {loading ? (
          <p>Loading users...</p>
        ) : (
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
              {users.map((u) => (
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
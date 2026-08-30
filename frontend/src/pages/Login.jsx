import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GuestLoginButton from "../components/GuestLoginButton";
import "./Auth.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, isWaking } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>🛰 OrbitX</h1>
        <p className="auth-subtitle">Sign in to Mission Control</p>

        {error && <p className="auth-error">{error}</p>}

        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        {isWaking && (
          <p className="auth-waking-note">
            ⏳ Waking up the server — first request after inactivity can take up to a minute.
          </p>
        )}

        <p className="auth-switch">
          No account? <Link to="/signup">Create one</Link>
        </p>

        <GuestLoginButton />
      </form>
    </div>
  );
}

export default Login;
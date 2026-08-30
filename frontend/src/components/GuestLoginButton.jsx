import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function GuestLoginButton() {
  const { loginAsDemo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleClick = async () => {
    setError("");
    setLoading(true);
    try {
      await loginAsDemo();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="guest-login-block">
      <div className="auth-divider"><span>or</span></div>
      <button type="button" className="guest-login-btn" onClick={handleClick} disabled={loading}>
        {loading ? "Entering demo..." : "🚀 Continue as Guest"}
      </button>
      {error && <p className="auth-error" style={{ marginTop: 10 }}>{error}</p>}
    </div>
  );
}

export default GuestLoginButton;
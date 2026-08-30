import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isWaking } = useAuth();

  if (loading) {
    return <LoadingScreen showWakingNote={isWaking} />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
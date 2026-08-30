import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

const AuthContext = createContext(null);

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const TOKEN_KEY = "orbitx_token";
const WAKE_WARNING_DELAY_MS = 4000;

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWaking, setIsWaking] = useState(false);
  const wakeTimerRef = useRef(null);

  // Only shows the "waking up" note if a request is genuinely slow — not on
  // every normal, fast request. Timer starts on request, is cancelled the
  // moment it resolves.
  const startWakeTimer = () => {
    wakeTimerRef.current = setTimeout(() => setIsWaking(true), WAKE_WARNING_DELAY_MS);
  };
  const clearWakeTimer = () => {
    clearTimeout(wakeTimerRef.current);
    setIsWaking(false);
  };

  const fetchMe = useCallback(async (activeToken) => {
    if (!activeToken) {
      setUser(null);
      setLoading(false);
      return;
    }
    startWakeTimer();
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error("Session expired");
      setUser(await res.json());
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      clearWakeTimer();
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe(token);
  }, [token, fetchMe]);

  const applyAuth = (data) => {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    setToken(data.access_token);
    setUser(data.user);
  };

  const postJson = async (path, body) => {
    startWakeTimer();
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Request failed");
      return data;
    } finally {
      clearWakeTimer();
    }
  };

  const login = async (username, password) => {
    const data = await postJson("/auth/login", { username, password });
    applyAuth(data);
    return data.user;
  };

  const signup = async (username, email, password) => {
    const data = await postJson("/auth/signup", { username, email, password });
    applyAuth(data);
    return data.user;
  };

  const loginAsDemo = async () => {
    const data = await postJson("/auth/demo-login");
    applyAuth(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isWaking, login, signup, loginAsDemo, logout, apiBase: API_BASE }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
import { createContext, useContext, useState, useCallback } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("lp_user");
    return raw ? JSON.parse(raw) : null;
  });

  const setSession = useCallback(({ token, user: nextUser }) => {
    if (token) localStorage.setItem("lp_token", token);
    if (nextUser) {
      localStorage.setItem("lp_user", JSON.stringify(nextUser));
      setUser(nextUser);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("lp_token");
    localStorage.removeItem("lp_user");
    setUser(null);
    window.location.href = "/login";
  }, []);

  const isAuthenticated = Boolean(localStorage.getItem("lp_token"));

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, setSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

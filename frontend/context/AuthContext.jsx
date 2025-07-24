import { createContext, useContext, useState, useEffect } from "react";
import {
  me,
  logout as apiLogout,
  login as apiLogin,
} from "../services/api/auth";
import { logClientError } from "../services/logger";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const u = await me();
        setUser(u);
      } catch (err) {
        setUser(null);
        logClientError(
          "AuthContext.js",
          "Kullanıcı oturum kontrolü başarısız",
          err?.message || "",
          "mid"
        );
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const u = await apiLogin(email, password);
      setUser(u);
      return u;
    } catch (err) {
      logClientError(
        "AuthContext.js",
        "Giriş işlemi başarısız",
        err?.message || "",
        "high"
      );
      throw err;
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (err) {
      logClientError(
        "AuthContext.js",
        "Çıkış işlemi başarısız",
        err?.message || "",
        "low"
      );
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

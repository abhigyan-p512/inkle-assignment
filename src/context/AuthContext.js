// client/src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("saf_user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("saf_token") || null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const saveAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("saf_token", newToken);
    localStorage.setItem("saf_user", JSON.stringify(newUser));
  };

  const signup = async (name, username, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/signup", {
        name,
        username,
        email,
        password,
      });

      // Works for both { token, user } and { data: { token, user } }
      const payload = res.data?.data || res.data;
      const { token: t, user: u } = payload;

      saveAuth(t, u);
      return { success: true };
    } catch (err) {
      console.error("signup error", err);
      const message = err.response?.data?.message || "Signup failed";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      // Works for both { token, user } and { data: { token, user } }
      const payload = res.data?.data || res.data;
      const { token: t, user: u } = payload;

      saveAuth(t, u);
      return { success: true };
    } catch (err) {
      console.error("login error", err);
      const message = err.response?.data?.message || "Login failed";
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("saf_token");
    localStorage.removeItem("saf_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useEffect, useState } from "react";
import { loginUser } from "../services/auth.service";


export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // جب app mount ہو تو localStorage سے user restore کریں
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    
    // Initialize complete mark کریں
    setIsInitialized(true);
  }, []);

  const login = async (data) => {
    const res = await loginUser(data);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isInitialized }}>
      {children}
    </AuthContext.Provider>
  );
};

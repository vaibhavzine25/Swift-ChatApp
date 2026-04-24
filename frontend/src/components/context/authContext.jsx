import axios from "axios";
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);

  const setAuthenticated = (value) => {
    setIsAuthenticated(value);
  };

  const checkAuth = async () => {
    try {
      await axios.get("/api/user/profile", { withCredentials: true });
      setAuthenticated(true);
      return true;
    } catch (error) {
      setAuthenticated(false);
      return false;
    } finally {
      setAuthResolved(true);
    }
  };

  const logout = () => {
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        authResolved,
        setAuthenticated,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem("token") || ""
  );

  // Sync token across tabs & interceptor updates
  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem("token") || "");
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const Login = (accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    setToken(accessToken);
  };

  const Logout = () => {
    localStorage.clear();
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ token, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

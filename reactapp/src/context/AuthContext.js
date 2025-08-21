import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(() => ({
    user,
    login: (payload) => {
      localStorage.setItem("token", payload.token);
      console.log("token:", payload.token);
      localStorage.setItem("user", JSON.stringify({
        userId: payload.userId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        userType: payload.userType,
      }));
      setUser({
        userId: payload.userId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        userType: payload.userType,
      });
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

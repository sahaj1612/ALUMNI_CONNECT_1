import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api/client.js";

// Authentication context for the frontend. Tracks session state,
// performs login/logout actions, and refreshes session status.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    authenticated: false,
    userType: "",
    user: null,
  });

  const refreshSession = async () => {
    try {
      const data = await api.get("/auth/me");
      setAuthState({
        loading: false,
        authenticated: Boolean(data.authenticated),
        userType: data.userType || "",
        user: data.user || null,
      });
    } catch (_error) {
      setAuthState({
        loading: false,
        authenticated: false,
        userType: "",
        user: null,
      });
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const loginStudent = async (payload) => {
    const data = await api.post("/auth/student/login", payload);
    setAuthState({
      loading: false,
      authenticated: true,
      userType: "student",
      user: data.user,
    });
    return data;
  };

  const loginAlumni = async (payload) => {
    const data = await api.post("/auth/alumni/login", payload);
    setAuthState({
      loading: false,
      authenticated: true,
      userType: "alumni",
      user: data.user,
    });
    return data;
  };

  const logout = async () => {
    await api.post("/auth/logout", {});
    setAuthState({
      loading: false,
      authenticated: false,
      userType: "",
      user: null,
    });
  };

  const value = useMemo(
    () => ({
      ...authState,
      loginStudent,
      loginAlumni,
      logout,
      refreshSession,
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isAuth: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState(
    Boolean(localStorage.getItem("auth"))
  );

  const login = () => {
    localStorage.setItem("auth", "true");
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuth } = useAuth();
  return isAuth ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;

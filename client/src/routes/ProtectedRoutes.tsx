// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { isTokenValid } from "../utils/auth";

const ProtectedRoute = () => {
  const isAuth = isTokenValid();

  if (!isAuth) {
    localStorage.removeItem("access_token");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

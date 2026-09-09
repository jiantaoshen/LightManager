import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || !localStorage.getItem("token")) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

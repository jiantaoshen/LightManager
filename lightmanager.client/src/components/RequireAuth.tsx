/**
 * File: components/RequireAuth.tsx
 * Purpose: Protects application routes while allowing tokenless Trial sessions.
 * Component: RequireAuth.
 */

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { STORAGE_KEYS } from "../lib/storage";

export default function RequireAuth() {
  const { user, isTrial } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isTrial && !localStorage.getItem(STORAGE_KEYS.authToken)) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

/**
 * File: context/useAuth.ts
 * Purpose: Exposes the authentication context through a guarded React hook.
 * Function: useAuth.
 */

import { useContext } from "react";
import { AuthContext } from "./authContextCore";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

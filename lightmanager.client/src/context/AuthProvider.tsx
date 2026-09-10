/**
 * File: context/AuthProvider.tsx
 * Purpose: Owns authenticated/trial user state and persists the current user session locally.
 * Component: AuthProvider.
 * Functions: login, enterTrial, logout.
 */

import { useCallback, useState } from "react";
import { clearLocalTrialTasks } from "../lib/trial";
import { STORAGE_KEYS } from "../lib/storage";
import { AuthContext, type AuthContextType, type User } from "./authContextCore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.authUser);
    if (!saved) return null;

    try {
      return JSON.parse(saved) as User;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.authUser);
      return null;
    }
  });

  const isTrial = user?.mode === "trial";

  const login = useCallback((userData: User) => {
    const authenticatedUser: User = {
      ...userData,
      mode: "authenticated",
    };

    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(authenticatedUser));
  }, []);

  const enterTrial = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.authToken);
    clearLocalTrialTasks();

    const trialUser: User = {
      fullName: "Trial",
      email: "Guest mode",
      userId: "trial",
      mode: "trial",
    };

    setUser(trialUser);
    localStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(trialUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.authUser);
    localStorage.removeItem(STORAGE_KEYS.authToken);
  }, []);

  const value: AuthContextType = {
    user,
    isTrial,
    login,
    enterTrial,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

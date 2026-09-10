/**
 * File: context/authContextCore.ts
 * Purpose: Defines authentication context types and the shared React context object.
 * Types: AuthMode, User, AuthContextType.
 * Export: AuthContext.
 */

import { createContext } from "react";

export type AuthMode = "authenticated" | "trial";

export type User = {
  fullName: string;
  email: string;
  userId: string;
  mode?: AuthMode;
};

export type AuthContextType = {
  user: User | null;
  isTrial: boolean;
  login: (user: User) => void;
  enterTrial: () => void;
  logout: () => void;
  setUser: (user: User | null) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

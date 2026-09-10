import {
  useCallback,
  useState,
} from "react";

import {
  AuthContext,
  type AuthContextType,
  type User,
} from "./authContextCore";

import {
  clearLocalTrialTasks,
} from "../lib/trial";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(() => {
      const saved =
        localStorage.getItem("user");

      if (!saved) {
        return null;
      }

      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem("user");
        return null;
      }
    });

  const isTrial =
    user?.mode === "trial";

  const login = useCallback(
    (userData: User) => {
      const authenticatedUser: User = {
        ...userData,
        mode: "authenticated",
      };

      setUser(authenticatedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(authenticatedUser),
      );
    },
    [],
  );

  const enterTrial = useCallback(() => {
    /*
      Important:
      Trial mode must never inherit a JWT
      from a previously logged-in account.
    */
    localStorage.removeItem("token");

    /*
      Every time someone explicitly starts
      a new Trial session, start again from
      the server's trial template.
    */
    clearLocalTrialTasks();

    const trialUser: User = {
      fullName: "Trial",
      email: "Guest mode",
      userId: "trial",
      mode: "trial",
    };

    setUser(trialUser);

    localStorage.setItem(
      "user",
      JSON.stringify(trialUser),
    );
  }, []);

  const logout = useCallback(() => {
    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }, []);

  const value: AuthContextType = {
    user,
    isTrial,
    login,
    enterTrial,
    logout,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
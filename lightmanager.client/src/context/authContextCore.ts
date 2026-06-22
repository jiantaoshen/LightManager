import { createContext } from "react";

export type User = {
    fullName: string;
    email: string;
    userId: string;
};

export type AuthContextType = {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    setUser: (user: User | null) => void
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
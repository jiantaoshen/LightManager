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
};

export const AuthContext = createContext({
    user: null,
    login: (user: User) => { },
    logout: () => { },
    setUser: (user: User | null) => { }
});
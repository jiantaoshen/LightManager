import { useState, useCallback } from "react";
import { AuthContext, type User, type AuthContextType } from "./authContextCore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });

    const login = useCallback((userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem("user");
    }, []);

    const value: AuthContextType = {
        user,
        login,
        logout,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
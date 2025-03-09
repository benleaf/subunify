import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { cognitoLogin } from "./AuthService";
import { AuthUser } from "@/types/AuthUser";
import { apiAction } from "@/api/apiAction";
import { RequestMethod } from "@/types/server/RequestMethod";
import { isError } from "@/api/isError";
import { ApiError } from "@/types/server/ApiError";
import { StateMachineDispatch } from "@/App";

interface AuthContextType {
    user: AuthUser | null
    subscribed: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    authAction: <T>(endpoint: string, method: RequestMethod, body?: string) => Promise<T | Partial<ApiError>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any>(null);
    const [subscribed, setSubscribed] = useState<any>(true);
    const { dispatch } = useContext(StateMachineDispatch)!

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setUser(jwtDecode(storedToken));
        }
    }, []);

    const login = async (email: string, password: string) => {
        if (!email || !password) return
        const token = await cognitoLogin(email, password);
        setUser(jwtDecode(token));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const authAction = async <T,>(endpoint: string, method: RequestMethod, body?: string) => {
        const result = await apiAction<T>(endpoint, method, body);
        if (isError(result) && result.error == 'Unauthorized') {
            logout();
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Session Expired, please login again' } })
        } else if (isError(result) && result.error == 'UserNotSubscribed') {
            setSubscribed(false)
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to find users subscription' } })
        }
        return result;
    };

    return <AuthContext.Provider value={{ user, login, logout, authAction, subscribed }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

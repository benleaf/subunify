import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { cognitoLogin, cognitoRefreshTokens } from "./AuthService";
import { AuthUser } from "@/types/AuthUser";
import { apiAction, rawApiAction } from "@/api/apiAction";
import { RequestMethod } from "@/types/server/RequestMethod";
import { isError } from "@/api/isError";
import { ApiError } from "@/types/server/ApiError";
import { StateMachineDispatch } from "@/App";
import { CognitoUser } from "amazon-cognito-identity-js";

interface AuthContextType {
    user: AuthUser | null
    subscribed: boolean
    login: (email: string, password: string) => Promise<void>
    loginWithGoogle: (googleIdToken: string) => Promise<void>
    logout: () => void
    authAction: <T>(endpoint: string, method: RequestMethod, body?: string | FormData) => Promise<T | Partial<ApiError>>
    rawAuthAction: (endpoint: string, method: RequestMethod, body?: string | FormData | Blob) => Promise<Partial<ApiError> | Response>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [cognitoUser, setCognitoUser] = useState<CognitoUser>();
    const [subscribed, setSubscribed] = useState<any>(true);
    const { dispatch } = useContext(StateMachineDispatch)!

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setUser(jwtDecode(storedToken));
        }
    }, []);

    const login = async (email: string, password: string) => {
        const { token, cognitoUser } = await cognitoLogin(email, password);
        setCognitoUser(cognitoUser)
        setUser(jwtDecode(token));
    };

    const loginWithGoogle = async (googleIdToken: string) => {
        localStorage.setItem("token", googleIdToken);
        setUser(jwtDecode(googleIdToken));
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const authAction = async <T,>(endpoint: string, method: RequestMethod, body?: string | FormData | Blob) => {
        dispatch({ action: 'loading', data: true })
        try {
            const result = await apiAction<T>(endpoint, method, body);
            dispatch({ action: 'loading', data: false })
            return handleAction(result);
        } catch (error: TODO) {
            dispatch({ action: 'loading', data: false })

            if (error.message == "Failed to fetch") {
                return { message: 'Unable to connect to the SUBUNIFY server', error: 'ConnectionError' } as Partial<ApiError>
            }

            return { message: error.message, error: 'UnknownError' } as Partial<ApiError>
        }
    };

    const rawAuthAction = async (endpoint: string, method: RequestMethod, body?: string | FormData | Blob) => {
        const result = await rawApiAction(endpoint, method, body);
        return handleAction(result);
    };

    const handleAction = <T,>(result: T) => {
        if (isError(result) && result.error == 'Unauthorized') {
            logout();
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Session Expired, please login again' } })
        } else if (isError(result) && result.error == 'UserNotSubscribed') {
            setSubscribed(false)
            dispatch({ action: 'popup', data: { colour: 'warning', message: 'Subscription needed' } })
        }

        setSubscribed(true)

        if (cognitoUser) {
            cognitoRefreshTokens(cognitoUser)
        }

        return result;
    }

    return <AuthContext.Provider value={{ user, login, logout, authAction, rawAuthAction, subscribed, loginWithGoogle }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

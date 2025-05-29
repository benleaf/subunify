import React, { createContext, useState, useEffect, useContext } from "react";
import { cognitoLogin, cognitoRefreshTokens, UserPool } from "../auth/AuthService";
import { apiAction, rawApiAction } from "@/api/apiAction";
import { RequestMethod } from "@/types/server/RequestMethod";
import { isError } from "@/api/isError";
import { ApiError } from "@/types/server/ApiError";
import { StateMachineDispatch } from "@/App";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { User } from "@/types/User";

interface AuthContextType {
    user: Partial<User>
    setUserAttributes: (attributes: Partial<User>) => void
    subscribed: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    authAction: <T>(endpoint: string, method: RequestMethod, body?: string | FormData) => Promise<T | Partial<ApiError>>
    rawAuthAction: (endpoint: string, method: RequestMethod, body?: string | FormData | Blob) => Promise<Partial<ApiError> | Response>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const abortController = new AbortController()
    const { signal } = abortController

    const [cognitoUser, setCognitoUser] = useState<CognitoUser>();
    const [subscribed, setSubscribed] = useState<any>(true);
    const [session, setSession] = useState<CognitoUserSession | null>(null);
    const [user, setUser] = useState<Partial<User>>({
        color: '#f00'
    });
    const { dispatch } = useContext(StateMachineDispatch)!

    const getStoredAttributes = () => {
        return JSON.parse(localStorage.getItem('user') || '{}') as Partial<User>
    }

    const updateUser = (cognitoUser: CognitoUser) => {
        cognitoUser.getUserAttributes((error, result) => {
            if (error) return console.error("Get user attributes error: ", error);
            const attributes = result?.reduce((acc, attr) => {
                acc[attr.getName()] = attr.getValue();
                return acc;
            }, {} as { [key: string]: string }) || {};
            setUserAttributes(attributes)
        })
    }

    useEffect(() => {
        const currentUser = UserPool.getCurrentUser();
        setUser(getStoredAttributes())

        if (!currentUser) return;

        currentUser.getSession((err: Error, session: CognitoUserSession | null) => {
            if (err || !session?.isValid()) {
                setCognitoUser(undefined)
                setSession(null)
                setUser({})
                return
            }

            updateUser(currentUser)
            setCognitoUser(currentUser)
            setSession(session)
        })

        return () => {
            console.log("Cleaning up AuthContext");
            abortController.abort()
        };
    }, []);

    const setUserAttributes = (attributes: Partial<User>) => {
        localStorage.setItem('user', JSON.stringify({ ...getStoredAttributes(), ...user, ...attributes }));
        setUser(prev => ({ ...prev, ...attributes }));
    }

    const login = async (email: string, password: string) => {
        const { cognitoUser, session } = await cognitoLogin(email, password);
        setCognitoUser(cognitoUser)
        setSession(session)
        updateUser(cognitoUser)
    };

    const logout = () => {
        console.log(user)
        cognitoUser?.signOut(() => {
            setSession(null);
            setCognitoUser(undefined)
            localStorage.removeItem('user')
            setUser({})
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Logout Successful' } })
        })
    };

    const authAction = async <T,>(endpoint: string, method: RequestMethod, body?: string | FormData | Blob) => {
        dispatch({ action: 'loading', data: true })
        try {
            const result = await apiAction<T>({ endpoint, method, body, signal, session });
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
        const result = await rawApiAction({ endpoint, method, body, signal, session });
        return handleAction(result);
    };

    const handleAction = <T,>(result: T) => {
        if (isError(result) && result.error == 'Unauthorized') {
            logout();
            dispatch({ action: 'popup', data: { colour: 'info', message: 'Please login to use this page' } })
        } else if (isError(result) && result.error == 'UserNotSubscribed') {
            setSubscribed(false)
            dispatch({ action: 'popup', data: { colour: 'info', message: 'Subscription needed' } })
        }

        setSubscribed(true)

        if (cognitoUser) {
            cognitoRefreshTokens(cognitoUser)
        }

        return result;
    }

    return <AuthContext.Provider value={{ user, setUserAttributes, login, logout, authAction, rawAuthAction, subscribed }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

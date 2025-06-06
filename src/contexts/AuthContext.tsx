import React, { createContext, useState, useEffect, useContext } from "react";
import { cognitoLogin, SessionUser, UserPool } from "../auth/AuthService";
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

    const [subscribed, setSubscribed] = useState<any>(true);
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
    const [user, setUser] = useState<Partial<User>>({})
    const { dispatch } = useContext(StateMachineDispatch)!

    const updateUser = (currentUser: CognitoUser) => {
        currentUser.getUserAttributes(async (error, result) => {
            if (error) return console.error("Get user attributes error: ", error);

            const attributes: Partial<User> = result?.reduce((acc, attr) => {
                acc[attr.getName()] = attr.getValue();
                return acc;
            }, {} as { [key: string]: string }) || {};

            setUser(attributes)
        })
    }

    useEffect(() => {
        const cognitoUser = UserPool.getCurrentUser();
        if (!cognitoUser) return logout()

        cognitoUser.getSession((err: Error, session: CognitoUserSession | null) => {
            if (err || !session?.isValid()) {
                setSessionUser(null)
                setUser({})
                return
            }

            setSessionUser({ session, cognitoUser })
            updateUser(cognitoUser)
        })

        return () => {
            console.log("Cleaning up AuthContext");
            abortController.abort()
        };
    }, []);

    useEffect(() => {
        if (user.email && !user.id) setServerUser()
    }, [user])


    const setServerUser = async () => {
        const serverUser = await authAction<User>('user', 'GET')
        if (!isError(serverUser)) {
            setUserAttributes(serverUser)
        }
    }

    const setUserAttributes = (attributes: Partial<User>) => {
        setUser(prev => ({ ...prev, ...attributes }));
    }

    const login = async (email: string, password: string) => {
        const oldUser = UserPool.getCurrentUser()
        if (oldUser) oldUser.signOut()

        const sessionUser = await cognitoLogin(email, password);
        setSessionUser(sessionUser)
        updateUser(sessionUser.cognitoUser)
    };

    const logout = (popup: boolean = true) => {
        UserPool.getCurrentUser()?.signOut()
        setSessionUser(null);
        setUser({})
        popup && dispatch({ action: 'popup', data: { colour: 'success', message: 'Logout Successful' } })
    };

    const authAction = async <T,>(endpoint: string, method: RequestMethod, body?: string | FormData | Blob) => {
        if (!sessionUser) return { message: 'No Login Session Found', error: 'Unauthorized' } as Partial<ApiError>

        try {
            const result = await apiAction<T>({ endpoint, method, body, signal, sessionUser });
            return handleAction(result);
        } catch (error: TODO) {
            if (error.message == "Failed to fetch") {
                return { message: 'Unable to connect to the SUBUNIFY server', error: 'ConnectionError' } as Partial<ApiError>
            }

            return { message: error.message, error: 'UnknownError' } as Partial<ApiError>
        }
    };

    const rawAuthAction = async (endpoint: string, method: RequestMethod, body?: string | FormData | Blob) => {
        if (!sessionUser) return { message: 'No Login Session Found', error: 'Unauthorized' } as Partial<ApiError>
        const result = await rawApiAction({ endpoint, method, body, signal, sessionUser });
        return handleAction(result);
    };

    const handleAction = <T,>(result: T) => {
        if (isError(result) && result.error == 'Unauthorized') {
            logout(false);
            dispatch({ action: 'popup', data: { colour: 'info', message: 'Please login to use this page' } })
        } else if (isError(result) && result.error == 'UserNotSubscribed') {
            setSubscribed(false)
            dispatch({ action: 'popup', data: { colour: 'info', message: 'Subscription needed' } })
        }

        setSubscribed(true)

        return result;
    }

    return <AuthContext.Provider value={{ user, setUserAttributes, login, logout, authAction, rawAuthAction, subscribed }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

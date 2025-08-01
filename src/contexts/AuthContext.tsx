import React, { createContext, useState, useEffect, useContext } from "react";
import { cognitoLogin, SessionUser, UserPool } from "../auth/AuthService";
import { apiAction, download, rawApiAction } from "@/api/apiAction";
import { RequestMethod } from "@/types/server/RequestMethod";
import { isError } from "@/api/isError";
import { ApiError } from "@/types/server/ApiError";
import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";
import { User } from "@/types/User";
import { useUpload } from "./UploadContext";
import { AlertColor, Backdrop, CircularProgress } from "@mui/material";
import UniversalAlert from "@/components/modal/UniversalAlert";
import { AuthAction } from "@/types/actions/AuthAction";

interface AuthContextType {
    user: Partial<User>
    setUserAttributes: (attributes: Partial<User>) => void
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    authAction: AuthAction
    rawAuthAction: (endpoint: string, method: RequestMethod, body?: string | FormData | Blob) => Promise<Partial<ApiError> | Response>
    downloadAction: (endpoint: string, bytes: number) => Promise<void>
    setAlert: (message: string, colour?: AlertColor) => void
    setLoading: (isLoading: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const abortController = new AbortController()
    const { signal } = abortController
    const { uploadManager } = useUpload()
    const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
    const [user, setUser] = useState<Partial<User>>({})
    const [alertState, setAlertState] = useState<{ message?: string, severity?: AlertColor }>({})
    const [loading, setLoading] = useState(false);

    const updateUser = (currentUser: CognitoUser) => {
        currentUser.getUserAttributes(async (error, result) => {
            if (error) return console.error("Get user attributes error: ", error);

            const attributes: Partial<User> = result?.reduce((acc, attr) => {
                acc[attr.getName()] = attr.getValue();
                return acc;
            }, {} as { [key: string]: string }) || {};

            setUser(old => ({ ...old, ...attributes }))
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
        console.log(user)
        if (user.email && !user.id) setServerUser()
        if (user.id) authAction<User>('user', 'POST', JSON.stringify(user))
    }, [user])

    const setServerUser = async () => {
        const serverUser = await authAction<User>('user', 'GET')
        if (!isError(serverUser)) {
            if (user.firstName) {
                setUser(prev => ({ ...prev, id: serverUser.id }));
            } else {
                setUserAttributes(serverUser)
            }
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
        setAlert('Logout Successful', 'success')
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

    const downloadAction = async (endpoint: string, bytes: number) => {
        if (!sessionUser) return
        await download({ endpoint, sessionUser, bytes });
    };

    const handleAction = <T,>(result: T) => {
        if (isError(result) && result.message) {
            setAlert(result.message, 'warning')
        }

        return result;
    }

    const setAlert = (message: string, colour: AlertColor = 'info') => {
        setAlertState({ message, severity: colour })
        new Promise(resolve => setTimeout(resolve, 4000)).then(() => {
            setAlertState({ message: '', severity: undefined })
        })
    };

    uploadManager.addCallbacks({ authAction })

    return <AuthContext.Provider value={{ user, setUserAttributes, login, logout, authAction, rawAuthAction, setAlert, setLoading, downloadAction }}>
        {children}

        <Backdrop
            sx={{ color: '#fff', zIndex: Number.MAX_SAFE_INTEGER }}
            open={loading}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
        <UniversalAlert
            severity={alertState.severity}
            message={alertState.message}
            close={() => setAlertState({ message: '', severity: undefined })}
        />
    </AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

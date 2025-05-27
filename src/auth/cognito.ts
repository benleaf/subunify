import {
    CognitoUserPool,
    CognitoUserSession,
    CognitoUser,
} from 'amazon-cognito-identity-js';

export const poolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID!,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID!,
};
export const userPool = new CognitoUserPool(poolData);

// Helper to get the “current” user (if any in localStorage)
export function getCurrentUser(): CognitoUser | null {
    return userPool.getCurrentUser();
}

// Wrap getSession in a promise
export function getSession(
    user: CognitoUser
): Promise<CognitoUserSession> {
    return new Promise((res, rej) => {
        user.getSession((err: Error, session: CognitoUserSession | null) => {
            if (err || !session) return rej(err);
            if (!session.isValid()) return rej(new Error('Session invalid'));
            res(session);
        });
    });
}
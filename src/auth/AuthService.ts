import { CognitoUserPool, CognitoUser, AuthenticationDetails, ISignUpResult, CognitoUserSession } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-2_x9KThcYSW",
    ClientId: "78ehhe2nvbnhuc88bvpiki1446",
};

export const UserPool = new CognitoUserPool(poolData);

type SessionUser = { session: CognitoUserSession, cognitoUser: CognitoUser }

export const cognitoRefreshTokens = (cognitoUser: CognitoUser) => {
    cognitoUser.getSession((error: Error | null, session: CognitoUserSession | null) => {
        if (session) {
            cognitoUser.refreshSession(session.getRefreshToken(), (error, _) => {
                if (error) console.error("Refresh session error: ", error)
            })
        } else {
            console.log("Get session error: ", error)
        }
    })
};

export const cognitoSignUp = (email: string, password: string): Promise<ISignUpResult> => {
    return new Promise((resolve, reject) => {
        UserPool.signUp(email, password, [], [], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result!);
            }
        });
    });
};

export const confirmRegistration = (email: string, code: string): Promise<void> => {
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    return new Promise((resolve, reject) => {
        user.confirmRegistration(code, true, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const cognitoResendConfirm = (email: string): Promise<void> => {
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    return new Promise((resolve, reject) => {
        user.resendConfirmationCode((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const cognitoLogin = async (email: string, password: string): Promise<SessionUser> => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: UserPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    const session: CognitoUserSession = await new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
            onSuccess: (session) => {
                resolve(session);
            },
            onFailure: (err) => {
                console.log(err)
                reject(err)
            },
        });
    });

    return { session, cognitoUser }
};

export const cognitoForgotPassword = async (email: string) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: UserPool });

    await new Promise((resolve, reject) => {
        cognitoUser.forgotPassword({
            onSuccess: () => {
                resolve(email);
            },
            onFailure: (err) => {
                console.log(err)
                reject(err)
            }
        });
    });

    return { email, cognitoUser }
};

export const cognitoConfirmSignUp = async (email: string, newPassword: string, code: string) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: UserPool });

    await new Promise((resolve, reject) => {
        cognitoUser.confirmPassword(code, newPassword, {
            onSuccess: () => {
                resolve(newPassword);
            },
            onFailure: (err) => {
                console.log(err)
                reject(err)
            }
        });
    });

    return { newPassword, cognitoUser }
};

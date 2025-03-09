import { CognitoUserPool, CognitoUser, AuthenticationDetails, ISignUpResult } from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "us-east-2_x9KThcYSW",
    ClientId: "78ehhe2nvbnhuc88bvpiki1446",
};


const UserPool = new CognitoUserPool(poolData);

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

export const cognitoConfirmSignUp = (email: string, code: string): Promise<void> => {
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

export const cognitoLogin = (email: string, password: string): Promise<string> => {
    const user = new CognitoUser({ Username: email, Pool: UserPool });
    const authDetails = new AuthenticationDetails({ Username: email, Password: password });

    return new Promise((resolve, reject) => {
        user.authenticateUser(authDetails, {
            onSuccess: (session) => {
                const token = session.getIdToken().getJwtToken();
                localStorage.setItem("token", token);
                resolve(token);
            },
            onFailure: (err) => {
                console.log(err)
                reject(err)
            },
        });
    });
};

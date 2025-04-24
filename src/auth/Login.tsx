import { useContext, useEffect, useState } from "react";
import { Button, Typography, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import { useAuth } from "./AuthContext";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import React from "react";
import GlassText from "@/components/glassmorphism/GlassText";
import { Credentials } from "@/types/Credentials";
import { cognitoResendConfirm } from "./AuthService";
import { StateMachineDispatch } from "@/App";


type Props = {
    goToConformation: (credentials: Credentials) => void
    onLogin?: () => void
}

const Login = ({ goToConformation, onLogin }: Props) => {
    const { login, loginWithGoogle } = useAuth();

    const clientId = '668159150098-p2r666gu4qfcrfo8779uo4eethtu5cq7.apps.googleusercontent.com';

    useEffect(() => {
        (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
        });

        (window as any).google.accounts.id.renderButton(
            document.getElementById('google-signin'),
            { theme: 'outline', size: 'large' }
        );
    }, []);

    const handleCredentialResponse = async (response: any) => {
        await loginWithGoogle(response.credential)
        dispatch({ action: 'popup', data: { colour: 'success', message: 'Login Successful' } })
    };

    const { dispatch } = useContext(StateMachineDispatch)!
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleAccountConfirmation = async () => {
        try {
            dispatch({ action: 'loading', data: true })
            await cognitoResendConfirm(email)
            dispatch({ action: 'loading', data: false })
            goToConformation({ email, password })
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Conformation Successful' } })
        } catch (err: any) {
            dispatch({ action: 'loading', data: false })
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to confirm account' } })
            setMessage(err.message || "Login failed.");
        }
    };

    const handleLogin = async () => {
        try {
            dispatch({ action: 'loading', data: true })
            await login(email, password);
            dispatch({ action: 'loading', data: false })
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Login Successful' } })
            onLogin && onLogin()
        } catch (err: any) {
            if (err.code == "UserNotConfirmedException") {
                handleAccountConfirmation()
                dispatch({ action: 'popup', data: { colour: 'info', message: 'Account confirmation required' } })
            } else {
                console.error(err)
                dispatch({ action: 'loading', data: false })
                dispatch({ action: 'popup', data: { colour: 'error', message: 'Unable to login' } })
                setMessage(err.message || "Login failed.");
            }
        }
    };

    return <>
        <GlassText size="large">Login</GlassText>
        <FormControl variant="standard">
            <InputLabel>Email</InputLabel>
            <Input
                onChange={(e) => setEmail(e.target.value)}
                type='text'
            />
        </FormControl>
        <FormControl variant="standard">
            <InputLabel>Password</InputLabel>
            <Input
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label={
                                showPassword ? 'hide the password' : 'display the password'
                            }
                            onClick={handleClickShowPassword}
                            onMouseDown={e => e.preventDefault()}
                            onMouseUp={e => e.preventDefault()}
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>

        <Button fullWidth variant="outlined" onClick={handleLogin}>Login</Button>
        <div id="google-signin" />
        {message && <Typography color="error">{message}</Typography>}
    </>
};

export default Login;

import { useContext, useState } from "react";
import { Button, Typography, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
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
    const { dispatch } = useContext(StateMachineDispatch)!
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { login } = useAuth();
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
        <FormControl variant="standard">
            <TextField
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                type='text'
            />
        </FormControl>
        <FormControl variant="standard">
            <TextField
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                slotProps={{
                    input: {
                        endAdornment: <InputAdornment position="end">
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
                    },
                }}
            />
        </FormControl>

        <Button fullWidth variant="contained" onClick={handleLogin}>Login</Button>
        {message && <Typography color="error">{message}</Typography>}
    </>
};

export default Login;

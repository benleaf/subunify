import { useState } from "react";
import { Button, Typography, FormControl, IconButton, InputAdornment, TextField } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import React from "react";
import { Credentials } from "@/types/Credentials";
import { cognitoResendConfirm } from "./AuthService";


type Props = {
    goToConformation: (credentials: Credentials) => void
    onLogin?: () => void
}

const Login = ({ goToConformation, onLogin }: Props) => {
    const { setAlert, setLoading } = useAuth()
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleAccountConfirmation = async () => {
        try {
            setLoading(true)
            await cognitoResendConfirm(email)
            setLoading(false)
            goToConformation({ email, password })
            setAlert('Conformation Successful', 'success')
        } catch (err: any) {
            setLoading(false)
            setAlert('Unable to confirm account', 'error')
            setMessage(err.message || "Login failed.");
        }
    };

    const handleLogin = async () => {
        try {
            setLoading(true)
            await login(email, password);
            setLoading(false)
            setAlert('Login Successful', 'success')
            onLogin && onLogin()
        } catch (err: any) {
            if (err.code == "UserNotConfirmedException") {
                handleAccountConfirmation()
                setAlert('Account confirmation required', 'info')
            } else {
                console.error(err)
                setLoading(false)
                setAlert('Unable to login', 'error')
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

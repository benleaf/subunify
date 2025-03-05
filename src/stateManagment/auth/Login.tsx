import { useState } from "react";
import { Button, Typography, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import { useAuth } from "./AuthContext";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import React from "react";
import GlassText from "@/components/glassmorphism/GlassText";
import { Credentials } from "@/types/Credentials";
import { cognitoResendConfirm } from "./AuthService";


type Props = {
    goToConformation: (credentials: Credentials) => void
    onLogin?: () => void
}

const Login = ({ goToConformation, onLogin }: Props) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleAccountConfirmation = async () => {
        try {
            await cognitoResendConfirm(email)
            goToConformation({ email, password })
        } catch (err: any) {
            setMessage(err.message || "Login failed.");
        }
    };

    const handleLogin = async () => {
        try {
            await login(email, password);
            onLogin && onLogin()
        } catch (err: any) {
            if (err.code == "UserNotConfirmedException") {
                handleAccountConfirmation()
            } else {
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
        {message && <Typography color="error">{message}</Typography>}
    </>
};

export default Login;

import { useContext, useState } from "react";
import { Button, Typography, FormControl, Input, InputLabel, IconButton, InputAdornment } from "@mui/material";
import GlassText from "@/components/glassmorphism/GlassText";
import { cognitoConfirmSignUp, cognitoForgotPassword } from './AuthService'
import { StateMachineDispatch } from "@/App";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useAuth } from "./AuthContext";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>();
    const [passwordReset, setPasswordReset] = useState(false);
    const [code, setCode] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { dispatch } = useContext(StateMachineDispatch)!
    const [message, setMessage] = useState("");

    const { login } = useAuth();

    const resetPassword = async () => {
        if (!email) {
            dispatch({ action: 'popup', data: { colour: 'warning', message: 'Please provide an email' } })
            return
        }
        try {
            dispatch({ action: 'loading', data: true })
            await cognitoForgotPassword(email);
            setPasswordReset(true)
            dispatch({ action: 'loading', data: false })
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Login Successful' } })
        } catch (err: any) {
            dispatch({ action: 'loading', data: false })
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Conformation failed' } })
            setMessage(err.message || "Login failed.");
        }
    }

    const confirmSignUp = async () => {
        if (!password) {
            dispatch({ action: 'popup', data: { colour: 'warning', message: 'Please provide an email' } })
            return
        }
        if (!code) {
            dispatch({ action: 'popup', data: { colour: 'warning', message: 'Please provide the verification code' } })
            return
        }
        if (!email) {
            dispatch({ action: 'popup', data: { colour: 'warning', message: 'Please provide an email' } })
            return
        }
        if (password != confirmPassword) {
            dispatch({ action: 'popup', data: { colour: 'warning', message: 'The passwords entered do not match' } })
            return
        }

        try {
            dispatch({ action: 'loading', data: true })
            await cognitoConfirmSignUp(email, password, code);
            await login(email, password);
            dispatch({ action: 'loading', data: false })
            dispatch({ action: 'popup', data: { colour: 'success', message: 'Login Successful' } })
        } catch (err: any) {
            dispatch({ action: 'loading', data: false })
            dispatch({ action: 'popup', data: { colour: 'error', message: 'Conformation failed' } })
            setMessage(err.message || "Login failed.");
        }
    }

    return <>
        <GlassText size="large">Reset Password</GlassText>
        {!passwordReset && <>
            <GlassText size="moderate">Please provide the email to your account:</GlassText>
            <FormControl variant="standard">
                <InputLabel>Email</InputLabel>
                <Input
                    onChange={(e) => setEmail(e.target.value)}
                    type='text'
                />
            </FormControl>
            <Button fullWidth variant="outlined" onClick={resetPassword}>Reset Password</Button>
        </>}
        {passwordReset && <>
            <FormControl variant="standard">
                <InputLabel>Conformation Code</InputLabel>
                <Input
                    onChange={(e) => setCode(e.target.value)}
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
            <FormControl variant="standard">
                <InputLabel>Confirm Password</InputLabel>
                <Input
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
            <Button fullWidth variant="outlined" onClick={confirmSignUp}>Reset Password</Button>
        </>}

        {message && <Typography color="error">{message}</Typography>}
    </>
};

export default ForgotPassword;

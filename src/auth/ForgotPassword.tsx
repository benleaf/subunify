import { useContext, useState } from "react";
import { Button, Typography, FormControl, Input, InputLabel, IconButton, InputAdornment } from "@mui/material";
import GlassText from "@/components/glassmorphism/GlassText";
import { cognitoConfirmSignUp, cognitoForgotPassword } from './AuthService'
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { set } from "lodash";

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>();
    const [passwordReset, setPasswordReset] = useState(false);
    const [code, setCode] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const [message, setMessage] = useState("");

    const { login, setAlert, setLoading } = useAuth();

    const resetPassword = async () => {
        if (!email) {
            setAlert('Please provide an email', 'info')
            return
        }
        try {
            setLoading(true)
            await cognitoForgotPassword(email);
            setPasswordReset(true)
            setLoading(false)
            setAlert('Sending email', 'success')
        } catch (err: any) {
            setLoading(false)
            setAlert('Conformation failed', 'error')
            setMessage(err.message || "Login failed.");
        }
    }

    const confirmSignUp = async () => {
        if (!password) {
            setAlert('Please provide a password', 'info')
            return
        }
        if (!code) {
            setAlert('Please provide the verification code', 'info')
            return
        }
        if (!email) {
            setAlert('Please provide an email', 'info')
            return
        }
        if (password != confirmPassword) {
            setAlert('The passwords entered do not match', 'error')
            return
        }

        try {
            setLoading(true)
            await cognitoConfirmSignUp(email, password, code);
            await login(email, password);
            setLoading(false)
            setAlert('Login Successful', 'success')
        } catch (err: any) {
            setLoading(false)
            setAlert('Conformation failed', 'error')
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

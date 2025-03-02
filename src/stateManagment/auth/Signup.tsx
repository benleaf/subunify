import { useContext, useState } from "react";
import { Button, Typography, FormControl, IconButton, Input, InputAdornment, InputLabel } from "@mui/material";
import { useAuth } from "./AuthContext";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import React from "react";
import GlassText from "@/components/glassmorphism/GlassText";
import { cognitoSignUp } from "./AuthService";
import { Credentials } from "@/types/Credentials";
import { StateMachineDispatch } from "@/components/sheet/SheetTabs";

type Props = {
    goToConformation: (credentials: Credentials) => void
}

const Signup = ({ goToConformation }: Props) => {
    const { dispatch } = useContext(StateMachineDispatch)!
    const [showPassword, setShowPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async () => {
        if (password != confirmPassword) {
            setMessage('Passwords do not match');
            return
        }
        try {
            dispatch({ action: 'loading', data: true })
            await cognitoSignUp(email, password);
            dispatch({ action: 'loading', data: false })
            goToConformation({ email, password })
        } catch (err: any) {
            dispatch({ action: 'loading', data: false })
            setMessage(err.message)
        }
    };

    return <>
        <GlassText size="large">Create Account</GlassText>
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

        <Button fullWidth variant="outlined" onClick={handleSignup}>Create Account</Button>
        {message && <Typography color="error">{message}</Typography>}
    </>
};

export default Signup;

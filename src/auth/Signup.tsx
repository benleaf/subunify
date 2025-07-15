import { useContext, useEffect, useState } from "react";
import { Button, Typography, FormControl, IconButton, InputAdornment, Chip, TextField } from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import React from "react";
import { cognitoSignUp } from "./AuthService";
import { Credentials } from "@/types/Credentials";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router";

type Props = {
    goToConformation: (credentials: Credentials) => void
}

const Signup = ({ goToConformation }: Props) => {
    const { setAlert, setLoading } = useAuth()
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);


    const [searchParams] = useSearchParams();
    const urlEmail = searchParams.get('email')
    useEffect(() => {
        setEmail(urlEmail ?? "")
    }, [urlEmail])

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const passwordLength = password.length >= 8
    const passwordUppercase = /[A-Z]/.test(password)
    const passwordLowercase = /[a-z]/.test(password)
    const passwordNumber = /\d/.test(password)
    const passwordSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const passwordValid = passwordLength && passwordUppercase && passwordLowercase && passwordNumber && passwordSpecial

    const handleSignup = async () => {
        try {
            setLoading(true)
            await cognitoSignUp(email, password);
            setLoading(false)
            setAlert('Account conformation required', 'info')
            goToConformation({ email, password })
        } catch (err: any) {
            setLoading(false)
            setAlert('Unable to create account', 'error')
            setMessage(err.message)
        }
    };

    return <>
        <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type='text'
        />
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
            {password && !passwordLength && <Chip label="8 characters" />}
            {password && !passwordUppercase && <Chip label="Missing uppercase" />}
            {password && !passwordLowercase && <Chip label="Missing lowercase" />}
            {password && !passwordNumber && <Chip label="Missing number" />}
            {password && !passwordSpecial && <Chip label="Missing special character" />}
        </div>
        {passwordValid && <Button fullWidth variant="contained" onClick={handleSignup}>Validate</Button>}
        {message && <Typography color="error">{message}</Typography>}
    </>
};

export default Signup;

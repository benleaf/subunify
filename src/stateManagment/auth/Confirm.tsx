import { useState } from "react";
import { Button, Typography, FormControl, Input, InputLabel } from "@mui/material";
import GlassText from "@/components/glassmorphism/GlassText";
import { cognitoConfirmSignUp } from './AuthService'
import { Credentials } from "@/types/Credentials";
import { useAuth } from "./AuthContext";

type Props = {
    credentials?: Credentials
    onLogin?: () => void
}

const Confirm = ({ credentials, onLogin }: Props) => {
    const { login } = useAuth()
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    const handleConformation = async () => {
        if (!credentials) return
        try {
            await cognitoConfirmSignUp(credentials.email, code);
            await login(credentials.email, credentials.password)
            onLogin && onLogin()
        } catch (err: any) {
            setMessage(err.message || "Login failed.");
        }
    };

    return <>
        <GlassText size="large">Account Confirmation</GlassText>
        <GlassText size="large">We just sent a code to the email you provided, please enter it here:</GlassText>
        <FormControl variant="standard">
            <InputLabel>Conformation Code</InputLabel>
            <Input
                onChange={(e) => setCode(e.target.value)}
                type='text'
            />
        </FormControl>

        <Button fullWidth variant="outlined" onClick={handleConformation}>Submit Code</Button>
        {message && <Typography color="error">{message}</Typography>}
    </>
};

export default Confirm;

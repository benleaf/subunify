import { useContext, useState } from "react";
import { Button, Typography, FormControl, Input, InputLabel } from "@mui/material";
import GlassText from "@/components/glassmorphism/GlassText";
import { confirmRegistration } from './AuthService'
import { Credentials } from "@/types/Credentials";
import { useAuth } from "../contexts/AuthContext";

type Props = {
    credentials?: Credentials
    onLogin?: () => void
}

const Confirm = ({ credentials, onLogin }: Props) => {
    const { login, setLoading, setAlert } = useAuth()
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    const handleConformation = async () => {
        if (!credentials) return
        try {
            setLoading(true)
            await confirmRegistration(credentials.email, code);
            await login(credentials.email, credentials.password)
            setLoading(false)
            setAlert('Login Successful', 'success')
            onLogin && onLogin()
        } catch (err: any) {
            setAlert('Conformation failed', 'error')
            setLoading(false)
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

import { useEffect, useState } from "react";
import { Alert, Button, Divider, Stack } from "@mui/material";
import Login from "./Login";
import Signup from "./Signup";
import Confirm from "./Confirm";
import { Credentials } from "@/types/Credentials";
import ForgotPassword from "./ForgotPassword";
import GlassText from "@/components/glassmorphism/GlassText";
import { CssSizes } from "@/constants/CssSizes";
import { useAuth } from "../contexts/AuthContext";

type Props = {
    defaultPage?: 'login' | 'signup' | 'confirm' | 'forgotPassword' | 'alreadyLoggedIn';
}

const AuthArea = ({ defaultPage = 'signup' }: Props) => {
    const { user, logout } = useAuth()
    const [credentials, setCredentials] = useState<Credentials>()
    const [authPage, setAuthPage] = useState<'login' | 'signup' | 'confirm' | 'forgotPassword' | 'alreadyLoggedIn'>(defaultPage)

    useEffect(() => {
        setAuthPage(user.email_verified ? 'alreadyLoggedIn' : defaultPage)
    }, [user])


    const goToConformation = (userCredentials: Credentials) => {
        setCredentials(userCredentials)
        setAuthPage('confirm')
    }

    return <>
        <Stack spacing={1}>
            {authPage == 'login' && <>
                <Login goToConformation={(credentials: Credentials) => goToConformation(credentials)} />
                <Stack direction="row" spacing={1} justifyContent="center">
                    <Button variant="outlined" fullWidth onClick={() => setAuthPage('forgotPassword')}>Forgot Password</Button>
                    <Button variant="outlined" fullWidth onClick={() => setAuthPage('signup')}>Create Account</Button>
                </Stack>
            </>}
            {authPage == 'forgotPassword' && <>
                <ForgotPassword />
                <Button onClick={() => setAuthPage('signup')}>Create Account</Button>
            </>}
            {authPage == 'signup' && <>
                <Signup goToConformation={(credentials: Credentials) => goToConformation(credentials)} />
            </>}
            {authPage == 'confirm' && <>
                <Confirm credentials={credentials} />
            </>}
            {authPage == 'alreadyLoggedIn' && <>
                <Alert severity="success">Already logged in!</Alert>
                <Button onClick={logout}>Logout</Button>
            </>}
        </Stack>
        <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
        <GlassText size="small" >
            By signing up, you agree to our <a href="/terms-of-service">Terms of Service</a> and acknowledge our <a href="/privacy-policy">Privacy Policy</a>.
            If you have an account, <a href="#" onClick={() => setAuthPage('login')}>Login</a>.
        </GlassText>
    </>
};

export default AuthArea;

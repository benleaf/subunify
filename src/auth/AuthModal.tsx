import { useEffect, useState } from "react";
import { Button, Divider, Stack } from "@mui/material";
import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import Login from "./Login";
import Signup from "./Signup";
import Confirm from "./Confirm";
import { Credentials } from "@/types/Credentials";
import ForgotPassword from "./ForgotPassword";
import GlassText from "@/components/glassmorphism/GlassText";
import { CssSizes } from "@/constants/CssSizes";

type Props = {
    overrideState?: boolean
    hideButton?: boolean
    onLogin?: () => void
    onAccountCreationCompleate?: () => void
    onClose?: () => void
}

const AuthModal = ({ overrideState: overideState, onLogin, onAccountCreationCompleate, onClose, hideButton = false }: Props) => {
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [credentials, setCredentials] = useState<Credentials>()
    const [authPage, setAuthPage] = useState<'login' | 'signup' | 'confirm' | 'forgotPassword'>('login')

    useEffect(() => {
        if (overideState !== undefined) setAuthModalOpen(overideState)
    }, [overideState])

    const goToConformation = (userCredentials: Credentials) => {
        setCredentials(userCredentials)
        setAuthPage('confirm')
    }

    const defaultClose = () => {
        setAuthModalOpen(false)
    }

    return <>
        {!hideButton && <Button onClick={() => setAuthModalOpen(true)}>Login</Button>}
        <BaseModal state={authModalOpen ? 'open' : 'closed'} close={onClose ?? defaultClose}>
            <GlassSpace size="large">
                <Stack spacing={1}>
                    {authPage == 'login' && <>
                        <Login goToConformation={(credentials: Credentials) => goToConformation(credentials)} onLogin={onLogin} />
                        <Button onClick={() => setAuthPage('forgotPassword')}>Forgot Password</Button>
                        <Button onClick={() => setAuthPage('signup')}>Create Account</Button>
                    </>}
                    {authPage == 'forgotPassword' && <>
                        <ForgotPassword />
                        <Button onClick={() => setAuthPage('login')}>Login</Button>
                        <Button onClick={() => setAuthPage('signup')}>Create Account</Button>
                    </>}
                    {authPage == 'signup' && <>
                        <Signup goToConformation={(credentials: Credentials) => goToConformation(credentials)} />
                        <Button onClick={() => setAuthPage('login')}>Login</Button>
                    </>}
                    {authPage == 'confirm' && <>
                        <Confirm credentials={credentials} onLogin={onAccountCreationCompleate} />
                        <Button onClick={() => setAuthPage('login')}>Login</Button>
                    </>}
                </Stack>
                <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                <GlassText size="small" >
                    By signing up, you agree to our <a href="/terms-of-service">Terms of Service</a> and acknowledge our <a href="/privacy-policy">Privacy Policy</a>.
                </GlassText>
            </GlassSpace>
        </BaseModal>
    </>
};

export default AuthModal;

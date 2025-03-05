import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import BaseModal from "@/components/modal/BaseModal";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import Login from "./Login";
import Signup from "./Signup";
import Confirm from "./Confirm";
import { Credentials } from "@/types/Credentials";

type Props = {
    overideState?: boolean
    hideButton?: boolean
    onLogin?: () => void
    onAccountCreationCompleate?: () => void
    onClose?: () => void
}

const AuthModal = ({ overideState, onLogin, onAccountCreationCompleate, onClose, hideButton = false }: Props) => {
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const [credentials, setCredentials] = useState<Credentials>()
    const [authPage, setAuthPage] = useState<'login' | 'signup' | 'confirm'>('login')

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
                <Stack spacing={2}>
                    {authPage == 'login' && <>
                        <Login goToConformation={(credentials: Credentials) => goToConformation(credentials)} onLogin={onLogin} />
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
            </GlassSpace>
        </BaseModal>
    </>
};

export default AuthModal;

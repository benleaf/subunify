import Confirm from "@/auth/Confirm"
import ForgotPassword from "@/auth/ForgotPassword"
import Signup from "@/auth/Signup"
import { CssSizes } from "@/constants/CssSizes"
import { Credentials } from "@/types/Credentials"
import { Stack, Button, Divider } from "@mui/material"
import { useEffect, useState } from "react"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import Login from "@/auth/Login"
import PaymentModal from "../modal/PaymentModal"
import { TaggedFile } from "@/pages/FileUpload"
import { useAuth } from "@/auth/AuthContext"
import { isError } from "@/api/isError"
import { User } from "@/types/User"

type Props = {
    done: () => void
    taggedFiles: TaggedFile[]
}

const AccountSetup = ({ done, taggedFiles }: Props) => {
    const { user, authAction } = useAuth()
    const [credentials, setCredentials] = useState<Credentials>()
    const [authPage, setAuthPage] = useState<'login' | 'signup' | 'confirm' | 'forgotPassword' | 'payment'>('signup')

    const goToConformation = (userCredentials: Credentials) => {
        setCredentials(userCredentials)
        setAuthPage('confirm')
    }

    const finishIfSubscribed = async () => {
        const userResult = await authAction<User>(`user`, "GET")
        if ((!isError(userResult) && userResult?.stripeSubscriptionId)) {
            done()
        }
    }

    useEffect(() => {
        if (authPage == 'payment') finishIfSubscribed()
    }, [authPage])

    useEffect(() => {
        if (!user) {
            setAuthPage('login')
        } else if (user?.email_verified) {
            setAuthPage('payment')
        }
    }, [user])

    return <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <GlassSpace size="large" style={{ width: 'min(90%, 40em)' }}>
            <Stack spacing={1}>
                {authPage == 'login' && <>
                    <Login goToConformation={(credentials: Credentials) => goToConformation(credentials)} onLogin={() => setAuthPage('payment')} />
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
                    <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                    <GlassText size="small" >
                        By signing up, you agree to our <a href="/terms-of-service">Terms of Service</a> and acknowledge our <a href="/privacy-policy">Privacy Policy</a>.
                    </GlassText>
                </>}
                {authPage == 'confirm' && <>
                    <Confirm credentials={credentials} onLogin={() => setAuthPage('payment')} />
                    <Button onClick={() => setAuthPage('login')}>Login</Button>
                </>}
                {authPage == 'payment' && <>
                    <PaymentModal
                        taggedFiles={taggedFiles}
                        state='open'
                        onComplete={done}
                    />
                </>}
            </Stack>
        </GlassSpace>
    </div>
}

export default AccountSetup
import { StateMachineDispatch } from "@/App"
import { useAuth } from "@/auth/AuthContext"
import GlassSpace from "@/components/glassmorphism/GlassSpace"
import Account from "@/components/onboarding/Account"
import Name from "@/components/onboarding/Name"
import { CssSizes } from "@/constants/CssSizes"
import { useSize } from "@/hooks/useSize"
import { Button } from "@mui/material"
import { useContext, useState } from "react"



const Onboarding = () => {
    const { user } = useAuth()
    const [step, setStep] = useState(0)
    const { height, width } = useSize()

    const stepInfoValid = [
        user.firstName && user.lastName,
        user.email && user.emailVerified, // Email
        true, // Password
        true, // Profile Picture
        true, // Interests
        true, // Preferences
    ]

    const nextPanel = () => {
        if (stepInfoValid[step]) {
            setStep(old => ++old)
        }
    }

    return <div style={{ height, width, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
            width: 'min(100%, 700px)',
            height: 'min(100vh, 700px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: CssSizes.small
        }}>
            <div>
                {step == 0 && <Name />}
                {step == 1 && <Account />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: CssSizes.hairpin, justifyContent: 'space-between' }}>
                {step > 0 && <Button variant="outlined" onClick={() => setStep(old => --old)}>Back</Button>}
                {step == 0 && <GlassSpace size='hairpin' />}
                {stepInfoValid[step] && <Button variant="outlined" onClick={nextPanel}>Continue</Button>}
            </div>
        </div>
    </div>
}

export default Onboarding
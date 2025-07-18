import { useAuth } from "@/contexts/AuthContext"
import GlassSpace from "@/components/glassmorphism/GlassSpace"
import Account from "@/components/flows/onboarding/Account"
import Attributes from "@/components/flows/onboarding/Attributes"
import Collaborators from "@/components/flows/onboarding/Collaborators"
import Name from "@/components/flows/onboarding/Name"
import NextSteps from "@/components/flows/onboarding/NextSteps"
import { CssSizes } from "@/constants/CssSizes"
import { useSize } from "@/hooks/useSize"
import { Button } from "@mui/material"
import { useState } from "react"
import DoubleExposureGraphic from '@/images/DoubleExposureGraphic.png'
import { User } from "@/types/User"
import { isError } from "@/api/isError"
import { useNavigate } from "react-router"
import Welcome from "@/components/flows/onboarding/Welcome"

const Onboarding = () => {
    const { user, authAction, setUserAttributes } = useAuth()
    const navigate = useNavigate()
    const [step, setStep] = useState(0)
    const { height, width } = useSize()

    const stepInfoValid = [
        true,
        user.firstName && user.lastName,
        user.email && user.email_verified,
        user.tagLine,
        true,
        false,
    ]

    const nextPanel = () => {
        if (step == 3) navigate('/dashboard')
        if (stepInfoValid[step]) setStep(old => ++old)

        authAction<User>('user', 'POST', JSON.stringify(user))
            .then(user => !isError(user) && setUserAttributes(user))
    }

    return <div style={{ height, width, display: 'flex', alignItems: 'center' }}>
        {width > 1200 && <img src={DoubleExposureGraphic} height={height} />}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{
                width: 'min(100%, 700px)',
                height: 'min(100vh, 700px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: CssSizes.small
            }}>
                <div>
                    {step == 0 && <Welcome />}
                    {step == 1 && <Name />}
                    {step == 2 && <Account />}
                    {step == 3 && <Attributes />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginTop: CssSizes.hairpin, justifyContent: 'space-between' }}>
                    {step > 0 && <Button variant="outlined" onClick={() => setStep(old => --old)}>Back</Button>}
                    {step == 0 && <GlassSpace size='hairpin' />}
                    {stepInfoValid[step] && <Button variant="outlined" onClick={nextPanel}>Continue</Button>}
                </div>
            </div>
        </div>
    </div>
}

export default Onboarding
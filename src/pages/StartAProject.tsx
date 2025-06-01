import { useAuth } from "@/contexts/AuthContext"
import { CssSizes } from "@/constants/CssSizes"
import { useSize } from "@/hooks/useSize"
import { Button } from "@mui/material"
import { useState } from "react"
import DoubleExposureGraphic from '@/images/DoubleExposureGraphic.png'
import ProjectDetails from "@/components/flows/startProject/ProjectDetails"
import Collaborators from "@/components/flows/startProject/Collaborators"
import SelectPackage from "@/components/flows/startProject/SelectPackage"
import Payment from "@/components/flows/startProject/Payment"
import { CreateProjectProvider, useCreateProject } from "@/contexts/CreateProjectContext"
import WhatIsAProject from "@/components/flows/startProject/WhatIsAProject"
import HowAProjectWorks from "@/components/flows/startProject/HowAProjectWorks"
import { Project } from "@/types/server/ProjectResult"
import { isError } from "@/api/isError"

const StartAProjectWithContext = () => {
    const { user, authAction } = useAuth()
    const { project, updateProject } = useCreateProject()

    const [step, setStep] = useState(0)
    const { height, width } = useSize()

    const stepInfoValid = [
        true,
        project.name && project.codeName,
        true,
        true,
        true,
        false,
    ]

    const nextPanel = () => {
        if (stepInfoValid[step]) {
            setStep(old => ++old)
        }

        if (step == 1) {
            const action = project.id ? 'PATCH' : 'POST'
            authAction<Partial<Project>>('project', action, JSON.stringify(project))
                .then(project => {
                    if (!isError(project)) {
                        updateProject(project)
                        console.log(project)
                    }
                })
        }
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
                    {step == 0 && <WhatIsAProject />}
                    {step == 1 && <ProjectDetails />}
                    {step == 2 && <Collaborators />}
                    {step == 3 && <HowAProjectWorks />}
                    {step == 4 && <SelectPackage />}
                    {step == 5 && <Payment />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', marginTop: CssSizes.hairpin, justifyContent: 'space-between' }}>
                    {step > 0 && <Button variant="outlined" onClick={() => setStep(old => --old)}>Back</Button>}
                    {step == 0 && user.email_verified && <Button variant="outlined" href="/dashboard">Dashboard</Button>}
                    {stepInfoValid[step] && <Button variant="outlined" onClick={nextPanel}>Continue</Button>}
                </div>
            </div>
        </div>
    </div>
}

const StartAProject = () => {
    return <CreateProjectProvider>
        <StartAProjectWithContext />
    </CreateProjectProvider>
}

export default StartAProject
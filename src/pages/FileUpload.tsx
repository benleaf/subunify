import { Step, StepLabel, Stepper } from "@mui/material";
import { useState } from "react";
import { CloudUpload } from "@mui/icons-material";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { useSize } from "@/hooks/useSize";
import { ScreenWidths } from "@/constants/ScreenWidths";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import GlassIconText from "@/components/glassmorphism/GlassIconText";
import AddFile from "@/components/upload/AddFile";
import FileTagger from "@/components/upload/FileTagger";
import AccountSetup from "@/components/upload/AccountSetup";
import Uploader from "@/components/upload/Uploader";
import TutorialModal from "@/components/modal/TutorialModal"
import GlassText from "@/components/glassmorphism/GlassText";
import FileUploadNebula from "@/components/graphics/FileUploadNebula";

export type TaggedFile = {
    file: File,
    tags: string[],
    thumbnail?: string | 'NO_PREVIEW_AVAILABLE'
}

const FileUpload = () => {
    const { width } = useSize()
    const [taggedFiles, setTaggedFiles] = useState<TaggedFile[]>([])
    const [step, setStep] = useState(0)

    return <DashboardLayout>
        <GlassIconText size="big" icon={<CloudUpload color="primary" />}>Upload To Your Nebula</GlassIconText>
        <GlassSpace size='tiny'>
            <Stepper activeStep={step}>
                <Step>
                    <StepLabel>{width > ScreenWidths.Mobile ? 'Select Files For Upload' : 'Add'}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Tag {width > ScreenWidths.Mobile && 'Files For Archive'}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Account {width > ScreenWidths.Mobile && 'Setup & Subscription'}</StepLabel>
                </Step>
                <Step>
                    <StepLabel>Upload {width > ScreenWidths.Mobile && 'Files To Nebula'}</StepLabel>
                </Step>
            </Stepper>
        </GlassSpace>
        {step == 0 && <AddFile files={taggedFiles} setFiles={setTaggedFiles} done={() => setStep(1)} />}
        {step == 1 && <FileTagger taggedFiles={taggedFiles} setFiles={setTaggedFiles} done={() => setStep(2)} />}
        {step == 2 && <AccountSetup done={() => setStep(3)} taggedFiles={taggedFiles} />}
        {step == 3 && <Uploader taggedFiles={taggedFiles} />}
        <TutorialModal
            modalName="file-upload-tutorial"
            children={
                <>
                    <GlassText size='large'>Simply Add, Tag, Signup and Upload</GlassText>
                    <GlassText size='moderate'>The first step is adding the files you want to upload!</GlassText>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FileUploadNebula points={500} width={Math.min(width, 500) * 0.5} />
                    </div>
                </>
            }
        />
    </DashboardLayout>
}

export default FileUpload
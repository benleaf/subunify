import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, Divider, Stack } from "@mui/material";
import FloatingGlassCircle from "@/components/glassmorphism/FloatingGlassCircle";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import DynamicStack from "@/components/glassmorphism/DynamicStack";
import GlassIconText from "@/components/glassmorphism/GlassIconText";
import { Article, Backup, BallotOutlined, BorderTop, CreateNewFolder, Dashboard, Note, Square } from "@mui/icons-material";

const LandingPage = () => {
    return <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GlassSpace size='modrate'>
                <GlassText size="gigantic" style={{ letterSpacing: '0.15em' }}>ENTERPRISE DASHBOARDS...</GlassText>
            </GlassSpace>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DynamicStack>
                <FloatingGlassCircle offset={{ bottom: '-10em', left: '-4em' }} size="medium" />
                <GlassCard marginSize="small">
                    <div style={{ maxWidth: 400, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <GlassSpace size={"tiny"}>
                            <GlassText size="large">CREATED FROM EXCEL:</GlassText>
                            <GlassText size="modrate">
                                <Stack spacing={2} margin='1em'>
                                    <GlassIconText size={"modrate"} icon={<Article color="primary" fontSize="medium" />}>
                                        Use any excel file that you want to collect data from
                                    </GlassIconText>
                                    <GlassIconText size={"modrate"} icon={<BorderTop color="primary" fontSize="medium" />}>
                                        Select header rows and columns along with corresponding records,
                                    </GlassIconText>
                                    <GlassIconText size={"modrate"} icon={<Backup color="primary" fontSize="medium" />}>
                                        Once everything is selected deploy to a secure server
                                    </GlassIconText>
                                    <GlassIconText size={"modrate"} icon={<BallotOutlined color="primary" fontSize="medium" />}>
                                        Enjoy quick and painless data access, creation and deletion using the power of web forms
                                    </GlassIconText>
                                </Stack>
                            </GlassText>
                        </GlassSpace>
                        <Button startIcon={<CreateNewFolder />} href="/excel-importer" variant="contained" style={{ color: 'white' }}>Create From Excel</Button>
                    </div>
                </GlassCard>
                <Divider orientation="vertical" flexItem><GlassText size="modrate">OR</GlassText></Divider>
                <GlassCard marginSize="small">
                    <div style={{ maxWidth: 400, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <GlassSpace size={"tiny"}>
                            <GlassText size="large">CREATED FROM SCRATCH:</GlassText><GlassText size="modrate">
                                <Stack spacing={2} margin='1em'>
                                    <GlassIconText size={"modrate"} icon={<BallotOutlined color="primary" fontSize="medium" />}>
                                        Start with a blank dashboard and create tables manually
                                    </GlassIconText>
                                    <GlassIconText size={"modrate"} icon={<Backup color="primary" fontSize="medium" />}>
                                        If at a future point you wish to upload an excel file with data, you can do this at any point
                                    </GlassIconText>
                                </Stack>
                            </GlassText>
                        </GlassSpace>
                        <Button startIcon={<Dashboard />} href="/dashboard" variant="contained" style={{ color: 'white' }}>Create Dashboard</Button>
                    </div>
                </GlassCard>
                <FloatingGlassCircle offset={{ top: '-2em', right: '-2em' }} size="small" />
            </DynamicStack >
        </div>

    </div >
}

export default LandingPage
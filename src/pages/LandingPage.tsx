import GlassText from "@/components/glassmorphism/GlassText";
import GlassCard from "@/components/glassmorphism/GlassCard";
import { Button, Divider } from "@mui/material";
import FloatingGlassCircle from "@/components/glassmorphism/FloatingGlassCircle";
import GlassSpace from "@/components/glassmorphism/GlassSpace";
import DynamicStack from "@/components/glassmorphism/DynamicStack";

const LandingPage = () => {
    return <div>
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '3em' }}>
            <GlassSpace size='modrate'>
                <GlassText size="gigantic" style={{ letterSpacing: '0.15em' }}>ENTERPRISE DASHBOARDS...</GlassText>
            </GlassSpace>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <DynamicStack>
                <FloatingGlassCircle offset={{ bottom: '-8em', left: '-2em' }} size="medium" />
                <GlassCard>
                    <div style={{ width: 400, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <GlassSpace size={"tiny"}>
                            <GlassText size="large">CREATED FROM EXCEL:</GlassText>
                            <GlassText size="modrate">
                                <ul>
                                    <li>
                                        Use any excel file that you want to collect data from
                                    </li>
                                    <li>
                                        Select header rows and columns along with corresponding records,
                                    </li>
                                    <li>
                                        Once everything is selected deploy to a secure server
                                    </li>
                                    <li>
                                        Enjoy quick and painless data access, creation and deletion using the power of web forms
                                    </li>
                                </ul>
                            </GlassText>
                        </GlassSpace>
                        <Button href="/excel-importer" variant="contained" style={{ color: 'white' }}>Create From Excel</Button>
                    </div>
                </GlassCard>
                <Divider orientation="vertical" flexItem><GlassText size="modrate">OR</GlassText></Divider>
                <GlassCard>
                    <div style={{ width: 400, height: 500, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <GlassSpace size={"tiny"}>
                            <GlassText size="large">CREATED FROM SCRATCH:</GlassText><GlassText size="modrate">
                                <ul>
                                    <li>
                                        Start with a blank dashboard and create tables manually
                                    </li>
                                    <li>
                                        If at a future point you wish to upload an excel file with data, you can do this at any point
                                    </li>
                                </ul>
                            </GlassText>
                        </GlassSpace>
                        <Button href="/dashboard" variant="contained" style={{ color: 'white' }}>Create Dashboard</Button>
                    </div>
                </GlassCard>
                <FloatingGlassCircle offset={{ top: '-2em', right: '-2em' }} size="small" />
            </DynamicStack >
        </div>

    </div >
}

export default LandingPage
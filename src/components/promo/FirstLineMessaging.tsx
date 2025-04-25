import { ScreenWidths } from "@/constants/ScreenWidths"
import { Divider, Button, Stack } from "@mui/material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { CssSizes } from "@/constants/CssSizes"
import { Folder, ShoppingCartCheckoutSharp } from "@mui/icons-material"
import GlassIconText from "../glassmorphism/GlassIconText"
import { gsap } from 'gsap';
import { useRef, useLayoutEffect } from "react"

const PayAsYouGoTitle = () => <GlassIconText size={"big"} icon={<ShoppingCartCheckoutSharp style={{ fontSize: '2rem' }} color="primary" />}>
    Pay As You Go
</GlassIconText>

const PayAsYouGoText = () => <GlassText size="moderate">
    Only pay for the data you use, no hidden fees, no cancellation fees no limits on data size.
</GlassText>

const FileAndForgetTitle = () => <GlassIconText size={"big"} icon={<Folder style={{ fontSize: '2rem' }} color="primary" />}>
    File And Forget
</GlassIconText>

const FileAndForgetText = () => <GlassText size="moderate">
    Data stored on encrypted Amazon servers with data redundancy protecting you from file corruption. <b>99.999999999% durability</b>.
</GlassText>

const CoreMessage = () => <GlassCard marginSize="small" paddingSize="small" flex={3}>
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: "100%", textAlign: 'center' }}>
        <GlassSpace size={"moderate"} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
            <GlassText size="large">
                12 Hour File Extraction
            </GlassText>
            <Divider orientation="horizontal" flexItem><GlassText size="small">ENABLES</GlassText></Divider>
            <GlassText size="big">
                $1.50 per TB per Month*
            </GlassText>
        </GlassSpace>
        <Button variant="contained" href="/file-upload">
            Archive A File
        </Button>
    </div>
    <GlassText size="moderate" style={{ alignSelf: 'end' }}>
        *Additional fees apply for upload and extraction
    </GlassText>
</GlassCard>

const Desktop = () => {
    const container = useRef<HTMLDivElement>(null);
    const topText = useRef<HTMLDivElement>(null);
    const middleText = useRef<HTMLDivElement>(null);
    const bottomText = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            });

            tl.to(topText.current, { y: -300, opacity: 0 }, 0.5);
            tl.to(middleText.current, { y: -200, opacity: 0 }, 0.5);
            tl.to(bottomText.current, { y: -400, opacity: 0 }, 0.5);
        });

        return () => ctx.revert();
    }, []);

    return <Stack direction="row" spacing={2} style={{ width: '100%', height: '100%' }} ref={container}>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} ref={topText}>
            <PayAsYouGoTitle />
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <PayAsYouGoText />
                </div>
            </GlassCard>
        </div>
        <div ref={middleText} style={{ flex: 3 }}>
            <CoreMessage />
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} ref={bottomText}>
            <FileAndForgetTitle />
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <FileAndForgetText />
                </div>
            </GlassCard>
        </div>
    </Stack>
}

const Mobile = () => {
    const container = useRef<HTMLDivElement>(null);
    const topText = useRef<HTMLDivElement>(null);
    const middleText = useRef<HTMLDivElement>(null);
    const bottomText = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const timelineConfig = (ref: HTMLDivElement) => ({
            scrollTrigger: {
                trigger: ref,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        })
        const ctx = gsap.context(() => {
            const topTextTimeLine = gsap.timeline(timelineConfig(topText.current!));
            const middleTextTimeLine = gsap.timeline(timelineConfig(middleText.current!));
            const bottomTextTimeLine = gsap.timeline(timelineConfig(bottomText.current!));

            topTextTimeLine.to(topText.current, { y: -100, opacity: 0 }, 0.5);
            middleTextTimeLine.to(middleText.current, { y: -100, opacity: 0 }, 0.5);
            bottomTextTimeLine.to(bottomText.current, { y: -100, opacity: 0 }, 0.5);
        });

        return () => ctx.revert();
    }, []);
    return <Stack direction="column" spacing={2} style={{ width: '100%', height: '100%' }}>
        <div ref={topText}>
            <CoreMessage />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} ref={middleText}>
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <PayAsYouGoTitle />
                <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                <div style={{ height: "100%", display: 'flex' }}>
                    <PayAsYouGoText />
                </div>
            </GlassCard>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} ref={bottomText}>
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <FileAndForgetTitle />
                <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                <div style={{ height: "100%", display: 'flex' }}>
                    <FileAndForgetText />
                </div>
            </GlassCard>
        </div>
        <div ref={container} />
    </Stack>
}


const FirstLineMessaging = () => {
    const { width } = useSize()
    return width <= ScreenWidths.Mobile ? <Mobile /> : <Desktop />
}

export default FirstLineMessaging
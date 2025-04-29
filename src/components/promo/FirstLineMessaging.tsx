import { ScreenWidths } from "@/constants/ScreenWidths"
import { Divider, Button, Stack } from "@mui/material"
import GlassCard from "../glassmorphism/GlassCard"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { CssSizes } from "@/constants/CssSizes"
import { Folder, List, ShoppingCartCheckoutSharp } from "@mui/icons-material"
import GlassIconText from "../glassmorphism/GlassIconText"
import { gsap } from 'gsap';
import { useRef, useLayoutEffect } from "react"

const PayAsYouGoTitle = () => <GlassIconText size={"big"} icon={<ShoppingCartCheckoutSharp style={{ fontSize: '2rem' }} color="primary" />}>
    <b>Pay As You Go</b>
</GlassIconText>

const PayAsYouGoText = () => <GlassText size="large" style={{ padding: '1em' }}>
    Only pay for the files archived and the actions you perform. Billed monthly.
</GlassText>

const NeatAndTidyTitle = () => <GlassIconText size={"big"} icon={<List style={{ fontSize: '2rem' }} color="primary" />}>
    <b>Neat and tidy</b>
</GlassIconText>

const NeatAndTidyText = () => <GlassText size="large" style={{ padding: '1em' }}>
    Maintain order like a pro, use tags and descriptions to keep your files organized.
</GlassText>

const FileAndForgetTitle = () => <GlassIconText size={"big"} icon={<Folder style={{ fontSize: '2rem' }} color="primary" />}>
    <b>Safe And Sound</b>
</GlassIconText>

const FileAndForgetText = () => <GlassText size="large" style={{ padding: '1em' }}>
    Files stored on encrypted Amazon servers that boast world class protection. <b>99.999999999% durability</b>.
</GlassText>

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

            tl.to(topText.current, { y: -200, opacity: 0 }, 0.5);
            tl.to(middleText.current, { y: -200, opacity: 0 }, 0.5);
            tl.to(bottomText.current, { y: -200, opacity: 0 }, 0.5);
        });

        return () => ctx.revert();
    }, []);

    return <Stack direction="row" spacing={2} style={{ width: '100%', height: '100%' }} ref={container}>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: 300 }} ref={topText}>
            <FileAndForgetTitle />
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <FileAndForgetText />
                </div>
            </GlassCard>
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} ref={middleText}>
            <NeatAndTidyTitle />
            <GlassCard marginSize="small" flex={1}>
                <GlassCard flex={1}>
                    <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <NeatAndTidyText />
                    </div>
                </GlassCard>
            </GlassCard>
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }} ref={bottomText}>
            <PayAsYouGoTitle />
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <div style={{ height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <PayAsYouGoText />
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} ref={topText}>
            <GlassCard marginSize="small" paddingSize="small" flex={1}>
                <FileAndForgetTitle />
                <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                <div style={{ height: "100%", display: 'flex' }}>
                    <FileAndForgetText />
                </div>
            </GlassCard>
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
                <NeatAndTidyTitle />
                <Divider orientation="horizontal" style={{ marginBlock: CssSizes.moderate }}></Divider>
                <div style={{ height: "100%", display: 'flex' }}>
                    <NeatAndTidyText />
                </div>
            </GlassCard>
        </div>
        {/* <div ref={topText}>
            <CoreMessage />
        </div> */}
        <div ref={container} />
    </Stack>
}


const FirstLineMessaging = () => {
    const { width } = useSize()
    return width <= ScreenWidths.Mobile ? <Mobile /> : <Desktop />
}

export default FirstLineMessaging
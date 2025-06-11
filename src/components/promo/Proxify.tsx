import { ScreenWidths } from "@/constants/ScreenWidths"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { useRef, useLayoutEffect, RefObject, useEffect, useMemo, useState } from "react"
import { gsap } from 'gsap';
import FileViewer from "../widgets/FileViewer"
import { Stack } from "@mui/material"
import { B, C, D, E, H } from '@/images/stock'

export function useOnScreen(ref: RefObject<HTMLElement>) {
    const [isIntersecting, setIntersecting] = useState(false)

    const observer = useMemo(() => new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
    ), [ref])


    useEffect(() => {
        observer.observe(ref.current!)
        return () => observer.disconnect()
    }, [])

    return isIntersecting
}
const gold = 1.61803398875

const Previews = () => <div style={{ display: 'flex', flexDirection: 'column' }}>
    <img style={{ padding: 10 }} src={H} alt="Preview 1" width={`${100}%`} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <img style={{ padding: 10 }} src={H} alt="Preview 1" width={`${100 / gold}%`} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <img style={{ padding: 10 }} src={H} alt="Preview 1" width={`100%`} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                <img style={{ padding: 10 }} src={H} alt="Preview 1" width={`${100 / (gold)}%`} />
            </div>
        </div>
    </div>
</div>

const Proxify = () => {
    const { width } = useSize()

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

            tl.to(topText.current, { y: -200 }, 0.5);
            tl.to(middleText.current, { y: -150 }, 0.5);
            tl.to(bottomText.current, { y: -100 }, 0.5);
        });

        return () => ctx.revert();
    }, []);

    return <>
        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <div style={{ display: 'flex', height: '50vh', alignItems: 'center', maxWidth: 750 }} ref={container}>
                <GlassSpace size='moderate' style={{ flex: 1 }}>
                    <div ref={middleText} style={{ position: 'relative' }}>
                        <GlassText
                            size="gigantic"
                            style={{ lineHeight: '1em', fontWeight: 'bold' }}
                            color="primary"
                        >Proxify</GlassText>
                    </div>
                    <div ref={bottomText}>
                        <GlassText
                            size="big"
                            style={{ letterSpacing: '0.15em', fontWeight: 'lighter' }}
                            color="primary"
                        >We automatically transcode uploaded .mov files so you dont have to</GlassText>
                    </div>
                    <div style={{ padding: '0.5em' }} />
                    {width <= ScreenWidths.Tablet && <>
                        <Previews />
                    </>}
                </GlassSpace>
            </div>
            {width > ScreenWidths.Tablet && <div style={{ display: 'flex', height: '70vh', alignItems: 'center', maxWidth: 550 }}>
                <Previews />
            </div>}
        </div>
    </>
}

export default Proxify
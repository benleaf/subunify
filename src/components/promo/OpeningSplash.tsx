import { ScreenWidths } from "@/constants/ScreenWidths"
import { Divider, IconButton } from "@mui/material"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { ArrowDownward } from "@mui/icons-material"
import { useRef, ElementRef, useLayoutEffect, RefObject, useEffect, useMemo, useState } from "react"
import BlackHoleCanvas from "../graphics/BlackHoleCanvas"
import { gsap } from 'gsap';

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

const OpeningSplash = () => {
    const { width } = useSize()
    const myRef = useRef<ElementRef<'div'>>(null)
    const executeScroll = () => myRef.current!.scrollIntoView({ behavior: 'smooth' })

    const container = useRef<HTMLDivElement>(null);
    const topText = useRef<HTMLDivElement>(null);
    const middleText = useRef<HTMLDivElement>(null);
    const bottomText = useRef<HTMLDivElement>(null);

    const isIntersecting = useOnScreen(myRef)

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
        {width < ScreenWidths.Mobile && <div style={{ height: '25vh' }} />}
        <div style={{ height: '10vh' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', height: width > ScreenWidths.Mobile ? '70vh' : '20vh', alignItems: 'center', width: '80vh' }} ref={container}>
                <GlassSpace size='moderate' style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }} ref={topText}>
                        <GlassText
                            size="large"
                            style={{ letterSpacing: '0.15em' }}
                            color="primaryLight"
                        >THE SUBUNIFY</GlassText>
                        <Divider style={{ flex: 1 }} />
                    </div>
                    <div ref={middleText}>
                        <GlassText
                            size="gigantic"
                            style={{ lineHeight: '10vw', fontWeight: 'normal' }}
                            color="primaryLight"
                        >SLOW STORE</GlassText>
                    </div>
                    {width > ScreenWidths.Mobile && <div ref={myRef} />}

                    <div style={{ display: 'flex', alignItems: 'center' }} ref={bottomText}>
                        <GlassText
                            size="moderate"
                            style={{ letterSpacing: '0.15em', fontWeight: 'lighter' }}
                            color="primaryLight"
                        >FILE AND FORGET ARCHIVING</GlassText>
                        <Divider style={{ flex: 1 }} />
                    </div>
                    {width <= ScreenWidths.Mobile && <div>
                        <div style={{ padding: '0.5em' }} />
                        <BlackHoleCanvas width={Math.min(width * 0.95 - 70, 600)} />
                    </div>}
                </GlassSpace>
            </div>
            {width > ScreenWidths.Mobile && <>
                <div style={{ display: 'flex', height: '70vh', alignItems: 'center', width: '50%' }}>
                    <BlackHoleCanvas width={width * 0.45} pointMultiplier={isIntersecting ? 5 : 0.1} />
                </div>
            </>}
        </div>
        {width < ScreenWidths.Mobile && <div style={{ height: '20vh' }} />}
        {width <= ScreenWidths.Mobile && <div ref={myRef} />}
        <div style={{ display: 'flex', padding: '2em', justifyContent: 'center' }} >
            <IconButton onClick={executeScroll} color="primary">
                <ArrowDownward />
            </IconButton>
        </div>
        <div style={{ height: '5vh' }} />
    </>
}

export default OpeningSplash
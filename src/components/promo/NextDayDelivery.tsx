import { ScreenWidths } from "@/constants/ScreenWidths"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { useRef, useLayoutEffect, RefObject, useEffect, useMemo, useState } from "react"
import NebulaCanvas from "../graphics/NebulaCanvas"
import { gsap } from 'gsap';
import CenterlessNebulaCanvas from "../graphics/CenterlessNebulaCanvas"

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

const NextDayDelivery = () => {
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
        {width < ScreenWidths.Mobile && <div style={{ height: '20vh' }} />}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {width > ScreenWidths.Mobile && <>
                <div style={{ display: 'flex', height: '70vh', alignItems: 'center', width: '50%' }}>
                    <CenterlessNebulaCanvas width={width * 0.45} pointMultiplier={0.1} />
                </div>
            </>}
            <div style={{ display: 'flex', height: width > ScreenWidths.Mobile ? '70vh' : '20vh', alignItems: 'center', width: '80vh' }} ref={container}>
                <GlassSpace size='moderate' style={{ flex: 1 }}>
                    <div ref={middleText} style={{ position: 'relative' }}>
                        <GlassText
                            size="gigantic"
                            style={{ lineHeight: '1em', fontWeight: 'bold' }}
                            color="primaryLight"
                        >Next day delivery</GlassText>
                    </div>
                    <div ref={bottomText}>
                        <GlassText
                            size="big"
                            style={{ letterSpacing: '0.15em', fontWeight: 'lighter' }}
                            color="primaryLight"
                        >Why pay extra for instant access? 12 hour file retrievals allow our recurring prices to be upto <b>78% less</b>.</GlassText>
                    </div>
                    <div style={{ padding: '0.5em' }} />
                    {width <= ScreenWidths.Mobile && <div>
                        <div style={{ padding: '0.5em' }} />
                        <CenterlessNebulaCanvas width={Math.min(width * 0.95 - 70, 600)} pointMultiplier={0.5} />
                    </div>}
                </GlassSpace>
            </div>
        </div>
        {width < ScreenWidths.Mobile && <div style={{ height: '40vh' }} />}
    </>
}

export default NextDayDelivery
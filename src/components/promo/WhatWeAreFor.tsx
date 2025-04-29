import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useRef, useLayoutEffect } from "react"
import { gsap } from 'gsap';
import { Divider } from "@mui/material";

const WhatWeAreFor = () => {
    const container = useRef<HTMLDivElement>(null);
    const image = useRef<HTMLDivElement>(null);

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

            tl.to(image.current, { y: -200 }, 0.5);
        });

        return () => ctx.revert();
    }, []);

    return <div ref={container} style={{ display: 'flex', justifyContent: 'center' }}>
        <Divider orientation="vertical" flexItem />
        <div style={{ display: 'flex', flexDirection: 'column' }} ref={image}>
            <GlassSpace size="tiny" >
                <GlassText size="big">You have files you won't need for a while (maybe ever).</GlassText>
            </GlassSpace>
            <GlassSpace size="tiny" >
                <GlassText size="big" style={{ fontWeight: 'normal' }}>You don't want them <i>vanishing</i> after a routine Starbucks spill.</GlassText>
            </GlassSpace>
            <GlassSpace size="tiny" >
                <GlassText size="big" style={{ fontWeight: 'bold' }}>You really don't want them taking up space on your computer.</GlassText>
            </GlassSpace>
        </div>
    </div>
}

export default WhatWeAreFor
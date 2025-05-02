import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useRef, useLayoutEffect } from "react"
import { gsap } from 'gsap';
import { Divider } from "@mui/material";
import { Colours } from "@/constants/Colours";

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
        <div style={{ display: 'flex', flexDirection: 'column' }} ref={image}>
            <GlassSpace size="tiny" style={{ maxWidth: 800 }}>
                <Divider color={Colours.primary} flexItem />
                <GlassText size="big" style={{ textAlign: 'center' }}>
                    SUBUNIFY presents the File Nebula, designed for creatives, built for resilience.
                </GlassText>
                <Divider color={Colours.primary} flexItem />
            </GlassSpace>
        </div>
    </div>
}

export default WhatWeAreFor
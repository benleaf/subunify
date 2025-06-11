import { ScreenWidths } from "@/constants/ScreenWidths"
import { Button, ButtonBase } from "@mui/material"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { useRef, ElementRef, useLayoutEffect, RefObject, useEffect, useMemo, useState } from "react"
import NebulaCanvas from "../graphics/NebulaCanvas"
import { gsap } from 'gsap';
import TopBar from "../navigation/TopBar"
import { useAuth } from "@/contexts/AuthContext"
import WhatWeAreFor from "./WhatWeAreFor"
import DoubleExposure from '@/images/DoubleExposureTwoWomen.png'

const OpeningSplash = () => {
    const { width } = useSize()
    const renderDetailedNebula = useRef<ElementRef<'div'>>(null)

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

            tl.to(topText.current, { y: -250 }, 0.5);
            tl.to(middleText.current, { y: -200 }, 0.5);
            tl.to(bottomText.current, { y: -150 }, 0.5);
        });

        return () => ctx.revert();
    }, []);

    return <>
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '90vh', overflow: 'hidden' }} ref={container}>
            <div style={{
                width: 'min(80vw, 80vh)',
                height: 'min(80vw, 80vh)',
                position: 'absolute',
                borderRadius: '100%',
                borderStyle: 'dashed',
                borderWidth: '2px 1px 0px 1px',
                opacity: 0.2,
            }} />
            <div style={{
                width: 'min(100vw, 100vh)',
                height: 'min(100vw, 100vh)',
                position: 'absolute',
                borderStyle: 'dashed',
                borderWidth: 2,
                opacity: 0.2,
                WebkitTransform: 'rotate(45deg)',
            }} />
            <img src={DoubleExposure} style={{
                width: 'min(100vw, 100vh)',
                height: 'min(100vw, 100vh)',
                position: 'absolute',
                borderRadius: '0% 0% 100% 100%',
                opacity: 0.15,
            }} />
            <div ref={middleText} >
                <GlassText
                    size="fullscreen"
                    style={{ lineHeight: '1em', fontWeight: 'lighter' }}
                    color="lightGrey"
                ><b style={{ color: 'red' }}>UN</b>RESTRAINED</GlassText>
            </div>
            <div ref={bottomText} >
                <div style={{ height: '1em' }} />
                <GlassText size="big" style={{ textAlign: 'center' }}>
                    <i>Hyper</i> Fast File Storage <b style={{ color: 'red' }}>&</b> Sharing
                </GlassText>
                <div style={{ height: '2em' }} />
                <Button variant="contained" href="/onboarding" fullWidth>
                    GET STARTED TODAY
                </Button>
            </div>
        </div>
        {width < ScreenWidths.Mobile && <div style={{ height: '29vh' }} />}
        {width <= ScreenWidths.Mobile && <div ref={renderDetailedNebula} />}
        <div style={{ height: '5vh' }} />
    </>
}

export default OpeningSplash
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useRef, useLayoutEffect } from "react"
import { gsap } from 'gsap';
import manHoldingCamera from '../../images/man-holding-camera.jpg'

const ImageSplash = () => {
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

            tl.to(image.current, { backgroundPositionY: '50%', opacity: 0.5 }, 0);
        });

        return () => ctx.revert();
    }, []);

    return <div ref={container}>
        <GlassSpace size="small" >
            <GlassText size="big">SLOW ACCESS DATA ARCHIVING</GlassText>
            <GlassText size="moderate">Why pay for what you don't need?</GlassText>
        </GlassSpace>
        <div style={{
            backgroundImage: `url(${manHoldingCamera})`,
            backgroundPosition: 'center 100%',
            backgroundRepeat: 'no-repeat',
            width: '100%',
            height: 650,
            objectFit: 'cover',
            boxShadow: "0px -100px 50px 10px black inset"
        }} ref={image} />
    </div>
}

export default ImageSplash
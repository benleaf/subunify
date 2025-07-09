import { ScreenWidths } from "@/constants/ScreenWidths"
import GlassSpace from "../glassmorphism/GlassSpace"
import GlassText from "../glassmorphism/GlassText"
import { useSize } from "@/hooks/useSize"
import { useRef, useLayoutEffect, RefObject, useEffect, useMemo, useState } from "react"
import { gsap } from 'gsap';
import FileViewer from "../widgets/FileViewer"
import { Stack } from "@mui/material"
import { B, C, D, E, H } from '@/images/stock'
import moment from "moment"

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

const Previews = () => <Stack spacing={1}>
    <FileViewer file={{ bytes: 10000000000, proxyState: 'COMPLETE', created: moment().subtract(4, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'INSTANT', modified: new Date(), proxyFiles: [], name: 'A001C001_000001.mov', }} thumbnail={H} />
    <FileViewer file={{ bytes: 5900000000, proxyState: 'COMPLETE', created: moment().subtract(44, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'DEEP', modified: new Date(), proxyFiles: [], name: 'A001C004_000001.mov', }} thumbnail={D} />
    <FileViewer file={{ bytes: 8900000000, proxyState: 'COMPLETE', created: moment().subtract(44, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'DEEP', modified: new Date(), proxyFiles: [], name: 'A001C003_000001.mov', available: moment().add(6, 'hours').toDate() }} thumbnail={C} />
    <FileViewer file={{ bytes: 9000000000, proxyState: 'COMPLETE', created: moment().subtract(44, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'DEEP', modified: new Date(), proxyFiles: [], name: 'A001C002_000001.mov', available: moment().subtract(24, 'hours').toDate() }} thumbnail={B} />
    <FileViewer file={{ bytes: 7900000000, proxyState: 'COMPLETE', created: moment().subtract(44, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'DEEP', modified: new Date(), proxyFiles: [], name: 'A001C005_000001.mov', }} thumbnail={E} />
</Stack>

const PreviewsMedium = () => <Stack spacing={1}>
    <FileViewer file={{ bytes: 9000000000, proxyState: 'COMPLETE', created: moment().subtract(44, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'DEEP', modified: new Date(), proxyFiles: [], name: 'A001C002_000001.mov', }} thumbnail={B} />
    <FileViewer file={{ bytes: 8900000000, proxyState: 'COMPLETE', created: moment().subtract(44, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'DEEP', modified: new Date(), proxyFiles: [], name: 'A001C003_000001.mov', available: moment().add(6, 'hours').toDate() }} thumbnail={C} />
    <FileViewer file={{ bytes: 9000000000, proxyState: 'COMPLETE', created: moment().subtract(44, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'DEEP', modified: new Date(), proxyFiles: [], name: 'A001C002_000001.mov', available: moment().subtract(24, 'hours').toDate() }} thumbnail={C} />
</Stack>

const PreviewsSmall = () => <Stack spacing={1}>
    <FileViewer file={{ bytes: 10000000000, proxyState: 'COMPLETE', created: moment().subtract(44, 'days').toDate(), fileLastModified: new Date(), id: 'test', location: 'DEEP', modified: new Date(), proxyFiles: [], name: 'A001C001_000001.mov', }} thumbnail={C} />
</Stack>

const FileAndForget = () => {
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
            {width > ScreenWidths.Tablet && <div style={{ display: 'flex', alignItems: 'center' }}>
                <Previews />
            </div>}
            <div style={{ display: 'flex', alignItems: 'center', maxWidth: 750 }} ref={container}>
                <GlassSpace size='moderate' style={{ flex: 1 }}>
                    <div ref={middleText} style={{ position: 'relative' }}>
                        <GlassText
                            size="gigantic"
                            style={{ lineHeight: '1em', fontWeight: 500 }}
                            color="primary"
                        >File And Forget</GlassText>
                    </div>
                    <div ref={bottomText}>
                        <GlassText
                            size="big"
                            style={{ letterSpacing: '0.15em', fontWeight: 'lighter' }}
                            color="primary"
                        >Save big with automatic file archiving cutting costs by <b>upto 90%</b></GlassText>
                    </div>
                    <div style={{ padding: '0.5em' }} />
                    {width <= ScreenWidths.Tablet && <>
                        {width > ScreenWidths.Mobile && <PreviewsMedium />}
                        {width <= ScreenWidths.Mobile && <PreviewsSmall />}
                    </>}
                </GlassSpace>
            </div>
        </div>
    </>
}

export default FileAndForget
import { ElementRef, useCallback, useEffect, useState } from "react";
export const useSize = () => {
    const [windowSize, setWindowSize] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    useEffect(() => {
        const windowSizeHandler = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", windowSizeHandler);

        return () => {
            window.removeEventListener("resize", windowSizeHandler);
        };
    }, []);

    return windowSize;
};

export const useDivSize = (divRef?: ElementRef<'div'>) => {
    const [width, setWidth] = useState(divRef?.offsetWidth ?? 0)
    const [height, setHeight] = useState(divRef?.offsetHeight ?? 0)

    const handleResize = useCallback(() => {
        setWidth(divRef?.offsetWidth ?? 0)
        setHeight(divRef?.offsetHeight ?? 0)
    }, [divRef])

    useEffect(() => {
        window.addEventListener('load', handleResize)
        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('load', handleResize)
            window.removeEventListener('resize', handleResize)
        }
    }, [divRef, handleResize])

    return { width, height }
};
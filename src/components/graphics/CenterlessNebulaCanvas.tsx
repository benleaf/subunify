import { ColorSpace } from '@/helpers/ColorSpace';
import { useRef, useEffect, useState } from 'react';

interface OrbitingPoint {
    angle: number;
    speed: number;
    color: string
    a: number;
    b: number;
}

type Props = {
    width?: number,
    pointMultiplier?: number,
}

const CenterlessNebulaCanvas = ({ width = 800, pointMultiplier = 3 }: Props) => {
    const height = width / 3
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [orbitingPoints, setOrbitingPoints] = useState<OrbitingPoint[]>([])
    const numberOfPoints = width * pointMultiplier;

    useEffect(() => {
        setOrbitingPoints([])
        for (let i = 0; i < numberOfPoints; i++) {
            const angle = Math.random() * Math.PI * 2
            setOrbitingPoints(old => [...old, {
                angle: angle,
                speed: 0.0025,
                a: (20 + Math.random() * 300) * (height / 240),
                b: (10 + (Math.random() ** 2) * 50) * (width / 400),
                color: ColorSpace.hSLToRGB(angle * (360 / (Math.PI * 2)), Math.random() * 50 + 50, Math.random() * 20 + 60)
            }]);
        }
    }, [pointMultiplier])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || orbitingPoints.length == 0) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = width;
        canvas.height = height;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const baseSpeed = 0.002

        let animationFrameId: number;

        const render = () => {
            ctx.fillStyle = `rgba(0, 0, 0, ${baseSpeed * 20})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            orbitingPoints.forEach(point => {
                const x = centerX + point.a * Math.cos(point.angle);
                const y = centerY + point.b * Math.sin(point.angle);

                ctx.fillStyle = point.color;
                ctx.beginPath();
                ctx.arc(x, y, (width / (point.a + 1000)), 0, Math.PI * 2);
                ctx.fill();

                point.angle += point.speed;
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [orbitingPoints]);

    return <canvas ref={canvasRef} style={{ width, height }} />;
};

export default CenterlessNebulaCanvas;

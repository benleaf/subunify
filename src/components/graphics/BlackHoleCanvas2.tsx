import { useRef, useEffect, useState } from 'react';

interface OrbitingPoint {
    angle: number;
    speed: number;
    a: number; // Major axis length of the ellipse
    b: number; // Minor axis length of the ellipse
}

type Props = {
    width?: number,
    points?: number,
}

const BlackHoleCanvas2 = ({ width = 800, points = 800 }: Props) => {
    const height = width / 3
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [orbitingPoints, setOrbitingPoints] = useState<OrbitingPoint[]>([])
    const baseSpeed = 0.002

    useEffect(() => {
        for (let i = 0; i <= 1024; i++) {
            setOrbitingPoints(old => [...old, {
                angle: Math.random() * Math.PI * 2,
                speed: -(baseSpeed + Math.random() * (baseSpeed / 2)),
                a: (60 + (Math.random() ** 5) * 300) * (height / 250),
                b: (60 + (Math.random() ** -0.5) * 1) * (width / 700)
            }])
        }
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || orbitingPoints.length == 0) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set full-window size
        canvas.width = width;
        canvas.height = height;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Create an array of orbiting points.
        let animationFrameId: number;

        // Render loop using requestAnimationFrame.
        const render = () => {
            // Create a fading effect by drawing a semi-transparent rectangle over the canvas.
            ctx.fillStyle = `rgba(0, 0, 0, 1)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw each orbiting point.
            for (let pointIndex = 0; pointIndex < points; pointIndex++) {
                const point = orbitingPoints[pointIndex]
                const x = centerX + point.a * Math.cos(point.angle);
                const y = centerY + point.b * Math.sin(point.angle);

                ctx.fillStyle = '#D1B889'; // Or choose another color for a contrast effect
                ctx.beginPath();
                ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                ctx.fill();

                // Increment the angle for the next frame.
                point.angle += point.speed;
            }

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        // Clean up the animation frame when the component unmounts.
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [points, orbitingPoints]);

    return <canvas ref={canvasRef} style={{ width, height }} />;
};

export default BlackHoleCanvas2;

import { ColorSpace } from '@/helpers/ColorSpace';
import { useRef, useEffect, useState } from 'react';

interface OrbitingPoint {
    angle: number
    speed: number
    color: string
    a: number
    b: number
}

type Props = {
    width?: number,
    points?: number,
}

const FileUploadNebula = ({ width = 800, points = 300 }: Props) => {
    const height = width
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [orbitingPoints, setOrbitingPoints] = useState<OrbitingPoint[]>([])

    useEffect(() => {
        const newPoints = []
        for (let i = 0; i < points; i++) {
            const angle = Math.random() * Math.PI * 2
            newPoints.push({
                angle,
                speed: -0.0025,
                a: height * Math.random() / 3 + 10,
                b: width * Math.random() / 3 + 10,
                color: ColorSpace.hSLToRGB(angle * (360 / (Math.PI * 2)), Math.random() * 50 + 50, Math.random() * 20 + 60)
            })
        }
        setOrbitingPoints(newPoints)
    }, [points])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || orbitingPoints.length != points) return;
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw each orbiting point.
            for (let pointIndex = 0; pointIndex < points; pointIndex++) {
                const point = orbitingPoints[pointIndex]
                const x = centerX + point.a * Math.cos(point.angle);
                const y = centerY + point.b * Math.sin(point.angle);

                ctx.fillStyle = point.color // Or choose another color for a contrast effect
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();

                // Increment the angle for the next frame.
                point.angle += point.speed;
            }

            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 3);

            gradient.addColorStop(0, "#ffffff22");
            gradient.addColorStop(0.1, "#ffffff11");
            gradient.addColorStop(0.3, "#ffffff09");
            gradient.addColorStop(1, "#0000");

            ctx.fillStyle = gradient
            ctx.beginPath();
            ctx.arc(centerX, centerY, width / 3, 0, Math.PI * 2);
            ctx.fill();

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

export default FileUploadNebula;

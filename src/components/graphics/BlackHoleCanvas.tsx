import { useRef, useEffect } from 'react';

interface OrbitingPoint {
    angle: number;
    speed: number;
    a: number; // Major axis length of the ellipse
    b: number; // Minor axis length of the ellipse
}

const BlackHoleCanvas = ({ width = 800 }: { width?: number }) => {
    const height = width / 3
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set full-window size
        canvas.width = width;
        canvas.height = height;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Create an array of orbiting points.
        const orbitingPoints: OrbitingPoint[] = [];
        const numberOfPoints = width * 8;
        const baseSpeed = 0.005
        for (let i = 0; i < numberOfPoints; i++) {
            orbitingPoints.push({
                angle: Math.random() * Math.PI * 2,      // Random initial angle
                speed: baseSpeed + Math.random() * (baseSpeed / 2),        // Slight variation in speed
                a: (60 + Math.random() * 300) * (height / 250),               // Varying ellipse major axis lengths
                b: (10 + (Math.random() ** 2) * 50) * (width / 700)           // Varying ellipse minor axis lengths
            });
        }

        let animationFrameId: number;

        // Render loop using requestAnimationFrame.
        const render = () => {
            // Create a fading effect by drawing a semi-transparent rectangle over the canvas.
            ctx.fillStyle = `rgba(0, 0, 0, ${baseSpeed * 20})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw each orbiting point.
            orbitingPoints.forEach(point => {
                const x = centerX + point.a * Math.cos(point.angle);
                const y = centerY + point.b * Math.sin(point.angle);

                ctx.fillStyle = '#D1B88922'; // Or choose another color for a contrast effect
                ctx.beginPath();
                ctx.arc(x, y, (width / (point.a + 500)), 0, Math.PI * 2);
                ctx.fill();

                // Increment the angle for the next frame.
                point.angle += point.speed;
            });

            // Draw the central black hole with a radial gradient.
            const radius = width / 13;
            ctx.fillStyle = '#000f';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, Math.PI, Math.PI * 2);
            ctx.fill();

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        // Clean up the animation frame when the component unmounts.
        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ width, height }} />;
};

export default BlackHoleCanvas;

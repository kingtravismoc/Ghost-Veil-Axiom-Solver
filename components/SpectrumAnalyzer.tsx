import React, { useRef, useEffect } from 'react';
import type { Signal } from '../types';

interface LiveSpectrumVisualizerProps {
    signals: Signal[];
}

const LiveSpectrumVisualizer: React.FC<LiveSpectrumVisualizerProps> = ({ signals }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Shift existing image to the left to create waterfall effect
        const imageData = ctx.getImageData(1, 0, width - 1, height);
        ctx.putImageData(imageData, 0, 0);

        // Clear the rightmost column for the new frame
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(width - 1, 0, 1, height);
        
        // Find the most recent signals
        if (signals.length === 0) return;
        const recentSignals = signals.slice(-5); // Process a few signals per frame

        recentSignals.forEach(signal => {
            const y = height - ((signal.frequency - 20e3) / (5.8e9 - 20e3)) * height;
            const brightness = 150 + (signal.amplitude / 100) * 105;
            const size = 1 + (signal.snr / 50) * 2;
             let color;

            if (signal.amplitude > 85 && signal.snr > 35) {
                color = `rgba(239, 68, 68, ${0.5 + (signal.amplitude / 200)})`; // Red for threats
            } else if (signal.amplitude > 70) {
                 color = `rgba(234, 179, 8, ${0.4 + (signal.amplitude / 200)})`; // Yellow for significant
            } else {
                 color = `rgba(34, 211, 238, ${0.3 + (signal.amplitude / 200)})`; // Cyan for normal
            }

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(width - 1, y, size, 0, Math.PI * 2);
            ctx.fill();
        });

    }, [signals]);

    return (
        <div className="w-full h-full bg-slate-900">
            <canvas ref={canvasRef} width="1200" height="200" className="w-full h-full" />
        </div>
    );
};

export default LiveSpectrumVisualizer;

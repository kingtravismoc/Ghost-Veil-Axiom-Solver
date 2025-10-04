import React, { useRef, useEffect } from 'react';
import type { Signal } from '../types';

interface SpectrumAnalyzerProps {
    signals: Signal[];
}

const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({ signals }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // Shift existing image down
        const imageData = ctx.getImageData(0, 0, width, height);
        ctx.putImageData(imageData, 0, 1);

        // Clear top row
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, 1);

        // Draw horizontal grid lines (now representing amplitude)
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        for (let i = 1; i < 5; i++) {
            const x = (width / 5) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 1);
            ctx.stroke();
        }
        
        // Find the most recent signals
        if (signals.length === 0) return;
        const recentSignals = signals.slice(-5); // Process a few signals per frame

        recentSignals.forEach(signal => {
            const x = (signal.amplitude / 100) * width;
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
            ctx.arc(x, 0, size, 0, Math.PI * 2);
            ctx.fill();
        });

    }, [signals]);

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 h-full flex flex-col">
             <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-300">
                Live Spectrum
            </h2>
            <div className="w-full flex-grow rounded bg-slate-900 min-h-[300px]">
                <canvas ref={canvasRef} width="300" height="800" className="w-full h-full" />
            </div>
        </div>
    );
};

export default SpectrumAnalyzer;
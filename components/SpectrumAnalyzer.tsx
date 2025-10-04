
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

        // Clear canvas
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // Draw grid
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 0.5;
        for (let i = 1; i < 10; i++) {
            const y = (height / 10) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        if (signals.length === 0) return;

        const recentSignals = signals.slice(-200);
        
        // Draw signal line
        ctx.strokeStyle = '#22d3ee';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        recentSignals.forEach((signal, i) => {
            const x = (i / (recentSignals.length - 1)) * width;
            const y = height - (signal.amplitude / 100) * height;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Highlight significant signals
        const significantSignals = signals.filter(s => s.amplitude > 85 && s.snr > 35);
        significantSignals.forEach(signal => {
            const y = height - (signal.amplitude / 100) * height;
            ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
            ctx.beginPath();
            ctx.arc(Math.random() * width, y, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ef4444';
            ctx.font = '10px monospace';
            ctx.fillText(`${(signal.frequency / 1e6).toFixed(1)}MHz`, 10, y - 5);
        });

    }, [signals]);

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
             <h2 className="text-lg font-semibold mb-2 flex items-center gap-2 text-slate-300">
                Live Spectrum
            </h2>
            <canvas ref={canvasRef} width="600" height="250" className="w-full h-auto rounded bg-slate-900" />
        </div>
    );
};

export default SpectrumAnalyzer;


import React, { useRef, useEffect } from 'react';
import { BrainCircuitIcon } from './icons';
import type { AudioThreat, MicrophoneStatus } from '../types';

interface AxiomSilenceControlProps {
    isActive: boolean;
    status: MicrophoneStatus;
    noiseLevel: number;
    threats: AudioThreat[];
    activate: () => void;
    deactivate: () => void;
}

const statusConfig = {
    INACTIVE: { text: 'Protocol Inactive', color: 'text-slate-400' },
    CALIBRATING: { text: 'Calibrating Sensors...', color: 'text-yellow-400 animate-pulse' },
    ACTIVE: { text: 'Real-time Audio Veil Active', color: 'text-green-400' },
    ERROR: { text: 'Microphone Access Denied', color: 'text-red-500' },
};

const AxiomSilenceControl: React.FC<AxiomSilenceControlProps> = ({ isActive, status, noiseLevel, threats, activate, deactivate }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const threatsOnScreen = useRef<any[]>([]);
    const scannerAngle = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        let animationFrameId: number;
        
        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Draw head/ear silhouette
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, 40, Math.PI * 1.7, Math.PI * 0.8);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(width / 2 + 5, height / 2 - 10, 25, Math.PI * 1.5, Math.PI * 0.5);
            ctx.stroke();


            // Draw ambient noise wave
            const pulse = Math.sin(Date.now() / 300) * 3;
            const radius = 45 + (noiseLevel * 0.8) + pulse;
            ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + (noiseLevel / 200)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Draw scanner line
            if (isActive) {
                scannerAngle.current = (scannerAngle.current + 0.03) % (Math.PI * 2);
                ctx.save();
                ctx.beginPath();
                const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, radius + 10);
                grad.addColorStop(0, 'rgba(115, 255, 255, 0)');
                grad.addColorStop(0.8, 'rgba(115, 255, 255, 0.4)');
                grad.addColorStop(1, 'rgba(115, 255, 255, 0)');
                ctx.fillStyle = grad;
                ctx.moveTo(width / 2, height / 2);
                ctx.arc(width / 2, height / 2, radius + 10, scannerAngle.current - 0.5, scannerAngle.current);
                ctx.closePath();
                ctx.fill();
                ctx.restore();
            }


            // Draw and update threats
             threatsOnScreen.current.forEach(threat => {
                ctx.strokeStyle = threat.color;
                ctx.fillStyle = threat.color;
                ctx.lineWidth = 2;

                const startX = width / 2 + Math.cos(threat.angle) * threat.currentRadius;
                const startY = height / 2 + Math.sin(threat.angle) * threat.currentRadius;
                const endX = width / 2 + Math.cos(threat.angle) * (threat.currentRadius + 20);
                const endY = height / 2 + Math.sin(threat.angle) * (threat.currentRadius + 20);

                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                ctx.font = '10px monospace';
                const textX = width / 2 + Math.cos(threat.angle) * (threat.currentRadius + 30);
                const textY = height / 2 + Math.sin(threat.angle) * (threat.currentRadius + 30);
                ctx.save();
                ctx.translate(textX, textY);
                ctx.rotate(threat.angle > Math.PI / 2 && threat.angle < (3 * Math.PI) / 2 ? threat.angle - Math.PI : threat.angle);
                ctx.textAlign = (threat.angle > Math.PI / 2 && threat.angle < (3 * Math.PI) / 2) ? 'right' : 'left';
                ctx.fillText(threat.type.split('_')[0], 0, 5);
                ctx.restore();

                // Animate and fade
                threat.currentRadius -= 0.5;
                threat.opacity -= 0.005;
                threat.color = `rgba(239, 68, 68, ${threat.opacity})`;
            });

            // Filter out faded threats
            threatsOnScreen.current = threatsOnScreen.current.filter(t => t.opacity > 0 && t.currentRadius > radius + 5);

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };

    }, [noiseLevel, isActive]);

    useEffect(() => {
        if (!canvasRef.current) return;
        // Add new threats to visualization
        threats.forEach(threat => {
            if (!threatsOnScreen.current.find(t => t.id === threat.id)) {
                threatsOnScreen.current.push({
                    id: threat.id,
                    type: threat.type,
                    angle: Math.random() * Math.PI * 2,
                    currentRadius: Math.min(canvasRef.current.width, canvasRef.current.height) / 2 - 10,
                    opacity: 1,
                    color: 'rgba(239, 68, 68, 1)'
                });
            }
        });
    }, [threats]);

    const statusInfo = statusConfig[status];

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <BrainCircuitIcon className="w-6 h-6 text-purple-400" />
                Aural Bio-Resonance Scan
            </h2>
            
            <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                <canvas ref={canvasRef} width="300" height="192" className="w-full h-full" />
                <div className="absolute bottom-2 left-2 text-xs font-mono bg-slate-900/50 px-1 rounded">
                    Ambient Noise: <span className="text-cyan-300">{noiseLevel.toFixed(1)} dB</span>
                </div>
            </div>

            <div className="text-center">
                 <p className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</p>
            </div>

            <button
                onClick={isActive ? deactivate : activate}
                className={`w-full px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                    isActive
                        ? 'bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 shadow-red-900/50'
                        : 'bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 shadow-indigo-900/50'
                }`}
            >
                {isActive ? 'Disengage Scan' : 'Engage Aural Scan'}
            </button>
            {threats.length > 0 && isActive && (
                <div className="pt-2">
                     <h3 className="text-sm font-semibold text-slate-300 mb-2">Neutralization Log:</h3>
                     <div className="space-y-1 max-h-24 overflow-y-auto text-xs font-mono p-2 bg-slate-900/50 rounded-md">
                        {threats.slice().reverse().map(t => (
                            <p key={t.id} className="text-red-400 animate-pulse-fast">
                                <span className="text-slate-400">{new Date(t.timestamp).toLocaleTimeString()}:</span> {t.type}
                            </p>
                        ))}
                     </div>
                </div>
            )}
        </div>
    );
};

export default AxiomSilenceControl;

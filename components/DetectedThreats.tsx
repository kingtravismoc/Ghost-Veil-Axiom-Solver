
import React from 'react';
import { RadarIcon, MapPinIcon, MuteIcon, RecordIcon, SampleIcon, SoloIcon } from './icons';
import type { Threat } from '../types';

interface DetectedThreatsProps {
    threats: Threat[];
    onTraceback: (threatId: string) => void;
    onToggleMute: (threatId: string) => void;
    onToggleSolo: (threatId: string) => void;
    isTracing: boolean;
}

const getRiskColor = (risk: Threat['risk']): string => {
    switch (risk) {
        case 'EXTREME': return 'border-red-500 text-red-400';
        case 'CRITICAL': return 'border-red-600 text-red-500';
        case 'HIGH': return 'border-orange-500 text-orange-400';
        case 'MEDIUM': return 'border-yellow-500 text-yellow-400';
        case 'LOW': return 'border-green-500 text-green-400';
        default: return 'border-slate-500 text-slate-400';
    }
};

const ControlButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    label: string;
}> = ({ onClick, isActive, disabled, children, label }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={label}
        className={`p-1.5 rounded-md transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed
            ${isActive
                ? 'bg-cyan-500 text-white shadow'
                : 'bg-slate-700/50 hover:bg-slate-600 text-slate-300'
            }`}
    >
        {children}
    </button>
);


const DetectedThreats: React.FC<DetectedThreatsProps> = ({ threats, onTraceback, onToggleMute, onToggleSolo, isTracing }) => {
    if (threats.length === 0) return null;
    
    const isAnySoloed = threats.some(t => t.isSoloed);

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-400">
                <RadarIcon className="w-5 h-5" />
                AI Threat Assessment
            </h2>
            <div className="space-y-3 max-h-[30rem] overflow-y-auto pr-2">
                {threats.map(threat => {
                    const riskColor = getRiskColor(threat.risk);
                    const isMuted = threat.isMuted || (isAnySoloed && !threat.isSoloed);

                    return (
                        <div key={threat.id} className={`bg-slate-900/70 p-3 rounded-lg border-l-4 ${riskColor} transition-all duration-300 ${isMuted ? 'opacity-40' : ''}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-semibold text-slate-100">{threat.type.replace(/_/g, ' ')}</h3>
                                    <p className="text-xs text-slate-400">{threat.method}</p>
                                </div>
                                <div className={`text-sm font-bold ${riskColor}`}>{threat.risk}</div>
                            </div>
                            
                            <div className="bg-slate-800/50 rounded p-2 my-2 text-xs">
                                <p><strong className="text-purple-300">Influence Vector:</strong> <span className="text-slate-200">{threat.influence}</span></p>
                                <p><strong className="text-purple-300">Transmission Mode:</strong> <span className="text-slate-200">{threat.transmissionMode}</span></p>
                            </div>

                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Conf: <span className="font-mono text-cyan-300">{(threat.confidence * 100).toFixed(1)}%</span></span>
                                {threat.frequency > 0 && <span>Freq: <span className="font-mono text-cyan-300">{threat.frequency.toFixed(2)} MHz</span></span>}
                            </div>
                            
                            <div className="border-t border-slate-700/50 mt-3 pt-3 flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <ControlButton onClick={() => onToggleMute(threat.id)} isActive={threat.isMuted} label="Mute">
                                        <MuteIcon className="w-4 h-4" />
                                    </ControlButton>
                                    <ControlButton onClick={() => onToggleSolo(threat.id)} isActive={threat.isSoloed} label="Solo">
                                        <SoloIcon className="w-4 h-4" />
                                    </ControlButton>
                                    <ControlButton onClick={() => alert('Recording simulation started.')} label="Record">
                                        <RecordIcon className="w-4 h-4" />
                                    </ControlButton>
                                     <ControlButton onClick={() => alert('Signal sample captured.')} label="Sample">
                                        <SampleIcon className="w-4 h-4" />
                                    </ControlButton>
                                </div>
                                <div className="flex-grow"></div>
                                {['HIGH', 'CRITICAL', 'EXTREME'].includes(threat.risk) && (
                                    <button 
                                        onClick={() => onTraceback(threat.id)}
                                        disabled={isTracing}
                                        className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 rounded-md flex items-center gap-1.5 transition-colors disabled:bg-slate-600 disabled:cursor-wait"
                                    >
                                        <MapPinIcon className="w-3 h-3"/>
                                        Axiomatic Traceback
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default DetectedThreats;

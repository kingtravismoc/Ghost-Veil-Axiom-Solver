import React from 'react';
import { ShieldCheckIcon, BrainCircuitIcon } from './icons';

interface WaveMaskControlProps {
    isActive: boolean;
    isMeasuring: boolean;
    onToggle: () => void;
}

const WaveMaskControl: React.FC<WaveMaskControlProps> = ({ isActive, isMeasuring, onToggle }) => {
    
    let buttonText = "Engage WaveMask";
    let statusText = "Protocol Idle. Engage for predictive analysis.";
    if (isMeasuring) {
        buttonText = "Measuring...";
        statusText = "Measuring future spectrum via 4D offset loop...";
    } else if (isActive) {
        buttonText = "Disengage WaveMask";
        statusText = "WaveMask Active: All transmissions masked.";
    }

    const buttonColor = isActive 
        ? 'from-red-600 to-orange-700 hover:from-red-700 hover:to-orange-800'
        : 'from-purple-600 to-cyan-700 hover:from-purple-700 hover:to-cyan-800';

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-cyan-400" />
                WaveMask Protocol
            </h2>
            <p className="text-xs text-slate-400">
                A proprietary transmission masking system. Uses a 4D offset waveform with a dual-phase, time-dilated vector timelock loop to measure future spectrum events, providing fast, clean results while obfuscating all protocol transmissions.
            </p>
            
            <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700 text-center">
                <button
                    onClick={onToggle}
                    disabled={isMeasuring}
                    className={`w-full bg-gradient-to-r ${buttonColor} disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-wait px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-purple-900/50`}
                >
                    <BrainCircuitIcon className="w-5 h-5" />
                    {buttonText}
                </button>
                <p className={`text-xs mt-3 font-mono ${isMeasuring || isActive ? 'text-cyan-300 animate-pulse' : 'text-slate-500'}`}>
                    {statusText}
                </p>
            </div>
        </div>
    );
};

export default WaveMaskControl;
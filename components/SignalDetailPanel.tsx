import React from 'react';
import type { Signal } from '../types';
import { BrainCircuitIcon, UsersIcon, CubeIcon } from './icons';

interface SignalDetailPanelProps {
    signal: Signal | null;
    onClassify: (signalId: string) => void;
    onAnnotate: () => void;
    onDownloadIntel: (signalId: string) => void;
    isClassifying: boolean;
    isAiEnabled: boolean;
}

const DetailRow: React.FC<{ label: string; value: string | number; className?: string }> = ({ label, value, className = '' }) => (
    <div className="flex justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono text-slate-200 ${className}`}>{value}</span>
    </div>
);

const SignalDetailPanel: React.FC<SignalDetailPanelProps> = ({ signal, onClassify, onAnnotate, onDownloadIntel, isClassifying, isAiEnabled }) => {
    
    if (!signal) {
        return (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6 h-full flex items-center justify-center">
                <p className="text-slate-400 text-center">Click a signal on the waterfall to inspect it.</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 flex flex-col h-full">
            <h2 className="text-lg font-semibold flex items-center gap-2 p-4 border-b border-slate-700 text-slate-300 flex-shrink-0">
                <CubeIcon className="w-5 h-5 text-yellow-400" />
                Signal Inspector
            </h2>
            <div className="p-4 flex-grow overflow-y-auto space-y-4">
                {/* Core Details */}
                <div className="space-y-1">
                    <DetailRow label="Frequency" value={`${(signal.frequency / 1e6).toFixed(3)} MHz`} className="text-cyan-300" />
                    <DetailRow label="Amplitude" value={`${signal.amplitude.toFixed(1)} dB`} className="text-green-300" />
                    <DetailRow label="SNR" value={`${signal.snr.toFixed(1)} dB`} className="text-yellow-300" />
                    <DetailRow label="Modulation" value={signal.modulation} className="text-purple-300" />
                    <DetailRow label="Bandwidth" value={`${(signal.bandwidth / 1e3).toFixed(1)} kHz`} />
                </div>
                
                {/* Classification Details */}
                <div className="pt-3 border-t border-slate-700">
                    {signal.isClassified ? (
                         <div className="space-y-2">
                            <h3 className="font-bold text-slate-100">{signal.classification}</h3>
                            <p className="text-sm text-slate-300 italic">"{signal.summary}"</p>
                            <div className="flex flex-wrap gap-1.5">
                                {signal.tags?.map(t => <span key={t} className="px-2 py-0.5 bg-slate-700 rounded-full text-xs">{t}</span>)}
                            </div>
                            {signal.origin && (
                                <p className="text-xs text-purple-300 pt-2 border-t border-slate-700/50">
                                    Intel sourced from: <span className="font-mono">{signal.origin}</span>
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-400 text-center">No classification data available for this signal.</p>
                    )}
                </div>
            </div>

            {/* Actions Footer */}
            <div className="p-3 border-t border-slate-700 space-y-2 flex-shrink-0">
                 <button 
                    onClick={() => onClassify(signal.id)} 
                    disabled={isClassifying || !isAiEnabled}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-md font-semibold text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-wait transition-colors"
                    title={!isAiEnabled ? "Enable Gemini AI in System > Settings to use this feature." : ""}
                >
                    <BrainCircuitIcon className="w-4 h-4" />
                    {isClassifying ? 'Analyzing...' : 'Analyze with AI'}
                </button>
                 <button 
                    onClick={() => onDownloadIntel(signal.id)}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-md font-semibold text-sm bg-green-600 hover:bg-green-700 transition-colors"
                >
                    <UsersIcon className="w-4 h-4" />
                    Download Intel from P2P Network
                </button>
                 <button 
                    onClick={onAnnotate}
                    className="w-full p-2 rounded-md font-semibold text-sm bg-slate-600 hover:bg-slate-500 transition-colors"
                >
                    Edit Annotation
                </button>
            </div>
        </div>
    );
};

export default SignalDetailPanel;
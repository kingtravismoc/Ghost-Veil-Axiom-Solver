
import React from 'react';
import type { Signal } from '../types';

interface DetectedSignalsProps {
    signals: Signal[];
}

const DetectedSignals: React.FC<DetectedSignalsProps> = ({ signals }) => {
    if (signals.length === 0) return null;

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h2 className="text-lg font-semibold mb-3 text-slate-300">Significant Signals Log</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {signals.slice(0, 10).map(signal => (
                    <div key={signal.id} className="bg-slate-900/70 p-2 rounded text-xs grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                        <div>
                            <span className="text-slate-400">Freq:</span>
                            <span className="ml-2 text-cyan-400 font-mono">{(signal.frequency / 1e6).toFixed(2)} MHz</span>
                        </div>
                        <div>
                            <span className="text-slate-400">Amp:</span>
                            <span className="ml-2 text-green-400 font-mono">{signal.amplitude.toFixed(1)} dB</span>
                        </div>
                        <div>
                            <span className="text-slate-400">Mod:</span>
                            <span className="ml-2 text-purple-400 font-mono">{signal.modulation}</span>
                        </div>
                        <div>
                            <span className="text-slate-400">SNR:</span>
                            <span className="ml-2 text-yellow-400 font-mono">{signal.snr.toFixed(1)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetectedSignals;

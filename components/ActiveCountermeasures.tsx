
import React from 'react';
import { ZapIcon, UsersIcon } from './icons';
import type { Countermeasure } from '../types';

interface ActiveCountermeasuresProps {
    countermeasures: Countermeasure[];
    isWaveMaskActive: boolean;
}

const ActiveCountermeasures: React.FC<ActiveCountermeasuresProps> = ({ countermeasures, isWaveMaskActive }) => {
    if (countermeasures.length === 0) return null;

    return (
        <div className={`bg-slate-800/50 rounded-lg p-6 border border-blue-500/50 ${isWaveMaskActive ? 'spectral-pulse' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-300">
                <ZapIcon className="w-6 h-6" />
                Engaged Countermeasures
            </h2>
            <div className="space-y-4">
                {countermeasures.map((cm, index) => {
                    const isDistributed = cm.source === 'DISTRIBUTED';
                    const borderColor = isDistributed ? 'border-purple-500' : 'border-slate-700';
                    const headerColor = isDistributed ? 'text-purple-300' : 'text-slate-100';

                    return (
                        <div key={index} className={`bg-slate-900/70 p-4 rounded-lg border-l-4 ${borderColor}`}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className={`font-semibold ${headerColor}`}>{cm.method}</h3>
                                    <p className="text-xs text-slate-400 mt-1">Target: {cm.threatType.replace(/_/g, ' ')}</p>
                                </div>
                                <div className="px-2 py-1 bg-blue-600 rounded-full text-xs font-semibold">
                                    {(cm.effectiveness * 100).toFixed(1)}%
                                </div>
                            </div>
                            {isDistributed && (
                                <div className="flex items-center gap-2 text-xs text-purple-400 mb-2 border border-purple-800 bg-purple-900/30 rounded-full px-2 py-1 w-fit">
                                    <UsersIcon className="w-3 h-3" />
                                    <span>P2P Distributed Response</span>
                                </div>
                            )}
                            <div className="text-xs space-y-2 mt-3">
                                <div>
                                    <div className="text-slate-400">Implementation:</div>
                                    <div className="text-slate-200">{cm.implementation}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400">Waveform:</div>
                                    <div className="text-purple-300 font-mono">{cm.waveform}</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActiveCountermeasures;

import React from 'react';
import { ShieldCheckIcon } from './icons';

const protectedBands = [
    { name: 'MedRadio', range: '401-406 MHz', usage: 'Medical implant communications' },
    { name: 'Aviation', range: '108-137 MHz', usage: 'Aircraft communication & navigation' },
    { name: 'GNSS', range: '1.1-1.6 GHz', usage: 'Global navigation systems (GPS, etc.)' },
    { name: 'Emergency Services', range: '4.9 GHz', usage: 'Public safety communications' },
];

const FrequencySafetyControl: React.FC = () => {
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                Frequency Safety Governor
            </h2>
            <p className="text-xs text-slate-400">
                The system is hard-coded to avoid interference with critical, life-sustaining, and legally protected frequency bands. This governor cannot be disabled.
            </p>
            <div className="space-y-2">
                {protectedBands.map(band => (
                    <div key={band.name} className="bg-green-900/30 p-2 rounded-md border border-green-700/50">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-green-300 text-sm">{band.name}</span>
                            <span className="text-xs text-slate-300 font-mono">{band.range}</span>
                        </div>
                        <p className="text-xs text-slate-400">{band.usage}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FrequencySafetyControl;

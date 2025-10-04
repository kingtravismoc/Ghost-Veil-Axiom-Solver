import React from 'react';
import { ActivityIcon } from './icons'; // Re-using an icon
import type { FrequencyBand } from '../types';

const knownBands: FrequencyBand[] = [
    { name: 'Wi-Fi 2.4GHz', range: '2.400-2.500 GHz', usage: 'WLAN, Bluetooth, personal devices', isProtected: false },
    { name: 'Cellular (LTE)', range: '700-2600 MHz', usage: 'Mobile communications', isProtected: false },
    { name: 'FM Radio', range: '87.5-108.0 MHz', usage: 'Public broadcast', isProtected: false },
    { name: 'MedRadio', range: '401-406 MHz', usage: 'Medical implant communications', isProtected: true },
    { name: 'Aviation', range: '108-137 MHz', usage: 'Aircraft communication & navigation', isProtected: true },
];

const FrequencyCatalog: React.FC = () => {
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ActivityIcon className="w-6 h-6 text-cyan-400" />
                Frequency Catalog
            </h2>
            <p className="text-xs text-slate-400 mt-2 mb-4">
                A reference of common and critical frequency bands.
            </p>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {knownBands.map(band => (
                    <div key={band.name} className={`p-2 rounded-md border ${band.isProtected ? 'bg-green-900/20 border-green-700/50' : 'bg-slate-900/30 border-slate-700'}`}>
                        <div className="flex justify-between items-center">
                            <span className={`font-semibold text-sm ${band.isProtected ? 'text-green-300' : 'text-slate-200'}`}>{band.name}</span>
                            <span className="text-xs text-slate-300 font-mono">{band.range}</span>
                        </div>
                        <p className="text-xs text-slate-400">{band.usage}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FrequencyCatalog;

import React from 'react';
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
    );
};

export default FrequencyCatalog;

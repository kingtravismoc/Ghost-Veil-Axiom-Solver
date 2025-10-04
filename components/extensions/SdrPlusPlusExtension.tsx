
import React, { useState } from 'react';
import type { GhostVeilSdk } from '../ExtensionHost';
import SpectrumAnalyzer from '../SpectrumAnalyzer';
import { RadarIcon } from '../icons';

interface SdrPlusPlusExtensionProps {
  sdk: GhostVeilSdk;
}

const SdrPlusPlusExtension: React.FC<SdrPlusPlusExtensionProps> = ({ sdk }) => {
    const systemState = sdk.getSystemState();
    const [demodulation, setDemodulation] = useState('NFM');
    const [bandwidth, setBandwidth] = useState(12.5);

    const handleRecord = () => {
        sdk.addLog('SDR++: Simulated I/Q recording started.', 'INFO');
        alert('Simulated I/Q recording started for 30 seconds.');
    };

    return (
        <div className="h-full flex flex-col bg-slate-900 text-white">
            <div className="flex-grow p-4 overflow-hidden">
                 <SpectrumAnalyzer
                    signals={systemState.signals}
                    scanMode={systemState.isMonitoring ? 'WIDEBAND_SWEEP' : 'off'}
                    activePeers={systemState.p2pNodes.filter(n => n.status !== 'OFFLINE').length}
                />
            </div>
            <footer className="flex-shrink-0 bg-slate-800/50 border-t border-slate-700 p-3 grid grid-cols-4 gap-4 items-center">
                <div>
                    <label className="text-xs text-slate-400">Demodulation</label>
                    <select value={demodulation} onChange={e => setDemodulation(e.target.value)} className="w-full bg-slate-700 p-1.5 rounded border border-slate-600 text-sm">
                        <option>NFM</option>
                        <option>AM</option>
                        <option>LSB</option>
                        <option>USB</option>
                        <option>RAW</option>
                    </select>
                </div>
                 <div>
                    <label className="text-xs text-slate-400">Bandwidth (kHz)</label>
                    <input type="range" min="2.5" max="25" step="0.1" value={bandwidth} onChange={e => setBandwidth(parseFloat(e.target.value))} className="w-full" />
                    <div className="text-sm text-center font-mono">{bandwidth.toFixed(1)} kHz</div>
                </div>
                <div className="text-center">
                     <p className="text-xs text-slate-400">Frequency</p>
                     <p className="text-lg font-mono font-bold">145.650 MHz</p>
                </div>
                <div>
                     <button onClick={handleRecord} className="w-full bg-red-600 hover:bg-red-700 p-2 rounded-md font-semibold">
                        Record I/Q
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default SdrPlusPlusExtension;

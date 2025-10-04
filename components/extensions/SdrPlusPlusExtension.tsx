import React, { useState, useEffect } from 'react';
import type { GhostVeilSdk } from '../ExtensionHost';
import SpectrumAnalyzer from '../SpectrumAnalyzer';
import { RadarIcon, PlayIcon, StopIcon } from '../icons';
import type { Signal, ScanMode } from '../../types';

interface SdrDevilInterfaceProps {
  sdk: GhostVeilSdk;
}

const SdrDevilInterfaceExtension: React.FC<SdrDevilInterfaceProps> = ({ sdk }) => {
    const [systemState, setSystemState] = useState(sdk.getSystemState());
    const [demodulation, setDemodulation] = useState('NFM');
    const [bandwidth, setBandwidth] = useState(12.5);
    const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

    // Poll for system state updates
    useEffect(() => {
        const interval = setInterval(() => {
            setSystemState(sdk.getSystemState());
        }, 200);
        return () => clearInterval(interval);
    }, [sdk]);
    
    const handleRecord = () => {
        sdk.addLog('SDRDevil Interface: Simulated I/Q recording started.', 'INFO');
        alert('Simulated I/Q recording started for 30 seconds.');
    };

    const handleScanToggle = () => {
        if (systemState.isMonitoring) {
            sdk.stopScan();
        } else {
            sdk.startScan('WIDEBAND_SWEEP');
        }
    }

    return (
        <div className="h-full flex flex-col bg-slate-900 text-white">
            <div className="flex-grow p-4 overflow-hidden">
                 <SpectrumAnalyzer
                    signals={systemState.signals}
                    scanMode={systemState.isMonitoring ? 'WIDEBAND_SWEEP' : 'off'}
                    activePeers={systemState.p2pNodes.filter(n => n.status !== 'OFFLINE').length}
                    onSignalSelect={setSelectedSignal}
                    selectedSignal={selectedSignal}
                />
            </div>
            <footer className="flex-shrink-0 bg-slate-800/50 border-t border-slate-700 p-3 grid grid-cols-5 gap-4 items-center">
                <div className="flex flex-col items-center justify-center h-full">
                     <button onClick={handleScanToggle} className={`p-3 rounded-full ${systemState.isMonitoring ? 'bg-red-600' : 'bg-green-600'}`}>
                        {systemState.isMonitoring ? <StopIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                    </button>
                    <span className="text-xs mt-1">{systemState.isMonitoring ? 'Scanning' : 'Stopped'}</span>
                </div>
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
                     <p className="text-lg font-mono font-bold">{selectedSignal ? `${(selectedSignal.frequency / 1e6).toFixed(3)} MHz` : '---.--- MHz'}</p>
                </div>
                <div>
                     <button onClick={handleRecord} className="w-full bg-slate-600 hover:bg-slate-500 p-2 rounded-md font-semibold">
                        Record I/Q
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default SdrDevilInterfaceExtension;
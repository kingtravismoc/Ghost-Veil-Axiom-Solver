import React from 'react';
import { PlayIcon, StopIcon, ShieldIcon, ZapIcon, BrainCircuitIcon } from './icons';
import type { ScanMode, ProtectionStrategy } from '../types';

interface SdrDevilControlProps {
    isMonitoring: boolean;
    isLoading: boolean;
    isProtected: boolean;
    canActivate: boolean;
    scanMode: ScanMode;
    protectionStrategy: ProtectionStrategy;
    setScanMode: (mode: ScanMode) => void;
    setProtectionStrategy: (strategy: ProtectionStrategy) => void;
    startMonitoring: () => void;
    stopMonitoring: () => void;
    activateProtection: () => void;
    deactivateProtection: () => void;
    activateButtonText: string;
    isIntelligentScanning: boolean;
    onIntelligentScan: () => void;
}

const scanModeOptions: { value: ScanMode; label: string }[] = [
    { value: 'WIDEBAND_SWEEP', label: 'Wideband Sweep' },
    { value: 'ANOMALY_SCAN', label: 'Targeted Anomaly Scan' },
    { value: 'PASSIVE_INTERCEPT', label: 'Passive Intercept' },
];

const protectionStrategyOptions: { value: ProtectionStrategy; label: string }[] = [
    { value: 'QUANTUM_NOISE', label: 'Quantum Noise Injection' },
    { value: 'DYNAMIC_MIMICRY', label: 'Dynamic Waveform Mimicry' },
    { value: 'DECENTRALIZED_OBFUSCATION', label: 'P2P Decentralized Obfuscation' },
];

const SdrDevilControl: React.FC<SdrDevilControlProps> = (props) => {
    const {
        isMonitoring, isLoading, isProtected, canActivate,
        scanMode, protectionStrategy, setScanMode, setProtectionStrategy,
        startMonitoring, stopMonitoring, activateProtection, deactivateProtection,
        activateButtonText, isIntelligentScanning, onIntelligentScan
    } = props;

    const actionText = isLoading ? 'Processing...' : isMonitoring ? 'Stop Scan' : 'Start Scan';

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-slate-700 quantum-shield space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ZapIcon className="w-6 h-6 text-cyan-400" />
                SDRDevil TX/RX Interface
            </h2>
            
            <button
                onClick={onIntelligentScan}
                disabled={isIntelligentScanning || isMonitoring || isLoading}
                className="w-full bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 hover:from-yellow-600 hover:to-red-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-orange-900/50 text-white"
            >
                <BrainCircuitIcon className="w-6 h-6" />
                {isIntelligentScanning ? 'AI Optimizing...' : 'Intelligent Scan'}
            </button>


            {/* Monitoring Section */}
            <div className="space-y-3 p-3 sm:p-4 border border-slate-600 rounded-lg bg-slate-900/30">
                <label htmlFor="scan-mode" className="block text-sm font-medium text-slate-300 mb-2">Scan Mode (RX)</label>
                <select
                    id="scan-mode"
                    value={scanMode}
                    onChange={(e) => setScanMode(e.target.value as ScanMode)}
                    disabled={isMonitoring || isLoading || isIntelligentScanning}
                    className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition disabled:opacity-50"
                >
                    {scanModeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <button
                    onClick={isMonitoring ? stopMonitoring : startMonitoring}
                    disabled={isLoading || isIntelligentScanning}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/50"
                >
                    {isMonitoring ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    {actionText}
                </button>
            </div>

            {/* Protection Section */}
            <div className="space-y-3 p-3 sm:p-4 border border-slate-600 rounded-lg bg-slate-900/30">
                 <label htmlFor="protection-strategy" className="block text-sm font-medium text-slate-300 mb-2">Countermeasure Strategy (TX/NMethods)</label>
                 <select
                    id="protection-strategy"
                    value={protectionStrategy}
                    onChange={(e) => setProtectionStrategy(e.target.value as ProtectionStrategy)}
                    disabled={isProtected || isLoading || isIntelligentScanning}
                    className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition disabled:opacity-50"
                >
                    {protectionStrategyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                 <button
                    onClick={activateProtection}
                    disabled={isProtected || isLoading || !canActivate || isIntelligentScanning}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-900/50"
                >
                    <ShieldIcon className="w-5 h-5" />
                    {isLoading && !isProtected ? 'Engaging...' : activateButtonText}
                </button>
                <button
                    onClick={deactivateProtection}
                    disabled={!isProtected || isLoading || isIntelligentScanning}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                >
                    Disengage
                </button>
                 {!canActivate && !isProtected && (
                    <p className="text-xs text-slate-400 pt-2 text-center">Run a scan and detect threats to enable protection.</p>
                )}
            </div>
        </div>
    );
};

export default SdrDevilControl;
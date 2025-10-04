import React, { useState } from 'react';
import type { ImplantedDevice, ImplantedDeviceStatus, FourDSafetyValidationResult } from '../types';
import { ChipIcon, BodyIcon, TerminalIcon, ShieldCheckIcon, ZapIcon, EyeIcon, EyeSlashIcon, BrainCircuitIcon } from './icons';

interface DeviceDetailModalProps {
    device: ImplantedDevice;
    onClose: () => void;
    onUpdateStatus: (deviceId: string, status: ImplantedDeviceStatus) => void;
    onHideDevice: (device: ImplantedDevice) => void;
    isHiding: boolean;
    safetyCheckResult: FourDSafetyValidationResult | null;
}

const tabs = ['Overview', 'Hardware & Comms', 'Console'];

const StatusButton: React.FC<{ onClick: () => void, currentStatus: ImplantedDeviceStatus, targetStatus: ImplantedDeviceStatus, label: string, color: string }> = ({ onClick, currentStatus, targetStatus, label, color }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            currentStatus === targetStatus ? color : 'bg-slate-600 hover:bg-slate-500 text-slate-100'
        }`}
    >
        {label}
    </button>
);

const DeviceDetailModal: React.FC<DeviceDetailModalProps> = ({ device, onClose, onUpdateStatus, onHideDevice, isHiding, safetyCheckResult }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [consoleInput, setConsoleInput] = useState('');
    const [consoleOutput, setConsoleOutput] = useState<string[]>(['> Waiting for command...']);

    const handleConsoleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newOutput = [...consoleOutput, `> ${consoleInput}`];
        if (device.knownCommands.includes(consoleInput.toUpperCase())) {
            newOutput.push(`✅ Command "${consoleInput}" executed successfully.`);
        } else {
            newOutput.push(`❌ Error: Command not recognized. Type 'help' for available commands.`);
            if (consoleInput.toLowerCase() === 'help') {
                newOutput.push(`Available commands: ${device.knownCommands.join(', ')}`);
            }
        }
        setConsoleOutput(newOutput);
        setConsoleInput('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-900/20" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ChipIcon className="w-8 h-8 text-cyan-400" />
                        <div>
                            <h2 className="text-xl font-bold">{device.name}</h2>
                            <p className="text-sm text-slate-400">{device.type}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                </div>

                {/* Main Content */}
                <div className="flex-grow overflow-y-auto p-4">
                    <div className="border-b border-slate-700 mb-4">
                        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                            {tabs.map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`${activeTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'} whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {activeTab === 'Overview' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><BodyIcon className="w-5 h-5 text-purple-400" /> Location</h3>
                                    <p className="text-lg text-slate-200">{device.locationInBody}</p>
                                    <div className="mt-2 text-center p-4 bg-slate-900 rounded-md border border-slate-600">
                                        <BodyIcon className="w-24 h-24 mx-auto text-cyan-500/30" />
                                        <p className="text-xs text-slate-400 mt-1">Simulated In-Body Placement</p>
                                    </div>
                                </div>
                                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5 text-green-400" /> Device Status</h3>
                                    <div className="flex gap-2">
                                        <StatusButton onClick={() => onUpdateStatus(device.id, 'GREENLIST')} currentStatus={device.status} targetStatus="GREENLIST" label="Greenlist" color="bg-green-600 text-white" />
                                        <StatusButton onClick={() => onUpdateStatus(device.id, 'NOMINAL')} currentStatus={device.status} targetStatus="NOMINAL" label="Nominal" color="bg-cyan-600 text-white" />
                                        <StatusButton onClick={() => onUpdateStatus(device.id, 'BLOCKED')} currentStatus={device.status} targetStatus="BLOCKED" label="Block" color="bg-red-600 text-white" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                    <h3 className="font-semibold mb-2 flex items-center gap-2"><EyeSlashIcon className="w-5 h-5 text-orange-400" /> Stealth Mode</h3>
                                    <p className="text-xs text-slate-400 mb-3">Use AI-validated obfuscation to hide this device from network scans. This action requires a 4D Safety validation and is not shared on the P2P network.</p>
                                    <button 
                                        onClick={() => onHideDevice(device)} 
                                        disabled={isHiding || device.status === 'HIDDEN'}
                                        className="w-full bg-gradient-to-r from-orange-600 to-purple-700 hover:from-orange-700 hover:to-purple-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-wait px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                                    >
                                        {device.status === 'HIDDEN' ? 'Stealth Mode Active' : isHiding ? 'AI Validating & Hiding...' : 'Engage Stealth Mode'}
                                    </button>
                                    {safetyCheckResult && (
                                        <div className={`mt-3 p-2 rounded-md border text-xs ${safetyCheckResult.isSafe ? 'bg-green-900/30 border-green-700/50 text-green-300' : 'bg-red-900/30 border-red-700/50 text-red-300'}`}>
                                            <strong className="flex items-center gap-1"><BrainCircuitIcon className="w-4 h-4" /> 4D Validator Result:</strong> {safetyCheckResult.recommendation}
                                        </div>
                                    )}
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                    <h3 className="font-semibold mb-2">Simulated 3D Model</h3>
                                    <div className="mt-2 text-center p-4 bg-slate-900 rounded-md border border-slate-600">
                                        <ChipIcon className="w-24 h-24 mx-auto text-cyan-500/30" />
                                        <p className="text-xs text-slate-400 mt-1">Conceptual Hardware Render</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                     )}
                     {activeTab === 'Hardware & Comms' && (
                        <div className="space-y-4 text-sm">
                             <div className="bg-slate-800/50 p-3 rounded-lg"><strong className="text-slate-400">Firmware:</strong> <span className="text-slate-100 font-mono">{device.firmwareVersion}</span></div>
                             <div className="bg-slate-800/50 p-3 rounded-lg"><strong className="text-slate-400">Protocol:</strong> <span className="text-slate-100 font-mono">{device.protocolLanguage}</span></div>
                             <div className="bg-slate-800/50 p-3 rounded-lg"><strong className="text-slate-400">Mesh Capable:</strong> <span className={`font-semibold ${device.isBleMeshCapable ? 'text-green-400' : 'text-red-400'}`}>{device.isBleMeshCapable ? 'Yes' : 'No'}</span></div>
                             <div>
                                <h4 className="font-semibold mb-2">Hardware Map:</h4>
                                <div className="space-y-2">
                                    {device.hardwareMap.map((comp, i) => <div key={i} className="bg-slate-800 p-2 rounded-md flex justify-between items-center"><span className="text-slate-300">{comp.component}</span><span className={`px-2 py-0.5 text-xs rounded-full ${comp.status === 'NOMINAL' ? 'bg-green-600' : 'bg-yellow-600'}`}>{comp.status}</span></div>)}
                                </div>
                             </div>
                             <div>
                                <h4 className="font-semibold mb-2">Operating Frequencies:</h4>
                                <div className="space-y-2">
                                    {device.frequencies.map((freq, i) => <div key={i} className="bg-slate-800 p-2 rounded-md"><span className="font-semibold text-cyan-300">{freq.band}: </span><span className="text-slate-300">{freq.usage}</span></div>)}
                                </div>
                             </div>
                        </div>
                     )}
                     {activeTab === 'Console' && (
                        <div>
                            <div className="bg-black border border-slate-700 rounded-lg p-2 h-64 overflow-y-auto font-mono text-xs text-green-400 space-y-1">
                                {consoleOutput.map((line, i) => <p key={i}>{line}</p>)}
                            </div>
                            <form onSubmit={handleConsoleSubmit} className="mt-2 flex gap-2">
                                <input type="text" value={consoleInput} onChange={e => setConsoleInput(e.target.value)} className="flex-grow bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100 font-mono text-sm focus:ring-2 focus:ring-cyan-500" placeholder="Enter command..."/>
                                <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 px-4 rounded-md font-semibold">Send</button>
                            </form>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default DeviceDetailModal;
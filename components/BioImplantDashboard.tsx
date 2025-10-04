import React, { useState } from 'react';
import { ChipIcon, BrainCircuitIcon, MeshIcon } from './icons';
import type { ImplantedDevice, P2PNode } from '../types';
import BleMeshNetworkView from './BleMeshNetworkView';

const getStatusColor = (status: ImplantedDevice['status']) => {
    switch (status) {
        case 'NOMINAL': return 'border-cyan-500';
        case 'GREENLIST': return 'border-green-500';
        case 'BLOCKED': return 'border-red-500';
        case 'HIDDEN': return 'border-purple-500';
        default: return 'border-slate-500';
    }
};

interface ImplantedDeviceListProps {
    devices: ImplantedDevice[];
    onSelectDevice: (device: ImplantedDevice) => void;
}

const ImplantedDeviceList: React.FC<ImplantedDeviceListProps> = ({ devices, onSelectDevice }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map(device => (
            <div key={device.id} className={`bg-slate-800/50 rounded-lg p-4 border-l-4 ${getStatusColor(device.status)} flex flex-col justify-between`}>
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg text-slate-100">{device.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            {NOMINAL: 'bg-cyan-600', GREENLIST: 'bg-green-600', BLOCKED: 'bg-red-600', HIDDEN: 'bg-purple-600', UNKNOWN: 'bg-slate-600'}[device.status]
                        }`}>{device.status}</span>
                    </div>
                    <p className="text-sm text-slate-400">{device.type}</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">ID: {device.id}</p>
                </div>
                <button
                    onClick={() => onSelectDevice(device)}
                    className="mt-4 w-full bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-md font-semibold text-sm transition-colors"
                >
                    Inspect Device
                </button>
            </div>
        ))}
    </div>
);


interface BioImplantDashboardProps {
    devices: ImplantedDevice[];
    isScanning: boolean;
    onScan: () => void;
    onSelectDevice: (device: ImplantedDevice) => void;
    p2pNodes: P2PNode[];
}

const BioImplantDashboard: React.FC<BioImplantDashboardProps> = ({ devices, isScanning, onScan, onSelectDevice, p2pNodes }) => {
    const [viewMode, setViewMode] = useState<'list' | 'mesh'>('list');

    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <ChipIcon className="w-10 h-10 text-cyan-400" />
                    <div>
                        <h2 className="text-2xl font-semibold">Personal Bio-Implant Manager</h2>
                        <p className="text-sm text-slate-400">Scan, monitor, and manage your implanted hardware.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                     <div className="bg-slate-900/50 p-1 rounded-lg flex items-center">
                        <button onClick={() => setViewMode('list')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${viewMode === 'list' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>List View</button>
                        <button onClick={() => setViewMode('mesh')} className={`px-3 py-1.5 text-sm font-semibold rounded-md flex items-center gap-1.5 ${viewMode === 'mesh' ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>
                            <MeshIcon className="w-4 h-4" /> Mesh Network
                        </button>
                    </div>
                    <button
                        onClick={onScan}
                        disabled={isScanning}
                        className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-wait px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/50"
                    >
                        <BrainCircuitIcon className="w-5 h-5" />
                        {isScanning ? 'Scanning...' : 'Scan for Implants'}
                    </button>
                </div>
            </div>

            {devices.length === 0 && !isScanning && (
                <div className="text-center py-12 bg-slate-800/30 rounded-lg border-2 border-dashed border-slate-700">
                    <ChipIcon className="w-16 h-16 mx-auto text-slate-600" />
                    <h3 className="mt-2 text-xl font-semibold text-slate-300">No Devices Detected</h3>
                    <p className="mt-1 text-sm text-slate-400">Initiate a scan to discover and manage your personal implants.</p>
                </div>
            )}

            {viewMode === 'list' ? (
                 <ImplantedDeviceList devices={devices} onSelectDevice={onSelectDevice} />
            ) : (
                <BleMeshNetworkView devices={devices} p2pNodes={p2pNodes} />
            )}
        </div>
    );
};

export default BioImplantDashboard;

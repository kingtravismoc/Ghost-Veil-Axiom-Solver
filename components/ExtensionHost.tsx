import React from 'react';
import type { Extension, SystemStatus, ScanMode, ProtectionStrategy, LogType, Wallet, Signal, Threat, P2PNode } from '../types';
import { XIcon } from './icons';

// Import all possible extension components
import SdrPlusPlusExtension from './extensions/SdrPlusPlusExtension';
import BleMeshExtension from './extensions/BleMeshExtension';
import EntropyRngExtension from './extensions/EntropyRngExtension';
import ProjectExporterExtension from './extensions/ProjectExporterExtension';
import SystemIntegrityScannerExtension from './extensions/SystemIntegrityScannerExtension';


// Define the SDK that will be passed to extensions
export interface GhostVeilSdk {
    getSystemState: () => {
        signals: Signal[];
        threats: Threat[];
        isMonitoring: boolean;
        isProtected: boolean;
        p2pNodes: P2PNode[];
        wallet: Wallet | null;
    };
    startScan: (mode: ScanMode) => void;
    stopScan: () => void;
    activateVeil: (strategy: ProtectionStrategy) => void;
    deactivateVeil: () => void;
    addLog: (message: string, type: LogType) => void;
    createApiHook: (channelName: string, callback: (data: any) => any) => () => void;
}

interface ExtensionHostProps {
    extensionId: string;
    system: any; // The whole system state from useSystem
    onClose: () => void;
}

const ExtensionHost: React.FC<ExtensionHostProps> = ({ extensionId, system, onClose }) => {
    
    const activeExtension = system.extensions.find((e: Extension) => e.id === extensionId);

    // The SDK provides a safe, sandboxed interface to the main system hook
    const sdk: GhostVeilSdk = {
        getSystemState: () => ({
            signals: system.signals,
            threats: system.threats,
            isMonitoring: system.isMonitoring,
            isProtected: system.isProtected,
            p2pNodes: system.p2pState.nodes,
            wallet: system.wallet,
        }),
        startScan: (mode: ScanMode) => system.sdrDevilProps.setScanMode(mode) && system.sdrDevilProps.startMonitoring(),
        stopScan: system.sdrDevilProps.stopMonitoring,
        activateVeil: system.sdrDevilProps.activateProtection,
        deactivateVeil: system.sdrDevilProps.deactivateProtection,
        addLog: system.addLog,
        createApiHook: (channelName: string, callback: (data: any) => any) => {
            system.addLog(`Extension "${activeExtension?.name}" created API hook on channel: ${channelName}`, 'SYSTEM');
            const channel = new BroadcastChannel(channelName);
            
            const messageHandler = (event: MessageEvent) => {
                if (event.data.type === 'request') {
                    const result = callback(event.data.payload);
                    channel.postMessage({ type: 'response', payload: result });
                }
            };

            channel.addEventListener('message', messageHandler);

            // Return a cleanup function
            return () => {
                channel.removeEventListener('message', messageHandler);
                channel.close();
                system.addLog(`Extension "${activeExtension?.name}" closed API hook on channel: ${channelName}`, 'SYSTEM');
            };
        }
    };

    const renderExtension = () => {
        switch (extensionId) {
            case 'ext_sdr_devil_core':
                return <SdrPlusPlusExtension sdk={sdk} />;
            case 'ext_ble_mesh':
                return <BleMeshExtension sdk={sdk} />;
            case 'ext_entropy_rng':
                return <EntropyRngExtension sdk={sdk} />;
            case 'ext_project_exporter':
                return <ProjectExporterExtension sdk={sdk} />;
            case 'ext_sys_integrity':
                return <SystemIntegrityScannerExtension sdk={sdk} />;
            default:
                return <div className="p-4 text-red-400">Error: Extension with ID "{extensionId}" not found.</div>;
        }
    };

    if (!activeExtension) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border-2 border-slate-700 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl shadow-cyan-900/40"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex items-center justify-between p-3 border-b border-slate-700 flex-shrink-0 bg-slate-800/50 rounded-t-xl">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        {activeExtension.name}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </header>
                <main className="flex-grow overflow-y-auto">
                    {renderExtension()}
                </main>
            </div>
        </div>
    );
};

export default ExtensionHost;
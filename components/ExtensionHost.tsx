import React, { useState, useEffect, useRef } from 'react';
import type { Extension, SystemStatus, ScanMode, ProtectionStrategy, LogType, Wallet, Signal, Threat, P2PNode, OpenExtensionState } from '../types';
import { XIcon, CubeAltIcon, RadarIcon, UsersIcon, ArrowUpTrayIcon, ShieldCheckIcon } from './icons';

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
    extension: Extension;
    windowState: OpenExtensionState;
    system: any; 
    onClose: () => void;
    onMinimize: () => void;
    onFocus: () => void;
    onUpdate: (id: string, updates: Partial<OpenExtensionState>) => void;
}

const getIconForExt = (iconName: string, className = "w-5 h-5") => {
    switch(iconName) {
        case 'RadarIcon': return <RadarIcon className={className} />;
        case 'UsersIcon': return <UsersIcon className={className} />;
        case 'ArrowUpTrayIcon': return <ArrowUpTrayIcon className={className} />;
        case 'ShieldCheckIcon': return <ShieldCheckIcon className={className} />;
        default: return <CubeAltIcon className={className} />;
    }
}


const ExtensionHost: React.FC<ExtensionHostProps> = ({ extension, windowState, system, onClose, onMinimize, onFocus, onUpdate }) => {
    
    const dragRef = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const lastPos = useRef(windowState.pos);
    const lastSize = useRef(windowState.size);

    const handleDragStart = (e: React.MouseEvent) => {
        if (windowState.windowState === 'maximized') return;
        isDragging.current = true;
        dragRef.current = { x: e.clientX - windowState.pos.x, y: e.clientY - windowState.pos.y };
        onFocus();
    };
    
    const handleMaximizeToggle = () => {
        if (windowState.windowState === 'maximized') {
            onUpdate(extension.id, { windowState: 'open', pos: lastPos.current, size: lastSize.current });
        } else {
            lastPos.current = windowState.pos;
            lastSize.current = windowState.size;
            onUpdate(extension.id, { windowState: 'maximized' });
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging.current) {
                onUpdate(extension.id, {
                    pos: { x: e.clientX - dragRef.current.x, y: e.clientY - dragRef.current.y }
                });
            }
        };
        const handleMouseUp = () => { isDragging.current = false; };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [extension.id, onUpdate]);

    const sdk: GhostVeilSdk = {
        getSystemState: () => ({ signals: system.signals, threats: system.threats, isMonitoring: system.isMonitoring, isProtected: system.isProtected, p2pNodes: system.p2pState.nodes, wallet: system.wallet }),
        startScan: (mode: ScanMode) => system.sdrDevilProps.setScanMode(mode) && system.sdrDevilProps.startMonitoring(),
        stopScan: system.sdrDevilProps.stopMonitoring,
        activateVeil: system.sdrDevilProps.activateProtection,
        deactivateVeil: system.sdrDevilProps.deactivateProtection,
        addLog: system.addLog,
        createApiHook: (channelName: string, callback: (data: any) => any) => {
            system.addLog(`Extension "${extension?.name}" created API hook on channel: ${channelName}`, 'SYSTEM');
            const channel = new BroadcastChannel(channelName);
            const messageHandler = (event: MessageEvent) => { if (event.data.type === 'request') { const result = callback(event.data.payload); channel.postMessage({ type: 'response', payload: result }); } };
            channel.addEventListener('message', messageHandler);
            return () => { channel.removeEventListener('message', messageHandler); channel.close(); system.addLog(`Extension "${extension?.name}" closed API hook on channel: ${channelName}`, 'SYSTEM'); };
        }
    };

    const renderExtension = () => {
        switch (extension.id) {
            case 'ext_sdr_devil_core': return <SdrPlusPlusExtension sdk={sdk} />;
            case 'ext_ble_mesh': return <BleMeshExtension sdk={sdk} />;
            case 'ext_entropy_rng': return <EntropyRngExtension sdk={sdk} />;
            case 'ext_project_exporter': return <ProjectExporterExtension sdk={sdk} />;
            case 'ext_sys_integrity': return <SystemIntegrityScannerExtension sdk={sdk} />;
            default: return <div className="p-4 text-red-400">Error: Extension with ID "{extension.id}" not found.</div>;
        }
    };
    
    const isMaximized = windowState.windowState === 'maximized';
    const styles: React.CSSProperties = isMaximized ? 
        { top: 0, left: 0, width: '100%', height: 'calc(100vh - 3.5rem - 1px)', zIndex: windowState.zIndex, position: 'absolute' } :
        { top: windowState.pos.y, left: windowState.pos.x, width: windowState.size.w, height: windowState.size.h, zIndex: windowState.zIndex, position: 'absolute' };

    return (
        <div style={styles} onMouseDown={onFocus} className="bg-slate-900 border-2 border-slate-700 rounded-lg flex flex-col shadow-2xl shadow-cyan-900/40 resize overflow-hidden">
            <header onMouseDown={handleDragStart} onDoubleClick={handleMaximizeToggle} className="flex items-center justify-between p-2 pr-1 border-b border-slate-700 flex-shrink-0 bg-slate-800/50 cursor-move">
                <h2 className="text-sm font-bold flex items-center gap-2 select-none">
                    {getIconForExt(extension.icon, "w-4 h-4")} {extension.name}
                </h2>
                <div className="flex items-center gap-1 cursor-default">
                    <button onClick={onMinimize} className="p-1.5 rounded hover:bg-slate-700"><span className="w-3 h-0.5 bg-white block"></span></button>
                    <button onClick={handleMaximizeToggle} className="p-1.5 rounded hover:bg-slate-700"><span className="w-3 h-3 border border-white block"></span></button>
                    <button onClick={onClose} className="p-1.5 rounded hover:bg-red-500"><XIcon className="w-3 h-3" /></button>
                </div>
            </header>
            <main className="flex-grow overflow-y-auto">
                {renderExtension()}
            </main>
        </div>
    );
};

export default ExtensionHost;

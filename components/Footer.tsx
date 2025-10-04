import React, { useState } from 'react';
import type { LogEntry, LogType, ActiveOperation, Extension, OpenExtensionState } from '../types';
import { TerminalIcon, ChevronUpIcon, ChevronDownIcon, CubeAltIcon, RadarIcon, UsersIcon, ArrowUpTrayIcon, ShieldCheckIcon } from './icons';

const getLogTypeClass = (type: LogType): string => {
    switch (type) {
        case 'SYSTEM': return 'text-cyan-400';
        case 'AI': return 'text-purple-400';
        case 'NETWORK': return 'text-green-400';
        case 'WARN': return 'text-yellow-400';
        case 'ERROR': return 'text-red-500';
        default: return 'text-slate-300';
    }
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

interface FooterProps {
    logEntries: LogEntry[];
    operations: ActiveOperation[];
    openExtensions: OpenExtensionState[];
    allExtensions: Extension[];
    onLaunchExtension: (extensionId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ logEntries, operations, openExtensions, allExtensions, onLaunchExtension }) => {
    const [isConsoleExpanded, setIsConsoleExpanded] = useState(false);
    const recentLogs = logEntries.slice(-1);

    return (
        <footer className={`fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm border-t border-slate-700 text-slate-300 text-sm z-50 transition-all duration-300 ${isConsoleExpanded ? 'h-64' : 'h-14'}`}>
            <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 h-14 flex-shrink-0">
                    {/* Left: Taskbar for open extensions */}
                    <div className="flex items-center gap-2">
                         <span className="text-xs font-semibold text-slate-400 pr-2 border-r border-slate-700">APPS</span>
                         {openExtensions.map(openExt => {
                             const extDetails = allExtensions.find(e => e.id === openExt.id);
                             if (!extDetails) return null;
                             const isMinimized = openExt.windowState === 'minimized';
                             return (
                                 <button
                                    key={extDetails.id}
                                    onClick={() => onLaunchExtension(extDetails.id)}
                                    title={extDetails.name}
                                    className={`p-2 rounded-md transition-colors relative ${isMinimized ? 'bg-slate-700 hover:bg-slate-600' : 'bg-cyan-600/30 hover:bg-cyan-600/50'}`}
                                >
                                    {getIconForExt(extDetails.icon, "w-6 h-6")}
                                    {!isMinimized && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-cyan-400 rounded-t-full"></div>}
                                 </button>
                             );
                         })}
                    </div>

                    {/* Middle: Operations */}
                    <div className="flex-grow px-4 h-full flex items-center gap-4 overflow-x-auto">
                        {operations.map(op => (
                            <div key={op.id} className="flex items-center gap-2 flex-shrink-0 w-48">
                                <span className="text-xs text-slate-400 truncate">{op.name}</span>
                                <div className="w-full bg-slate-700 rounded-full h-1.5 flex-grow">
                                    <div className="bg-cyan-500 h-1.5 rounded-full" style={{width: `${op.progress}%`}}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right: Console Toggle */}
                    <div className="flex items-center gap-3">
                         <div className="text-right">
                             {recentLogs.map(entry => (
                                 <p key={entry.id} className="text-xs font-mono truncate max-w-xs">
                                     <span className={`${getLogTypeClass(entry.type)}`}>[{entry.type}]</span>
                                     <span className="text-slate-300 ml-2">{entry.message}</span>
                                 </p>
                             ))}
                         </div>
                         <button onClick={() => setIsConsoleExpanded(!isConsoleExpanded)} className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-md transition-colors">
                             {isConsoleExpanded ? <ChevronDownIcon className="w-5 h-5"/> : <ChevronUpIcon className="w-5 h-5"/>}
                         </button>
                    </div>
                </div>

                {/* Expanded Console View */}
                {isConsoleExpanded && (
                    <div className="flex-grow bg-slate-900/50 p-4 overflow-y-auto">
                         <div className="space-y-1.5 font-mono text-xs">
                            {logEntries.length === 0 && (
                                <p className="text-slate-500">Log empty.</p>
                            )}
                            {logEntries.slice().reverse().map(entry => (
                                <div key={entry.id} className="flex gap-2 items-start">
                                    <span className="text-slate-500 flex-shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                                    <span className={`${getLogTypeClass(entry.type)} flex-shrink-0`}>[{entry.type}]</span>
                                    <p className="text-slate-300 break-words">{entry.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </footer>
    );
};

export default Footer;

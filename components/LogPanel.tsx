
import React from 'react';
import { TerminalIcon } from './icons';
import type { LogEntry, LogType } from '../types';

interface LogPanelProps {
    logEntries: LogEntry[];
}

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

const LogPanel: React.FC<LogPanelProps> = ({ logEntries }) => {
    return (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-slate-300">
                <TerminalIcon className="w-5 h-5" />
                System Operations Log
            </h2>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2 bg-slate-900/50 p-2 rounded-md font-mono text-xs">
                {logEntries.length === 0 && (
                    <p className="text-slate-500">Log empty. Initialize system operations.</p>
                )}
                {logEntries.map(entry => (
                    <div key={entry.id} className="flex gap-2 items-start">
                        <span className="text-slate-500 flex-shrink-0">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                        <span className={`${getLogTypeClass(entry.type)} flex-shrink-0`}>[{entry.type}]</span>
                        <p className="text-slate-300 break-words">{entry.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogPanel;

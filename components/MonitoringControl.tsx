
import React from 'react';
import { PlayIcon, StopIcon, ActivityIcon } from './icons';

interface MonitoringControlProps {
    isMonitoring: boolean;
    isLoading: boolean;
    startMonitoring: () => void;
    stopMonitoring: () => void;
}

const MonitoringControl: React.FC<MonitoringControlProps> = ({ isMonitoring, isLoading, startMonitoring, stopMonitoring }) => {
    const actionText = isLoading ? 'Processing...' : isMonitoring ? 'Stop Scan' : 'Start Scan';

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <ActivityIcon className="w-5 h-5 text-cyan-400" />
                Unified Signal Monitoring
            </h2>
            <div className="flex gap-4">
                <button
                    onClick={isMonitoring ? stopMonitoring : startMonitoring}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-900/50"
                >
                    {isMonitoring ? <StopIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    {actionText}
                </button>
            </div>
        </div>
    );
};

export default MonitoringControl;

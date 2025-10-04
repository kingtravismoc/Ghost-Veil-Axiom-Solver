
import React from 'react';
import { PowerIcon, TargetIcon } from './icons';
import type { SystemStatus } from '../types';

interface MasterControlProps {
    status: SystemStatus;
    setStatus: (status: SystemStatus) => void;
    onOpenTriggers: () => void;
}

const MasterControl: React.FC<MasterControlProps> = ({ status, setStatus, onOpenTriggers }) => {
    const isSystemOn = status !== 'OFF';

    const handleToggle = () => {
        if (isSystemOn) {
            setStatus('OFF');
        } else {
            // Default to active monitoring when turning on
            setStatus('ACTIVE_MONITORING');
        }
    };

    return (
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 border border-slate-700 rounded-lg">
            <button
                onClick={handleToggle}
                title={isSystemOn ? "Deactivate System" : "Activate System"}
                className={`p-2 rounded-md transition-colors duration-200 ${
                    isSystemOn 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
            >
                <PowerIcon className="w-5 h-5" />
            </button>
            <button
                onClick={onOpenTriggers}
                disabled={!isSystemOn}
                title="Configure Triggers"
                className="p-2 rounded-md transition-colors duration-200 bg-slate-700 hover:bg-slate-600 text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <TargetIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default MasterControl;

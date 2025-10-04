
import React from 'react';
import { ShieldIcon, GhostIcon } from './icons';

interface ProtectionControlProps {
    isProtected: boolean;
    isLoading: boolean;
    canActivate: boolean;
    activateProtection: () => void;
    deactivateProtection: () => void;
}

const ProtectionControl: React.FC<ProtectionControlProps> = ({
    isProtected,
    isLoading,
    canActivate,
    activateProtection,
    deactivateProtection
}) => {
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <GhostIcon className="w-6 h-6 text-green-400" />
                Ghost Veil Protection
            </h2>
            <div className="space-y-3">
                <button
                    onClick={activateProtection}
                    disabled={isProtected || isLoading || !canActivate}
                    className="w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-green-900/50"
                >
                    <ShieldIcon className="w-5 h-5" />
                    {isLoading && !isProtected ? 'Engaging...' : 'Activate Veil'}
                </button>
                <button
                    onClick={deactivateProtection}
                    disabled={!isProtected || isLoading}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                >
                    Disengage
                </button>
            </div>
            {!canActivate && !isProtected && (
                 <p className="text-xs text-slate-400 mt-3 text-center">Run a scan and detect threats to enable protection.</p>
            )}
        </div>
    );
};

export default ProtectionControl;

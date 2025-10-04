import React from 'react';
import { ZapIcon, ShieldCheckIcon, BrainCircuitIcon } from './icons';
import { InfoTooltip } from './icons';
import type { FourDSafetyValidationResult } from '../types';

interface SystemPersistenceControlProps {
    isDeployed: boolean;
    isDeploying: boolean;
    onDeploy: () => void;
    isSafetyValidating: boolean;
    safetyCheckResult: FourDSafetyValidationResult | null;
}

const SystemPersistenceControl: React.FC<SystemPersistenceControlProps> = ({ isDeployed, isDeploying, onDeploy, isSafetyValidating, safetyCheckResult }) => {
    
    const isBusy = isDeploying || isSafetyValidating;
    let buttonText = "Deploy Always-On Agent";
    if (isSafetyValidating) buttonText = "4D Safety Validation...";
    if (isDeploying) buttonText = "Deploying...";

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ZapIcon className="w-6 h-6 text-orange-400" />
                System Persistence
                <InfoTooltip text="Deploys a simulated background agent that continues to monitor for threats even when this UI is closed. This action requires safety validation to ensure it doesn't conflict with system resources." />
            </h2>
             <p className="text-xs text-slate-400">
                Deploy a persistent, always-on agent to the host system's cache. This simulated daemon allows for continuous background monitoring and threat response, even when the interface is closed.
            </p>

            <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700 text-center">
                {isDeployed ? (
                    <div className="flex flex-col items-center justify-center text-green-400">
                        <ShieldCheckIcon className="w-10 h-10 mb-2" />
                        <h3 className="font-bold">AGENT DEPLOYED</h3>
                        <p className="text-xs text-slate-300 font-mono animate-pulse">Daemon active in simulated sandbox.</p>
                    </div>
                ) : (
                    <button
                        onClick={onDeploy}
                        disabled={isBusy}
                        className="w-full bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-wait px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-red-900/50"
                    >
                        {buttonText}
                    </button>
                )}
                 {safetyCheckResult && !isDeployed &&(
                    <div className={`mt-3 p-2 rounded-md border text-xs ${safetyCheckResult.isSafe ? 'bg-green-900/30 border-green-700/50 text-green-300' : 'bg-red-900/30 border-red-700/50 text-red-300'}`}>
                        <strong className="flex items-center gap-1 justify-center"><BrainCircuitIcon className="w-4 h-4" /> 4D Validator Result:</strong> {safetyCheckResult.recommendation}
                    </div>
                )}
                 <div className="text-[10px] text-slate-500 font-mono mt-3">
                    Target (simulated): {navigator.userAgent.includes("iPhone") ? '/private/tmp/ghost_veil' : '/tmp/var/ghost_veil'}
                </div>
            </div>
        </div>
    );
};

export default SystemPersistenceControl;
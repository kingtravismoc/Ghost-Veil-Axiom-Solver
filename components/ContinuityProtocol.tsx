
import React from 'react';
import { ShieldCheckIcon } from './icons';
import type { Sentinel } from '../types';

interface ContinuityProtocolProps {
    sentinels: Sentinel[];
    doomsdayActive: boolean;
}

const SentinelStatusIndicator: React.FC<{ status: Sentinel['status'] }> = ({ status }) => {
    const statusConfig = {
        OFFLINE: { text: 'OFFLINE', color: 'bg-slate-500' },
        AWAITING_CHECK: { text: 'AWAITING', color: 'bg-yellow-500' },
        VALIDATING: { text: 'VALIDATING', color: 'bg-cyan-500 animate-pulse' },
        SECURE: { text: 'SECURE', color: 'bg-green-500' },
    };
    const { text, color } = statusConfig[status];
    return (
        <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
            <span className="text-xs font-semibold">{text}</span>
        </div>
    );
};

const ContinuityProtocol: React.FC<ContinuityProtocolProps> = ({ sentinels, doomsdayActive }) => {
    return (
        <div className={`bg-slate-800/50 rounded-lg p-6 border ${doomsdayActive ? 'border-red-500 animate-pulse' : 'border-slate-700'} quantum-shield space-y-4 transition-colors`}>
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-indigo-400" />
                Axiom Continuity Protocol
            </h2>

            <p className="text-xs text-slate-400">
                A failsafe override requiring 3 consecutive hourly validations from 3 secure, geographically distinct Sentinels. This protocol bypasses P2P consensus to counter existential threats when the network is compromised or blocked.
            </p>
            
            <div className="space-y-3">
                {sentinels.map(sentinel => (
                    <div key={sentinel.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-sm font-semibold text-slate-200">{sentinel.location}</h3>
                            <SentinelStatusIndicator status={sentinel.status} />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-700 rounded-full h-2.5">
                                 <div
                                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${(sentinel.validationCount / sentinel.maxValidations) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-xs font-mono text-purple-300">{sentinel.validationCount}/{sentinel.maxValidations}</span>
                        </div>
                         <div className="text-[10px] text-slate-500 font-mono mt-1.5 flex justify-between">
                            <span>MACHINE ID: {sentinel.machineId}</span>
                            <span>IMPLANT: {sentinel.implantSerial}</span>
                        </div>
                    </div>
                ))}
            </div>

            {doomsdayActive && (
                 <div className="p-3 bg-red-900/50 border-2 border-red-500 rounded-lg text-center">
                    <h3 className="font-bold text-red-300">PROTOCOL ACTIVATED: NETWORK OVERRIDE ENGAGED</h3>
                </div>
            )}
        </div>
    );
};

export default ContinuityProtocol;
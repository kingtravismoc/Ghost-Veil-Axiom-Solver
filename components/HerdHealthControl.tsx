
import React from 'react';
import { UsersIcon, BrainCircuitIcon } from './icons';
import type { P2PNode, MacroThreat } from '../types';

interface HerdHealthControlProps {
    isActive: boolean;
    onToggle: (isActive: boolean) => void;
    nodes: P2PNode[];
    macroThreat: MacroThreat | null;
}

const HerdHealthControl: React.FC<HerdHealthControlProps> = ({ isActive, onToggle, nodes, macroThreat }) => {
    
    const activePeers = nodes.filter(n => n.id !== 'self_node' && n.status !== 'OFFLINE').length;
    const totalPeers = nodes.length - 1;

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <UsersIcon className="w-6 h-6 text-purple-400" />
                Herd Health Protocol
            </h2>

            <div className="bg-slate-900/40 rounded-lg p-4 border border-slate-700">
                 <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="herd-health-toggle"
                        checked={isActive}
                        onChange={(e) => onToggle(e.target.checked)}
                        className="h-5 w-5 rounded border-slate-500 bg-slate-700 text-cyan-500 focus:ring-cyan-600 cursor-pointer"
                    />
                    <label htmlFor="herd-health-toggle" className="text-md font-medium text-slate-100 cursor-pointer">
                        Improve Herd Health, Run as Node
                    </label>
                </div>
                <p className="text-xs text-slate-400 mt-2 pl-8">
                    By enabling this, your node joins the P2P Axiom Network. It helps form a decentralized consensus to identify and overpower harmful transmissions, mass-canceling subversive signals or brainwave modification networks that threaten global cognitive liberty.
                </p>
            </div>
            
            {isActive ? (
                <>
                    <div className="text-center text-sm font-semibold text-green-400 animate-pulse">
                        You are participating in the P2P Network.
                    </div>
                     <div className="text-xs text-center text-slate-300 font-mono">
                        {activePeers} / {totalPeers} Peers Online
                    </div>
                </>

            ) : (
                 <div className="text-center text-sm text-slate-400">
                    P2P Network participation is disabled.
                </div>
            )}

            {isActive && macroThreat && (
                <div className="p-3 bg-red-900/30 border border-red-500 rounded-lg text-center animate-pulse">
                    <h3 className="font-bold text-red-300 flex items-center justify-center gap-2"><BrainCircuitIcon className="w-4 h-4" /> Network Consensus: Macro-Threat Detected!</h3>
                    <p className="text-sm font-semibold text-white">{macroThreat.name}</p>
                    <p className="text-xs text-slate-300">{macroThreat.objective} ({macroThreat.scope})</p>
                    <p className="text-xs font-mono text-red-300">Confidence: {(macroThreat.confidence * 100).toFixed(0)}%</p>
                </div>
            )}
        </div>
    );
};

export default HerdHealthControl;

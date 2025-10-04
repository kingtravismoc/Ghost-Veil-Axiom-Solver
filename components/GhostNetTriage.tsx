import React from 'react';
import { UsersIcon, BrainCircuitIcon } from './icons';
import type { P2PNode, MacroThreat } from '../types';

interface P2PNetworkTriageProps {
    nodes: P2PNode[];
    selectedNodeIds: string[];
    onNodeSelect: (nodeId: string) => void;
    macroThreat: MacroThreat | null;
}

const nodePositions = [
    { x: 50, y: 50 }, // Center (Self)
    { x: 20, y: 25 }, { x: 80, y: 25 }, { x: 25, y: 75 },
    { x: 75, y: 75 }, { x: 50, y: 15 }, { x: 50, y: 85 },
    { x: 15, y: 50 }, { x: 85, y: 50 }, { x: 35, y: 35 },
    { x: 65, y: 65 },
];

const P2PNetworkTriage: React.FC<P2PNetworkTriageProps> = ({ nodes, selectedNodeIds, onNodeSelect, macroThreat }) => {
    
    const selfNodeIndex = nodes.findIndex(n => n.id === 'self_node');
    const selfPos = selfNodeIndex !== -1 ? nodePositions[selfNodeIndex % nodePositions.length] : { x: 50, y: 50 };
    const activePeers = nodes.filter(n => n.id !== 'self_node' && n.status !== 'OFFLINE').length;
    const totalPeers = nodes.length - 1;


    const getNodeDisplay = (node: P2PNode, index: number) => {
        const isSelected = selectedNodeIds.includes(node.id);
        const hasThreat = node.status === 'THREAT_DETECTED';
        const isSelf = node.id === 'self_node';

        let color = 'fill-cyan-400';
        let strokeColor = 'stroke-cyan-600';
        let pulseClass = '';
        
        if (isSelf) {
            color = hasThreat ? 'fill-red-500' : 'fill-green-400';
            strokeColor = hasThreat ? 'stroke-red-700' : 'stroke-green-600';
            if (hasThreat) pulseClass = 'animate-pulse';
        } else if (hasThreat) {
            color = 'fill-red-500'; strokeColor = 'stroke-red-700';
            pulseClass = 'animate-pulse';
        } else if (node.status === 'OFFLINE') {
            color = 'fill-slate-600'; strokeColor = 'stroke-slate-700';
        }

        const pos = nodePositions[index % nodePositions.length];

        return (
            <g key={node.id} className="cursor-pointer group" onClick={() => !isSelf && node.status !== 'OFFLINE' && onNodeSelect(node.id)}>
                <title>{node.alias} - {node.status}</title>
                {!isSelf && <line x1={pos.x} y1={pos.y} x2={selfPos.x} y2={selfPos.y} className="stroke-slate-700 group-hover:stroke-cyan-400 transition-colors" strokeWidth="0.5"/>}
                <circle cx={pos.x} cy={pos.y} r={isSelected ? 6 : 4} className={`${color} ${strokeColor} transition-all duration-300 group-hover:stroke-white`} strokeWidth={isSelected ? 2 : 1.5} />
                <circle cx={pos.x} cy={pos.y} r="8" className={`${strokeColor} fill-transparent ${pulseClass}`} strokeWidth="0.5" style={{ animationDuration: '2s' }} />
                <text x={pos.x} y={pos.y + 12} className="text-[6px] fill-slate-300 text-anchor-middle" textAnchor="middle">{node.alias}</text>
            </g>
        )
    }

    return (
        <StandardCard title="P2P Axiom Network" icon={<UsersIcon className="w-5 h-5 text-purple-400" />} className="flex-grow">
            <div className="flex flex-col h-full">
                <div className="relative w-full aspect-[4/3] bg-slate-900 rounded-lg overflow-hidden border border-slate-700 p-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <defs>
                            <pattern id="smallGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="0.5"/>
                            </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#smallGrid)" />
                        <circle cx={selfPos.x} cy={selfPos.y} r="25" fill="none" stroke="rgba(51, 65, 85, 0.7)" strokeWidth="0.5" strokeDasharray="2 2" />
                        <circle cx={selfPos.x} cy={selfPos.y} r="45" fill="none" stroke="rgba(51, 65, 85, 0.7)" strokeWidth="0.5" strokeDasharray="2 2" />
                        {nodes.map(getNodeDisplay)}
                    </svg>
                </div>
                
                 <div className="text-center text-xs text-slate-300 font-mono mt-2">
                        {activePeers} / {totalPeers} Peers Online
                </div>

                {macroThreat ? (
                    <div className="mt-2 p-2 bg-red-900/30 border border-red-500 rounded-lg text-center animate-pulse">
                        <h3 className="font-bold text-red-300 text-xs flex items-center justify-center gap-1"><BrainCircuitIcon className="w-4 h-4" /> Macro-Threat Detected!</h3>
                        <p className="text-xs font-semibold text-white">{macroThreat.name}</p>
                    </div>
                ) : (
                    <p className="text-xs text-slate-400 text-center mt-2">
                        {selectedNodeIds.length > 0 
                            ? `${selectedNodeIds.length} peer(s) selected.`
                            : "Network nominal. No macro-threats."
                        }
                    </p>
                )}
            </div>
        </StandardCard>
    );
};

// Re-export StandardCard for local use
const StandardCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}> = ({ title, icon, children, className = '' }) => (
    <div className={`bg-slate-800/50 rounded-lg border border-slate-700 flex flex-col ${className}`}>
        <h2 className="text-lg font-semibold flex items-center gap-2 p-4 border-b border-slate-700 text-slate-300 flex-shrink-0">
            {icon}
            {title}
        </h2>
        <div className="p-4 flex-grow overflow-y-auto">
            {children}
        </div>
    </div>
);


export default P2PNetworkTriage;
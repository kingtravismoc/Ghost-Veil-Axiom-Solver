import React from 'react';
import { MeshIcon, ChipIcon, UsersIcon } from './icons';
import type { ImplantedDevice, P2PNode } from '../types';

interface BleMeshNetworkViewProps {
    devices: ImplantedDevice[];
    p2pNodes: P2PNode[];
}

const getNodeStatusColor = (status: ImplantedDevice['status']): string => {
    switch (status) {
        case 'NOMINAL': return 'fill-cyan-400 stroke-cyan-600';
        case 'GREENLIST': return 'fill-green-400 stroke-green-600';
        case 'BLOCKED': return 'fill-red-400 stroke-red-600 animate-pulse';
        case 'HIDDEN': return 'fill-purple-400 stroke-purple-600';
        default: return 'fill-slate-500 stroke-slate-600';
    }
};

const BleMeshNetworkView: React.FC<BleMeshNetworkViewProps> = ({ devices, p2pNodes }) => {
    const meshDevices = devices.filter(d => d.isBleMeshCapable);
    
    // Simple positioning logic
    const positions = meshDevices.map((_, index) => ({
        x: 15 + (index % 5) * 17.5,
        y: 20 + Math.floor(index / 5) * 25,
    }));

    const otherOperators = p2pNodes.filter(n => n.id !== 'self_node' && n.status !== 'OFFLINE').slice(0, 4);
    const operatorPositions = [
        { x: 10, y: 10 }, { x: 90, y: 10 }, { x: 10, y: 90 }, { x: 90, y: 90 }
    ];

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <MeshIcon className="w-6 h-6 text-purple-400" />
                BLE Mesh Network View
            </h2>
            <p className="text-xs text-slate-400">
                Visualizing local mesh-capable devices and other P2P operators in the vicinity. Device privacy settings are respected; only non-hidden devices are shown.
            </p>
            <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-700 p-2">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <defs>
                        <pattern id="meshGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(51, 65, 85, 0.5)" strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100" height="100" fill="url(#meshGrid)" />

                    {/* Draw mesh lines */}
                    {positions.map((pos1, i1) => (
                         positions.slice(i1 + 1).map((pos2, i2) => (
                            <line key={`${i1}-${i2}`} x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y} className="stroke-purple-500/20" strokeWidth="0.5"/>
                         ))
                    ))}
                    
                    {/* Draw devices */}
                    {meshDevices.map((device, index) => (
                        <g key={device.id} className="group">
                             <title>{device.name} - {device.status}</title>
                             <circle cx={positions[index].x} cy={positions[index].y} r="4" className={getNodeStatusColor(device.status)} strokeWidth="1.5" />
                             <text x={positions[index].x} y={positions[index].y + 8} className="text-[5px] fill-slate-300 text-anchor-middle" textAnchor="middle">{device.name}</text>
                        </g>
                    ))}
                    
                    {/* Draw other operators */}
                    {otherOperators.map((operator, index) => (
                         <g key={operator.id} className="group">
                            <title>Operator: {operator.alias}</title>
                            <circle cx={operatorPositions[index].x} cy={operatorPositions[index].y} r="3" className="fill-green-500/50 stroke-green-400" strokeWidth="1" />
                             <text x={operatorPositions[index].x} y={operatorPositions[index].y - 5} className="text-[5px] fill-slate-400 text-anchor-middle" textAnchor="middle">{operator.alias}</text>
                        </g>
                    ))}

                </svg>
                 {meshDevices.length === 0 && (
                     <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-slate-500 text-center">No active mesh-capable devices found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BleMeshNetworkView;

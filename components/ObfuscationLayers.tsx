
import React from 'react';
import type { ObfuscationLayer } from '../types';
import { ShieldIcon } from './icons';

interface ObfuscationLayersProps {
    layers: ObfuscationLayer[];
    isProtected: boolean;
    isWaveMaskActive: boolean;
}

const ObfuscationLayers: React.FC<ObfuscationLayersProps> = ({ layers, isProtected, isWaveMaskActive }) => {
    if (!isProtected || layers.length === 0) return null;

    return (
        <div className={`bg-gradient-to-br from-green-900/50 via-purple-900/50 to-blue-900/50 rounded-lg p-6 border border-green-500 ${isWaveMaskActive ? 'spectral-pulse' : ''}`}>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-300">
                <ShieldIcon className="w-6 h-6" />
                Active Obfuscation Layers
            </h2>
            <div className="grid grid-cols-1 gap-3">
                {layers.map((layer, index) => (
                    <div key={index} className="bg-slate-800/60 p-3 rounded-lg border border-green-400/30">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-semibold text-slate-100 text-sm">{layer.name}</h3>
                            <div className="px-2 py-0.5 bg-green-600 rounded text-xs font-semibold">{layer.status}</div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">{layer.type.replace(/_/g, ' ')}</span>
                            <span className="text-green-400 font-mono">{(layer.effectiveness * 100).toFixed(1)}% Effective</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ObfuscationLayers;

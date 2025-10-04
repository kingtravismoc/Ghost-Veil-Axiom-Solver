import React from 'react';
import { CodeBracketIcon } from './icons';
import type { FunctionProtocol, Wallet } from '../types';

const FunctionCard: React.FC<{ protocol: FunctionProtocol, wallet: Wallet | null }> = ({ protocol, wallet }) => {
    
    const isAvailable = protocol.status === 'AVAILABLE';

    const handleApiCall = () => {
        // This is a simulation
        if (!wallet || wallet.balance < protocol.costPerCall) {
            alert("API Call Failed: Insufficient VLT balance.");
            return;
        }
        alert(`Simulating API call to ${protocol.name}.\nCost: ${protocol.costPerCall} VLT.\n\nNote: Balance is not actually deducted in this simulation.`);
    };

    return (
        <div className={`bg-slate-800/50 rounded-lg p-6 border border-slate-700 flex flex-col justify-between ${!isAvailable ? 'opacity-50' : ''}`}>
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xl text-slate-100">{protocol.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${isAvailable ? 'bg-green-600' : 'bg-yellow-600'}`}>{protocol.status.replace('_', ' ')}</span>
                </div>
                <p className="text-sm text-slate-300 my-3">{protocol.description}</p>
            </div>
            <div className="mt-4 space-y-3">
                <div className="text-xs p-2 bg-slate-900 rounded-md">
                    <p className="text-slate-400">SDK Integration:</p>
                    <p className="font-mono text-purple-300">{protocol.sdkIntegration}</p>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">Cost per Call: <span className="font-mono text-cyan-300">{protocol.costPerCall.toFixed(2)} VLT</span></span>
                    <button 
                        onClick={handleApiCall}
                        disabled={!isAvailable}
                        className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded-md font-semibold text-sm disabled:bg-slate-600 disabled:cursor-not-allowed"
                    >
                        Simulate API Call
                    </button>
                </div>
            </div>
        </div>
    );
};

interface FunctionsDashboardProps {
    protocols: FunctionProtocol[];
    wallet: Wallet | null;
}

const FunctionsDashboard: React.FC<FunctionsDashboardProps> = ({ protocols, wallet }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <CodeBracketIcon className="w-10 h-10 text-purple-400" />
                <div>
                    <h2 className="text-3xl font-bold">Functions Marketplace</h2>
                    <p className="text-slate-400">Proprietary, high-level services built upon the Ghost Veil P2P network.</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {protocols.filter(p => p.author === 'GHOST_VEIL').map(proto => (
                    <FunctionCard key={proto.id} protocol={proto} wallet={wallet} />
                ))}
            </div>
             <div>
                <h3 className="text-2xl font-semibold mt-8 border-b border-slate-700 pb-2 mb-4">Community Protocols</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {protocols.filter(p => p.author === 'USER' && p.reviewStatus === 'APPROVED').map(proto => (
                        <FunctionCard key={proto.id} protocol={proto} wallet={wallet} />
                    ))}
                    {protocols.filter(p => p.author === 'USER' && p.reviewStatus === 'APPROVED').length === 0 && (
                        <p className="text-slate-500 md:col-span-2 text-center py-8">No community-created function protocols have been approved yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FunctionsDashboard;

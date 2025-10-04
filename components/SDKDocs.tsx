import React from 'react';
import type { SDKEndpoint } from '../types';

const sdkEndpoints: SDKEndpoint[] = [
    {
        name: 'startScan',
        description: 'Initiates a signal scan using one of the available modes.',
        parameters: [{ name: 'mode', type: "'WIDEBAND_SWEEP' | 'ANOMALY_SCAN' | 'PASSIVE_INTERCEPT'", description: 'The desired scan mode.'}],
        returns: 'void'
    },
    {
        name: 'stopScan',
        description: 'Stops any active signal scan.',
        parameters: [],
        returns: 'void'
    },
    {
        name: 'activateVeil',
        description: 'Activates the Ghost Veil protection using a specific strategy.',
        parameters: [{ name: 'strategy', type: "'QUANTUM_NOISE' | 'DYNAMIC_MIMICRY' | 'DECENTRALIZED_OBFUSCATION'", description: 'The protection strategy to engage.'}],
        returns: 'void'
    },
    {
        name: 'deactivateVeil',
        description: 'Deactivates the Ghost Veil protection.',
        parameters: [],
        returns: 'void'
    },
    {
        name: 'getThreats',
        description: 'Returns an array of all currently detected threats.',
        parameters: [],
        returns: 'Threat[]'
    },
     {
        name: 'getSignals',
        description: 'Returns an array of the most recent signals.',
        parameters: [],
        returns: 'Signal[]'
    },
    {
        name: 'addLog',
        description: 'Adds a custom message to the system operations log.',
        parameters: [{name: 'message', type: 'string', description: 'The log message.'}, {name: 'type', type: 'LogType', description: 'The log level (e.g., INFO, WARN).'}],
        returns: 'void'
    }
];

const SDKEndpointCard: React.FC<{ endpoint: SDKEndpoint }> = ({ endpoint }) => (
    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
        <h4 className="text-lg font-bold text-cyan-300 font-mono">{endpoint.name}</h4>
        <p className="text-sm text-slate-300 mt-1">{endpoint.description}</p>
        <div className="mt-3 space-y-2">
            {endpoint.parameters.length > 0 && (
                 <div>
                    <h5 className="text-xs font-semibold text-slate-400">PARAMETERS</h5>
                    {endpoint.parameters.map(p => (
                         <div key={p.name} className="font-mono text-xs p-2 bg-slate-900 rounded mt-1">
                             <span className="text-purple-300">{p.name}</span>: <span className="text-yellow-300">{p.type}</span>
                             <p className="text-slate-400 font-sans text-xs italic mt-0.5">- {p.description}</p>
                         </div>
                    ))}
                 </div>
            )}
             <div>
                <h5 className="text-xs font-semibold text-slate-400">RETURNS</h5>
                 <div className="font-mono text-xs p-2 bg-slate-900 rounded mt-1">
                    <span className="text-yellow-300">{endpoint.returns}</span>
                 </div>
             </div>
        </div>
    </div>
);

const SDKDocs: React.FC = () => {
    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold">Ghost Veil SDK Documentation</h3>
            <p className="text-slate-400">
                Leverage the core functionalities of the Ghost Veil Protocol by calling these endpoints from within your extension's sandboxed environment.
            </p>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h4 className="text-lg font-semibold text-slate-200">Smart Contracts with AxiomScript</h4>
                <p className="text-sm text-slate-400 mt-1">
                    All extensions submitted to the store are provisioned as NFTs on the Ghost Veil private ledger. This is handled automatically on submission via a smart contract written in <strong>AxiomScript</strong>, our proprietary, sandboxed, Solana-compatible scripting language designed for RF and signal integrity operations. This ensures verifiable ownership and transparent distribution for all extensions on the platform.
                </p>
            </div>
            <div className="space-y-3">
                {sdkEndpoints.map(endpoint => (
                    <SDKEndpointCard key={endpoint.name} endpoint={endpoint} />
                ))}
            </div>
        </div>
    );
};

export default SDKDocs;
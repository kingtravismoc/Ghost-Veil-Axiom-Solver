import React, { useState } from 'react';
import { XIcon, PlusIcon } from './icons';

interface AddNetworkModalProps {
    onClose: () => void;
    onAdd: (name: string) => void;
}

const AddNetworkModal: React.FC<AddNetworkModalProps> = ({ onClose, onAdd }) => {
    const [networkName, setNetworkName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!networkName.trim()) return;
        onAdd(networkName);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-cyan-900/20"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <PlusIcon className="w-6 h-6" />
                        Add Custom Network
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-slate-400">Create a new, isolated P2P network layer. This network will only be visible to you unless shared with other operators.</p>
                    
                    <div>
                        <label htmlFor="network-name" className="block text-xs font-medium text-slate-300 mb-1">
                            Network Name
                        </label>
                        <input
                            id="network-name"
                            type="text"
                            value={networkName}
                            onChange={e => setNetworkName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500"
                            placeholder="e.g., Private Research Net"
                            required
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:opacity-50 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                        disabled={!networkName.trim()}
                    >
                        Create Network
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddNetworkModal;
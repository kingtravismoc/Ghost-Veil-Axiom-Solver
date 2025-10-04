
import React, { useState, useRef, useEffect } from 'react';
import { GlobeIcon, ChevronDownIcon, PlusIcon, ShieldCheckIcon, UsersIcon } from './icons';
import type { Network } from '../types';

interface NetworkDropdownProps {
    networks: Network[];
    selectedNetwork: Network | null;
    onSelect: (network: Network) => void;
    onAddNetwork: () => void;
}

const NetworkTypeIcon: React.FC<{type: Network['type']}> = ({ type }) => {
    switch (type) {
        case 'mainnet':
            return <ShieldCheckIcon className="w-4 h-4 text-green-400"><title>Mainnet</title></ShieldCheckIcon>;
        case 'forknet':
            return <UsersIcon className="w-4 h-4 text-yellow-400"><title>Forknet</title></UsersIcon>;
        case 'custom':
            return <PlusIcon className="w-4 h-4 text-cyan-400"><title>Custom Network</title></PlusIcon>;
        default:
            return <GlobeIcon className="w-4 h-4 text-slate-400" />;
    }
};

const NetworkDropdown: React.FC<NetworkDropdownProps> = ({ networks, selectedNetwork, onSelect, onAddNetwork }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (network: Network) => {
        onSelect(network);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-md text-sm font-medium text-slate-200 transition-colors"
            >
                {selectedNetwork ? <NetworkTypeIcon type={selectedNetwork.type} /> : <GlobeIcon className="w-4 h-4" />}
                <span>{selectedNetwork?.name || 'Select Network'}</span>
                <ChevronDownIcon className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-30">
                    <div className="p-2">
                        {networks.map(network => (
                            <button
                                key={network.id}
                                onClick={() => handleSelect(network)}
                                className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                                    selectedNetwork?.id === network.id ? 'bg-cyan-600 text-white' : 'text-slate-200 hover:bg-slate-700'
                                }`}
                            >
                                <NetworkTypeIcon type={network.type} />
                                <span className="flex-grow">{network.name}</span>
                            </button>
                        ))}
                        <div className="my-1 h-px bg-slate-700"></div>
                        <button
                            onClick={() => { onAddNetwork(); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                        >
                            <PlusIcon className="w-4 h-4" />
                            <span>Add Custom Network</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NetworkDropdown;

import React from 'react';
import { GhostIcon, EyeIcon, WalletIcon } from './icons';
import type { SystemStatus, UserProfile, Network, Wallet } from '../types';
import NetworkDropdown from './NetworkDropdown';
import MasterControl from './MasterControl';

interface HeaderProps {
    status: SystemStatus;
    activeTab: string;
    onTabChange: (tab: string) => void;
    userProfile: UserProfile;
    onShowAddFriend: () => void;
    onShowShare: () => void;
    onShowGovSignup: () => void;
    networks: Network[];
    selectedNetwork: Network | null;
    onSelectNetwork: (network: Network) => void;
    onAddNetwork: () => void;
    onOpenTriggers: () => void;
    wallet: Wallet | null;
    onShowWallet: () => void;
    isCommerceEnabled: boolean;
    onShowNetworkDetails: () => void;
}

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:bg-slate-700'
        }`}
    >
        {children}
    </button>
);

const mainTabs = ['Dashboard', 'Spectrum', 'Neural', 'Devices', 'Functions', 'Extensions', 'System'];

const Header: React.FC<HeaderProps> = (props) => {
    const { 
        status, activeTab, onTabChange, networks, selectedNetwork, onSelectNetwork, 
        onAddNetwork, onOpenTriggers, wallet, onShowWallet, isCommerceEnabled, onShowNetworkDetails 
    } = props;

    return (
        <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 p-3 sticky top-0 z-40">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <GhostIcon className="w-8 h-8 text-cyan-400" />
                    <h1 className="text-xl font-bold hidden sm:block">Ghost Veil Protocol</h1>
                </div>

                <div className="flex-grow flex items-center justify-center">
                     <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg">
                        {mainTabs.map(tab => (
                            <TabButton key={tab} isActive={activeTab === tab} onClick={() => onTabChange(tab)}>{tab}</TabButton>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {isCommerceEnabled && wallet && (
                        <button onClick={onShowWallet} className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-md text-sm font-medium text-slate-200 transition-colors">
                            <WalletIcon className="w-4 h-4 text-green-400" />
                            <span className="font-mono">{wallet.balance.toFixed(2)} VLT</span>
                        </button>
                    )}
                     {selectedNetwork && (
                         <button onClick={onShowNetworkDetails} title="View Network Details" className="p-2 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-300 hover:text-white transition-colors">
                             <EyeIcon className="w-5 h-5"/>
                         </button>
                     )}
                     <NetworkDropdown networks={networks} selectedNetwork={selectedNetwork} onSelect={onSelectNetwork} onAddNetwork={onAddNetwork} />
                     <MasterControl status={status} setStatus={() => {}} onOpenTriggers={onOpenTriggers} />
                </div>
            </div>
        </header>
    );
};

export default Header;

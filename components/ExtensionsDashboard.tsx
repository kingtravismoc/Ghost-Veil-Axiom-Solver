import React, { useState } from 'react';
import { StoreIcon, ShieldCheckIcon, CubeIcon, CodeBracketIcon } from './icons';
import type { Extension, UserProfile } from '../types';

interface ExtensionsDashboardProps {
    extensions: Extension[];
    currentUser: UserProfile;
    onInstall: (extensionId: string) => void;
    onUninstall: (extensionId: string) => void;
    onPurchase: (extension: Extension) => void;
    isCommerceEnabled: boolean;
    onExport: (extension: Extension) => void;
    onViewDetails: (extension: Extension) => void;
    onLaunch: (extensionId: string) => void;
    onDeveloperPortalClick: () => void;
}

const ExtensionCard: React.FC<{
    extension: Extension;
    onInstall: (id: string) => void;
    onUninstall: (id: string) => void;
    onPurchase: (ext: Extension) => void;
    isCommerceEnabled: boolean;
    onExport: (extension: Extension) => void;
    onViewDetails: (extension: Extension) => void;
    onLaunch: (id: string) => void;
}> = ({ extension, onInstall, onUninstall, onPurchase, isCommerceEnabled, onExport, onViewDetails, onLaunch }) => {
    
    const isPaid = extension.pricingModel === 'FIXED_PRICE';
    const canPurchase = isCommerceEnabled || !isPaid;

    const handleAction = () => {
        if (extension.isInstalled) {
            onLaunch(extension.id);
        } else {
            if (isPaid) {
                if (canPurchase) {
                    onPurchase(extension);
                }
            } else {
                onInstall(extension.id);
            }
        }
    };

    const getButtonText = () => {
        if (extension.isInstalled) return 'Launch';
        if (extension.pricingModel === 'FREE') return 'Install';
        return `Purchase (${extension.price.toFixed(2)} VLT)`;
    };

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-100">{extension.name} <span className="text-sm text-slate-400">v{extension.version}</span></h3>
                    <a href={extension.githubUrl} target="_blank" rel="noopener noreferrer" title="View on GitHub" className="text-slate-400 hover:text-cyan-400">
                        <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                    </a>
                </div>
                 <p className="text-xs text-slate-400">by {extension.authorName}</p>
                <p className="text-sm text-slate-300 my-2 h-10 overflow-hidden">{extension.description}</p>
            </div>
            <div className="flex items-end justify-between mt-3 gap-2">
                 <button onClick={() => onViewDetails(extension)} className="text-sm text-cyan-400 hover:text-cyan-300">View Details</button>
                 <button
                    onClick={handleAction}
                    disabled={!canPurchase && isPaid && !extension.isInstalled}
                    title={!canPurchase && isPaid ? "Commerce is not enabled by the administrator." : ""}
                    className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                        extension.isInstalled
                            ? 'bg-cyan-600 hover:bg-cyan-700'
                            : 'bg-blue-600 hover:bg-blue-700'
                    } disabled:bg-slate-600 disabled:cursor-not-allowed`}
                >
                    {getButtonText()}
                </button>
            </div>
        </div>
    );
};


const ExtensionsDashboard: React.FC<ExtensionsDashboardProps> = (props) => {
    const [activeTab, setActiveTab] = useState('store');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFree, setFilterFree] = useState(false);
    
    const installedExtensions = props.extensions.filter(ext => props.currentUser.installedExtensions.includes(ext.id));
    
    let displayedExtensions = (activeTab === 'store' ? props.extensions : installedExtensions)
        .filter(ext => ext.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(ext => filterFree ? ext.pricingModel === 'FREE' : true);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <StoreIcon className="w-10 h-10 text-cyan-400" />
                    <div>
                        <h2 className="text-3xl font-bold">Extensions</h2>
                        <p className="text-slate-400">Expand the protocol's capabilities with new tools and interfaces.</p>
                    </div>
                </div>
                 <button onClick={props.onDeveloperPortalClick} className="bg-purple-600 hover:bg-purple-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                    <CodeBracketIcon className="w-5 h-5"/> Developer Portal
                </button>
            </div>
            
            <div className="flex items-center justify-between gap-4 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2">
                    <button onClick={() => setActiveTab('store')} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'store' ? 'bg-cyan-600' : 'hover:bg-slate-700'}`}>Store</button>
                    <button onClick={() => setActiveTab('installed')} className={`px-4 py-2 text-sm font-semibold rounded-md ${activeTab === 'installed' ? 'bg-cyan-600' : 'hover:bg-slate-700'}`}>Installed</button>
                </div>
                {activeTab === 'store' && (
                    <div className="flex items-center gap-4">
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="bg-slate-700 px-3 py-2 rounded-md text-sm w-64" />
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={filterFree} onChange={e => setFilterFree(e.target.checked)} />
                            <span>Free Only</span>
                        </label>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedExtensions.map(ext => (
                    <ExtensionCard 
                        key={ext.id} 
                        extension={{...ext, isInstalled: props.currentUser.installedExtensions.includes(ext.id)}}
                        {...props}
                    />
                ))}
            </div>
        </div>
    );
};

export default ExtensionsDashboard;

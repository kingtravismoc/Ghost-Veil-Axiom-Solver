import React from 'react';
import { StoreIcon, ShieldCheckIcon, CubeIcon, CodeBracketIcon } from './icons';
import type { Extension } from '../types';

interface ExtensionStoreDashboardProps {
    extensions: Extension[];
    onInstall: (extensionId: string) => void;
    onUninstall: (extensionId: string) => void;
    onPurchase: (extension: Extension) => void;
    isCommerceEnabled: boolean;
    onExport: (extension: Extension) => void;
}

const ExtensionCard: React.FC<{
    extension: Extension;
    onInstall: (id: string) => void;
    onUninstall: (id: string) => void;
    onPurchase: (ext: Extension) => void;
    isCommerceEnabled: boolean;
    onExport: (extension: Extension) => void;
}> = ({ extension, onInstall, onUninstall, onPurchase, isCommerceEnabled, onExport }) => {
    
    const isPaid = extension.pricingModel === 'FIXED_PRICE';
    const canPurchase = isCommerceEnabled || !isPaid;

    const handleAction = () => {
        if (extension.isInstalled) {
            onUninstall(extension.id);
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
        if (extension.isInstalled) return 'Uninstall';
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
                <p className="text-sm text-slate-300 my-2">{extension.description}</p>
                
                 <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400 mt-2 mb-3">
                     <span>Users: <span className="font-semibold text-slate-200">{extension.userCount.toLocaleString()}</span></span>
                     {extension.isInstalled && <span>Installed: <span className="font-semibold text-slate-200">{extension.installDate}</span></span>}
                 </div>
                 
                 {extension.isInstalled && extension.isNft && (
                    <div className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-900/40 border border-purple-700 rounded-full px-2 py-1 w-fit mb-2">
                        <ShieldCheckIcon className="w-3 h-3" />
                        <span>NFT Provisioned</span>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between mt-3 gap-2">
                 <div className={`px-2 py-0.5 text-xs font-semibold rounded-full ${extension.pricingModel === 'FREE' ? 'bg-green-600' : 'bg-cyan-600'}`}>
                    {extension.pricingModel === 'FREE' ? 'FREE' : `${extension.price.toFixed(2)} VLT`}
                </div>
                <div className="flex items-center gap-2">
                    {extension.allowExport && extension.isInstalled && (
                         <button onClick={() => onExport(extension)} title="Export Extension Package" className="p-2 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors"><CodeBracketIcon className="w-4 h-4" /></button>
                    )}
                    <button
                        onClick={handleAction}
                        disabled={!canPurchase && isPaid}
                        title={!canPurchase && isPaid ? "Commerce is not enabled by the administrator." : ""}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                            extension.isInstalled
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-blue-600 hover:bg-blue-700'
                        } disabled:bg-slate-600 disabled:cursor-not-allowed`}
                    >
                        {getButtonText()}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ExtensionStoreDashboard: React.FC<ExtensionStoreDashboardProps> = ({ extensions, onInstall, onUninstall, onPurchase, isCommerceEnabled, onExport }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
                <StoreIcon className="w-8 h-8 text-cyan-400" />
                Extension Store
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {extensions.map(ext => (
                    <ExtensionCard key={ext.id} extension={ext} onInstall={onInstall} onUninstall={onUninstall} onPurchase={onPurchase} isCommerceEnabled={isCommerceEnabled} onExport={onExport} />
                ))}
            </div>
        </div>
    );
};

export default ExtensionStoreDashboard;
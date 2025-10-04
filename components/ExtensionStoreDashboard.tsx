import React from 'react';
import { CubeIcon, ShieldCheckIcon } from './icons';
import type { Extension } from '../types';

interface ExtensionStoreDashboardProps {
    extensions: Extension[];
    onInstall: (extensionId: string) => void;
    onUninstall: (extensionId: string) => void;
    onPurchase: (extension: Extension) => void;
    isCommerceEnabled: boolean;
}

const ExtensionCard: React.FC<{
    extension: Extension;
    onInstall: (id: string) => void;
    onUninstall: (id: string) => void;
    onPurchase: (ext: Extension) => void;
    isCommerceEnabled: boolean;
}> = ({ extension, onInstall, onUninstall, onPurchase, isCommerceEnabled }) => {
    
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
                <h3 className="font-bold text-lg text-slate-100">{extension.name} <span className="text-sm text-slate-400">v{extension.version}</span></h3>
                <p className="text-xs text-slate-500">by {extension.authorAlias}</p>
                <p className="text-sm text-slate-300 my-2">{extension.description}</p>
                 {extension.isInstalled && extension.isNft && (
                    <div className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-900/40 border border-purple-700 rounded-full px-2 py-1 w-fit">
                        <ShieldCheckIcon className="w-3 h-3" />
                        <span>NFT Provisioned</span>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between mt-3">
                 <div className={`px-2 py-0.5 text-xs font-semibold rounded-full ${extension.pricingModel === 'FREE' ? 'bg-green-600' : 'bg-cyan-600'}`}>
                    {extension.pricingModel === 'FREE' ? 'FREE' : `${extension.price.toFixed(2)} VLT`}
                </div>
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
    );
};


const ExtensionStoreDashboard: React.FC<ExtensionStoreDashboardProps> = ({ extensions, onInstall, onUninstall, onPurchase, isCommerceEnabled }) => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
                <CubeIcon className="w-8 h-8 text-cyan-400" />
                Extension Store
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {extensions.map(ext => (
                    <ExtensionCard key={ext.id} extension={ext} onInstall={onInstall} onUninstall={onUninstall} onPurchase={onPurchase} isCommerceEnabled={isCommerceEnabled}/>
                ))}
            </div>
        </div>
    );
};

export default ExtensionStoreDashboard;
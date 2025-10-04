import React, { useState } from 'react';
import type { UserProfile, DeveloperProfile, Extension, Transaction } from '../types';
import { CodeBracketIcon, ChartBarIcon, BookOpenIcon, ArrowUpTrayIcon, FlaskIcon, StoreIcon } from './icons';
import SDKDocs from './SDKDocs';

interface DeveloperPortalProps {
    currentUser: UserProfile;
    developerProfile: DeveloperProfile | null;
    onUpdateDeveloperProfile: (alias: string) => void;
    extensions: Extension[];
    onExtensionSubmit: (ext: Omit<Extension, 'id'|'authorId'|'authorAlias'|'validationTests'|'status'>) => void;
}

const MyExtensionsView: React.FC<{ extensions: Extension[], authorId: string }> = ({ extensions, authorId }) => {
    const myExtensions = extensions.filter(e => e.authorId === authorId);

    const getStatusChip = (status: Extension['status']) => {
        const styles = {
            PENDING: 'bg-yellow-600',
            TESTING: 'bg-cyan-600 animate-pulse',
            PUBLISHED: 'bg-green-600',
            REJECTED: 'bg-red-600',
        };
        return <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };

    return (
        <div className="space-y-3">
            {myExtensions.length === 0 && <p className="text-slate-400">You haven't submitted any extensions yet.</p>}
            {myExtensions.map(ext => (
                <div key={ext.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 flex items-center justify-between">
                    <div>
                        <h4 className="font-semibold text-lg text-slate-100">{ext.name} <span className="text-sm text-slate-400">v{ext.version}</span></h4>
                        <p className="text-sm text-slate-400">{ext.description}</p>
                    </div>
                    <div className="text-right">
                        {getStatusChip(ext.status)}
                        <p className="text-xs text-slate-400 mt-1">{ext.validationTests} / 10 Tests</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

const SalesDashboard: React.FC<{ devProfile: DeveloperProfile | null }> = ({ devProfile }) => {
    if (!devProfile) return <p className="text-slate-400">No sales data available.</p>;
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400">Total Sales</p>
                <p className="text-3xl font-bold text-green-400 font-mono">{devProfile.totalSales.toFixed(2)} VLT</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <p className="text-sm text-slate-400">Withdrawable Balance (60%)</p>
                <p className="text-3xl font-bold text-cyan-400 font-mono">{devProfile.withdrawableBalance.toFixed(2)} VLT</p>
            </div>
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                 <p className="text-sm text-slate-400">Lifetime Payouts</p>
                <p className="text-3xl font-bold text-slate-300 font-mono">0.00 VLT</p>
            </div>
        </div>
    );
};

const SubmitExtensionView: React.FC<{ onSubmit: DeveloperPortalProps['onExtensionSubmit'] }> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [version, setVersion] = useState('1.0.0');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [isFree, setIsFree] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name, version, description,
            pricingModel: isFree ? 'FREE' : 'FIXED_PRICE',
            price: isFree ? 0 : Number(price),
            isInstalled: false,
            requiredEndpoints: [], // This would be parsed from code in a real scenario
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-4">
            <input type="text" placeholder="Extension Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" required />
            <input type="text" placeholder="Version (e.g., 1.0.0)" value={version} onChange={e => setVersion(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" rows={3} required />
            <div className="flex items-center gap-4">
                 <label className="flex items-center gap-2"><input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} /> Free</label>
                {!isFree && <input type="number" placeholder="Price (VLT)" value={price} onChange={e => setPrice(Number(e.target.value))} className="bg-slate-800 p-2 rounded border border-slate-600 w-32" />}
            </div>
            <p className="text-xs text-slate-400">Code analysis and endpoint requirement parsing are simulated upon submission.</p>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 font-semibold rounded-lg">Submit for Validation</button>
        </form>
    )
};


const DeveloperPortal: React.FC<DeveloperPortalProps> = (props) => {
    const [activeTab, setActiveTab] = useState('my_extensions');

    if (!props.developerProfile) {
        return <p>Initializing Developer Profile...</p>; // Or a setup component
    }

    const tabs = [
        { id: 'my_extensions', label: 'My Extensions', icon: StoreIcon },
        { id: 'sales', label: 'Sales Dashboard', icon: ChartBarIcon },
        { id: 'submit', label: 'Submit Extension', icon: ArrowUpTrayIcon },
        { id: 'sdk_docs', label: 'SDK & Docs', icon: BookOpenIcon },
        { id: 'testing_queue', label: 'Testing Queue', icon: FlaskIcon },
    ];

    return (
        <div className="space-y-4">
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-4 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-purple-500 text-purple-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                            <tab.icon className="w-5 h-5"/> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            {activeTab === 'my_extensions' && <MyExtensionsView extensions={props.extensions} authorId={props.currentUser.operatorId} />}
            {activeTab === 'sales' && <SalesDashboard devProfile={props.developerProfile} />}
            {activeTab === 'submit' && <SubmitExtensionView onSubmit={props.onExtensionSubmit} />}
            {activeTab === 'sdk_docs' && <SDKDocs />}
            {activeTab === 'testing_queue' && <p className="text-slate-400">Community testing queue will be displayed here.</p>}
        </div>
    );
};

export default DeveloperPortal;
import React, { useState } from 'react';
import type { UserProfile, DeveloperProfile, Extension, Transaction, FunctionProtocol } from '../types';
import { CodeBracketIcon, ChartBarIcon, BookOpenIcon, ArrowUpTrayIcon, FlaskIcon, StoreIcon } from './icons';
import SDKDocs from './SDKDocs';

interface DeveloperPortalProps {
    currentUser: UserProfile;
    developerProfile: DeveloperProfile | null;
    onUpdateDeveloperProfile: (alias: string) => void;
    extensions: Extension[];
    onExtensionSubmit: (ext: Omit<Extension, 'id'|'authorId'|'authorAlias'|'validationTests'|'status'|'isNft'|'contractId'|'authorName'|'installDate'|'userCount'|'githubUrl'|'readme'|'screenshots'|'hasBackgroundFunction'> & { obfuscationLevel: number }) => void;
    onFunctionSubmit: (func: Omit<FunctionProtocol, 'id'|'author'|'authorId'|'reviewStatus'|'status'>) => void;
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
    const [icon, setIcon] = useState('CubeAltIcon');
    const [fileName, setFileName] = useState('');
    const [allowExport, setAllowExport] = useState(true);
    const [obfuscationLevel, setObfuscationLevel] = useState(0);

    const obfuscationFee = (obfuscationLevel / 100) * 5; // Max 5 VLT fee

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name, version, description,
            pricingModel: isFree ? 'FREE' : 'FIXED_PRICE',
            price: isFree ? 0 : Number(price),
            isInstalled: false,
            requiredEndpoints: [], // This would be parsed from code in a real scenario
            icon,
            allowExport,
            isObfuscated: obfuscationLevel > 0,
            obfuscationLevel,
        });
        setName(''); setVersion('1.0.0'); setDescription(''); setPrice(0); setIsFree(true); setIcon('CubeAltIcon'); setFileName(''); setAllowExport(true); setObfuscationLevel(0);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-4">
            <h3 className="text-xl font-semibold">Submit New Extension</h3>
            <input type="text" placeholder="Extension Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" required />
            <input type="text" placeholder="Version (e.g., 1.0.0)" value={version} onChange={e => setVersion(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" required />
            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" rows={3} required />
            <input type="text" placeholder="Icon Name (e.g., RadarIcon, CubeAltIcon)" value={icon} onChange={e => setIcon(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" required />
             <div className="bg-slate-900/50 p-2 rounded border border-slate-600">
                <label htmlFor="file-upload" className="w-full text-center cursor-pointer p-2 bg-slate-700 hover:bg-slate-600 rounded-md block">
                    {fileName ? `Selected: ${fileName}` : "Upload Extension (.zip)"}
                </label>
                <input id="file-upload" type="file" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name || '')} accept=".zip" />
             </div>
             <div className="flex items-center gap-4">
                 <label className="flex items-center gap-2"><input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} /> Free</label>
                {!isFree && <input type="number" placeholder="Price (VLT)" value={price} onChange={e => setPrice(Number(e.target.value))} className="bg-slate-800 p-2 rounded border border-slate-600 w-32" />}
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Source Code Obfuscation</label>
                <input type="range" min="0" max="100" step="10" value={obfuscationLevel} onChange={e => setObfuscationLevel(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs">
                    <span>{obfuscationLevel}% (Fee: {obfuscationFee.toFixed(2)} VLT)</span>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={allowExport} onChange={e => setAllowExport(e.target.checked)} /> Allow Export</label>
                </div>
            </div>
            <p className="text-xs text-slate-400">Code analysis, endpoint parsing, and NFT contract generation (using AxiomScript) are simulated upon submission.</p>
            <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 font-semibold rounded-lg">Submit for Validation</button>
        </form>
    )
};

const SubmitFunctionView: React.FC<{ onSubmit: DeveloperPortalProps['onFunctionSubmit'] }> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [cost, setCost] = useState(0.1);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name, description, costPerCall: Number(cost), sdkIntegration: `${name.toLowerCase().replace(/\s/g, '_')}_sdk_v1`
        });
        setName(''); setDescription(''); setCost(0.1);
    };

     return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 space-y-4">
            <h3 className="text-xl font-semibold">Submit New Function Protocol</h3>
            <p className="text-sm text-slate-400">Propose a new high-level protocol for inclusion in the "Functions" service marketplace. Submissions that replicate official Ghost Veil services will be rejected.</p>
            <input type="text" placeholder="Protocol Name" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" required />
            <textarea placeholder="Protocol Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" rows={3} required />
             <input type="number" placeholder="Cost per Call (VLT)" value={cost} onChange={e => setCost(Number(e.target.value))} className="bg-slate-800 p-2 rounded border border-slate-600 w-48" step="0.01" min="0" required />
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 p-3 font-semibold rounded-lg">Submit for Review</button>
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
        { id: 'submit_ext', label: 'Submit Extension', icon: ArrowUpTrayIcon },
        { id: 'submit_func', label: 'Submit Function', icon: CodeBracketIcon },
        { id: 'sdk_docs', label: 'SDK & Docs', icon: BookOpenIcon },
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
            {activeTab === 'submit_ext' && <SubmitExtensionView onSubmit={props.onExtensionSubmit} />}
            {activeTab === 'submit_func' && <SubmitFunctionView onSubmit={props.onFunctionSubmit} />}
            {activeTab === 'sdk_docs' && <SDKDocs />}
        </div>
    );
};

export default DeveloperPortal;

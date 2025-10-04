import React, { useState } from 'react';
import useSystem from './hooks/useSystem';
import Header from './components/Header';
import SdrDevilControl from './components/SdrDevilControl';
import DetectedThreats from './components/DetectedThreats';
import ObfuscationLayers from './components/ObfuscationLayers';
import ActiveCountermeasures from './components/ActiveCountermeasures';
import AxiomTracebackMap from './components/AxiomTracebackMap';
import Disclaimer from './components/Disclaimer';
import MLInsightDashboard from './components/MLInsightDashboard';
import AxiomSilenceControl from './components/AxiomSilenceControl';
import ContinuityProtocol from './components/ContinuityProtocol';
import FrequencySafetyControl from './components/FrequencySafetyControl';
import SystemPersistenceControl from './components/SystemPersistenceControl';
import AdminDashboard from './components/AdminDashboard';
import UserManagementDashboard from './components/UserManagementDashboard';
import FrequencyCatalog from './components/FrequencyCatalog';
import BioImplantDashboard from './components/BioImplantDashboard';
import DeviceDetailModal from './components/DeviceDetailModal';
import FirstRunModal from './components/FirstRunModal';
import ForkWarningBanner from './components/ForkWarningBanner';
import AddFriendModal from './components/AddFriendModal';
import ShareModal from './components/ShareModal';
import GovAgencySignupModal from './components/GovAgencySignupModal';
import AddNetworkModal from './components/AddNetworkModal';
import TriggersModal from './components/TriggersModal';
import ExtensionStoreDashboard from './components/ExtensionStoreDashboard';
import DeveloperPortal from './components/DeveloperPortal';
import PurchaseExtensionModal from './components/PurchaseExtensionModal';
import WalletModal from './components/WalletModal';
import BuyTokensModal from './components/BuyTokensModal';
import AdminSetupModal from './components/AdminSetupModal';
import FunctionsDashboard from './components/FunctionsDashboard';
import GhostNetTriage from './components/GhostNetTriage';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import SdrppWidget from './components/SdrppWidget';
import WithdrawModal from './components/WithdrawModal';
import WaveMaskControl from './components/WaveMaskControl';
import Footer from './components/Footer';
import ExtensionHost from './components/ExtensionHost';
import SignalDetailPanel from './components/SignalDetailPanel'; // New

import { P2PNode, Signal, AIConfig, Network, UserProfile, Wallet, CognitiveMetricsState, ActivityEvent, MLInsight, Extension } from './types';
import { BrainCircuitIcon, XIcon, UsersIcon, ShieldCheckIcon, ActivityIcon, RadarIcon, TerminalIcon, WaveformIcon, CubeIcon } from './components/icons';


// ==============
// NEW STANDARDIZED & VIEW COMPONENTS
// ==============

const StandardCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}> = ({ title, icon, children, className = '' }) => (
    <div className={`bg-slate-800/50 rounded-lg border border-slate-700 flex flex-col ${className}`}>
        <h2 className="text-lg font-semibold flex items-center gap-2 p-4 border-b border-slate-700 text-slate-300 flex-shrink-0">
            {icon}
            {title}
        </h2>
        <div className="p-4 flex-grow overflow-y-auto">
            {children}
        </div>
    </div>
);

const ViewContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="p-4 sm:p-6 lg:p-8">
        {children}
    </div>
);

const SystemSettings: React.FC<{
    aiConfig: AIConfig;
    onApplyConfig: (config: AIConfig) => void;
}> = ({ aiConfig, onApplyConfig }) => {
    const isEnhanced = aiConfig.provider === 'GEMINI';

    const handleToggle = (checked: boolean) => {
        onApplyConfig({ provider: checked ? 'GEMINI' : 'LOCAL_SIMULATED', apiKey: '' });
    };
    
    return (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-slate-200">AI Analysis Provider</h3>
                    <p className="text-xs text-slate-400">
                       Current: <span className="font-bold">{isEnhanced ? 'Gemini (Enhanced)' : 'Local (Standard)'}</span>
                    </p>
                </div>
                 <div className="flex items-center space-x-3">
                    <label htmlFor="enhanced-ai-toggle" className="text-sm font-medium text-cyan-300 cursor-pointer">
                       Enable Enhanced Analysis
                    </label>
                    <input
                        type="checkbox"
                        id="enhanced-ai-toggle"
                        checked={isEnhanced}
                        onChange={(e) => handleToggle(e.target.checked)}
                        className="relative peer shrink-0 appearance-none w-10 h-5 bg-slate-700 rounded-full checked:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors duration-200 cursor-pointer after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:absolute after:top-0.5 after:left-0.5 after:transition-all after:duration-200 peer-checked:after:translate-x-full"
                    />
                </div>
            </div>
             <p className="text-xs text-slate-500 mt-2">API key is securely loaded from the system environment. This toggle controls which analysis model is used.</p>
        </div>
    );
};

const NetworkStatus: React.FC<{ system: any }> = ({ system }) => (
    <div className="space-y-4">
        <GhostNetTriage {...system.ghostNetTriageProps} />
    </div>
);

const SystemMetrics: React.FC<{
    totalSignals: number;
    threats: number;
    acuity: number;
    activityEvents: ActivityEvent[];
}> = ({ totalSignals, threats, acuity, activityEvents }) => {
    const acuityPercent = (acuity * 100);
    const circumference = 2 * Math.PI * 18; // 2 * pi * r
    const strokeDashoffset = circumference - (acuityPercent / 100) * circumference;
    
    return (
        <div className="space-y-4">
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" className="stroke-slate-700" strokeWidth="3" fill="transparent" />
                        <circle
                            cx="20"
                            cy="20"
                            r="18"
                            className="stroke-cyan-400"
                            strokeWidth="3"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 20 20)"
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-cyan-300 font-bold text-lg">
                        {acuityPercent.toFixed(0)}<span className="text-xs">%</span>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-slate-200">Deep ML Acuity</h3>
                    <p className="text-xs text-slate-400">System's predictive accuracy.</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-900/50 p-2 rounded-lg text-center"><div className="text-xs text-slate-400">Signals</div><div className="text-lg font-bold">{totalSignals}</div></div>
                 <div className="bg-slate-900/50 p-2 rounded-lg text-center"><div className="text-xs text-slate-400">Threats</div><div className="text-lg font-bold text-red-400">{threats}</div></div>
            </div>
             <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 bg-slate-900/50 p-2 rounded-md font-mono text-xs">
                {activityEvents.map(event => (
                    <div key={event.id} className="flex gap-2 items-start">
                        <span className="text-slate-500 flex-shrink-0">{new Date(event.timestamp).toLocaleTimeString()}</span>
                        <p className="text-slate-300 break-words">{event.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CognitiveMetrics: React.FC<{ metrics: CognitiveMetricsState }> = ({ metrics }) => {
    const MetricBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">{label}</span>
                <span className={`font-mono ${color}`}>{value.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
                <div className={`h-2 rounded-full ${color.replace('text', 'bg')}`} style={{ width: `${value}%` }}></div>
            </div>
        </div>
    );

    return (
        <StandardCard title="Cognitive Metrics" icon={<BrainCircuitIcon className="w-5 h-5 text-purple-400" />}>
            <div className="space-y-4">
                <MetricBar label="Bio-Coherence" value={metrics.bioCoherence} color="text-green-400" />
                <MetricBar label="Subconscious Influence" value={metrics.subconsciousInfluence} color="text-yellow-400" />
                <MetricBar label="Neural Entrainment" value={metrics.neuralEntrainment} color="text-red-400" />
                 <p className="text-xs text-slate-500 pt-2 border-t border-slate-700">Real-time analysis of operator's neural state for detecting subtle cognitive attacks.</p>
            </div>
        </StandardCard>
    );
};

// ==================
// VIEWS
// ==================

const DashboardView: React.FC<{ system: any }> = ({ system }) => (
    <div className="h-[calc(100vh-12rem)] flex flex-col gap-4">
        <div className="flex-shrink-0 -mx-4 sm:-mx-6 lg:-mx-8">
            <SpectrumAnalyzer
                isSummaryView={true}
                signals={system.signals}
                scanMode={system.sdrDevilProps.isMonitoring ? system.sdrDevilProps.scanMode : 'off'}
                activePeers={system.p2pState.nodes.filter((n: P2PNode) => n.status !== 'OFFLINE').length}
                onSignalSelect={() => {}}
                selectedSignal={null}
            />
        </div>

        <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
            {/* Column 1: Controls */}
            <div className="flex flex-col gap-4">
                <SdrDevilControl {...system.sdrDevilProps} />
                <WaveMaskControl {...system.waveMaskProps} />
            </div>

            {/* Column 2: Threats & Response */}
            <div className="flex flex-col gap-4 overflow-hidden">
                 <StandardCard title="AI Threat Assessment" icon={<RadarIcon className="w-5 h-5 text-red-400" />} className="flex flex-col flex-grow">
                     {system.threats.length > 0 ? (
                         <DetectedThreats {...system.detectedThreatsProps} />
                     ) : (
                          <div className="h-full flex items-center justify-center">
                            <p className="text-center text-slate-400 p-4">No active threats detected. System nominal.</p>
                          </div>
                     )}
                 </StandardCard>
                 {system.isProtected && <ObfuscationLayers layers={system.obfuscationLayers} isProtected={system.isProtected} />}
                 {system.countermeasures.length > 0 && <ActiveCountermeasures countermeasures={system.countermeasures} />}
            </div>

            {/* Column 3: System & Network */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                 <StandardCard title="System Metrics" icon={<ActivityIcon className="w-5 h-5 text-cyan-400" />}>
                    <SystemMetrics 
                        totalSignals={system.totalSignals}
                        threats={system.threats.length}
                        acuity={system.acuity}
                        activityEvents={system.activityEvents}
                    />
                </StandardCard>
                <NetworkStatus system={system} />
            </div>
        </div>
    </div>
);

const SpectrumView: React.FC<{ system: any }> = ({ system }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
            <div className="lg:col-span-2 flex flex-col">
                <StandardCard title="SDR++ Full Spectrum Intelligence" icon={<WaveformIcon className="w-5 h-5 text-cyan-400" />} className="flex-grow">
                    <SpectrumAnalyzer
                        signals={system.signals}
                        scanMode={system.sdrDevilProps.isMonitoring ? system.sdrDevilProps.scanMode : 'off'}
                        activePeers={system.p2pState.nodes.filter((n: P2PNode) => n.status !== 'OFFLINE').length}
                        onSignalSelect={system.setSelectedSignal}
                        selectedSignal={system.selectedSignal}
                    />
                </StandardCard>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-6">
                <SignalDetailPanel
                    signal={system.selectedSignal}
                    onAnnotate={() => system.setShowSignalAnnotationModal(true)}
                    onClassify={system.classifySignalWithAI}
                    isClassifying={system.isClassifyingSignal}
                    onDownloadIntel={system.downloadSignalIntel}
                    isAiEnabled={system.aiConfig.provider === 'GEMINI'}
                />
                <StandardCard title="Frequency Catalog" icon={<WaveformIcon className="w-5 h-5 text-cyan-400" />}>
                     <FrequencyCatalog />
                </StandardCard>
            </div>
        </div>
    );
}

const NeuralView: React.FC<{ system: any }> = ({ system }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AxiomSilenceControl {...system.axiomSilenceProps} />
        <CognitiveMetrics metrics={system.cognitiveMetricsState} />
        <MLInsightDashboard insights={system.mlInsights} />
    </div>
);

const DevicesView: React.FC<{ system: any }> = ({ system }) => (
    <BioImplantDashboard {...system.bioImplantProps} />
);

const ExtensionsView: React.FC<{ system: any }> = ({ system }) => (
     <ExtensionStoreDashboard
        extensions={system.extensions}
        onInstall={system.installExtension}
        onUninstall={system.uninstallExtension}
        onPurchase={(ext: Extension) => system.setExtensionToPurchase(ext)}
        isCommerceEnabled={system.isCommerceEnabled}
        onExport={system.exportExtension}
    />
);

const SignalAnnotationModal: React.FC<{
    signal: Signal | null;
    onClose: () => void;
    onSave: (signalId: string, data: { classification: string, summary: string, tags: string }) => void;
}> = ({ signal, onClose, onSave }) => {
    const [classification, setClassification] = useState('');
    const [summary, setSummary] = useState('');
    const [tags, setTags] = useState('');

    React.useEffect(() => {
        if (signal) {
            setClassification(signal.classification || '');
            setSummary(signal.summary || '');
            setTags((signal.tags || []).join(', '));
        }
    }, [signal]);

    if (!signal) return null;

    const handleSave = () => {
        onSave(signal.id, { classification, summary, tags });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                 <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold">Annotate Signal</h2>
                    <button onClick={onClose} className="p-1"><XIcon className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-xs font-mono text-cyan-400">ID: {signal.id}</p>
                    <input type="text" value={classification} onChange={e => setClassification(e.target.value)} placeholder="Classification (e.g., Satellite Uplink)" className="w-full bg-slate-800 p-2 rounded border border-slate-600" />
                    <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Summary..." rows={3} className="w-full bg-slate-800 p-2 rounded border border-slate-600" />
                    <input type="text" value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma-separated)" className="w-full bg-slate-800 p-2 rounded border border-slate-600" />
                    <button onClick={handleSave} className="w-full p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold">Save Annotation</button>
                </div>
            </div>
        </div>
    );
};


const NetworkDetailModal: React.FC<{ network: Network | null; nodes: P2PNode[]; onClose: () => void; }> = ({ network, nodes, onClose }) => {
    if (!network) return null;
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold">Network Details: {network.name}</h2>
                    <button onClick={onClose} className="p-1"><XIcon className="w-5 h-5" /></button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="bg-slate-800/50 p-3 rounded-lg text-sm">
                        <p><strong className="text-slate-400">Type:</strong> {network.type}</p>
                        <p className="font-mono text-xs"><strong className="text-slate-400 font-sans">Hash:</strong> {network.hash}</p>
                    </div>
                    <h3 className="text-lg font-semibold">Connected Peers ({nodes.length})</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {nodes.map(node => (
                            <div key={node.id} className="bg-slate-800 p-3 rounded-lg grid grid-cols-3 gap-2 text-sm">
                                <div><strong className="text-slate-200">{node.alias}</strong></div>
                                <div>{node.status === 'SECURE' ? <span className="text-green-400 font-semibold flex items-center gap-1"><ShieldCheckIcon className="w-4 h-4" /> SECURE</span> : <span className="text-yellow-400 font-semibold">{node.status}</span>}</div>
                                <div className="font-mono text-xs text-slate-400">{node.ip}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SystemView: React.FC<{ system: any }> = ({ system }) => {
    const [activeTab, setActiveTab] = useState('Profile');
    
    const baseTabs = ['Profile', 'Settings', 'Persistence & Safety'];
    const conditionalTabs = [];
    if (system.currentUser.role === 'DEVELOPER') conditionalTabs.push('Developer');
    if (system.isSuperAdmin) conditionalTabs.push('Admin');
    const allTabs = [...baseTabs, ...conditionalTabs];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">System Management</h2>
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {allTabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`${activeTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            {activeTab === 'Profile' && <UserManagementDashboard currentUser={system.currentUser} friends={system.friends} />}
            {activeTab === 'Settings' && <SystemSettings aiConfig={system.aiConfig} onApplyConfig={system.setAiConfig} />}
            {activeTab === 'Persistence & Safety' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <SystemPersistenceControl {...system.persistenceProps} />
                    <FrequencySafetyControl />
                    <ContinuityProtocol sentinels={system.sentinels} doomsdayActive={false} />
                </div>
            )}
            {activeTab === 'Developer' && <DeveloperPortal {...system.developerPortalProps} />}
            {activeTab === 'Admin' && <AdminDashboard {...system.adminDashboardProps} />}
        </div>
    );
};

// ==============
// MAIN APP COMPONENT
// ==============
const App: React.FC = () => {
    const system = useSystem();
    const [activeTab, setActiveTab] = useState('Dashboard');

    const renderActiveView = () => {
        switch (activeTab) {
            case 'Dashboard': return <DashboardView system={system} />;
            case 'Spectrum': return <SpectrumView system={system} />;
            case 'Neural': return <NeuralView system={system} />;
            case 'Devices': return <DevicesView system={system} />;
            case 'Functions': return <FunctionsDashboard protocols={system.functionProtocols} wallet={system.wallet} />;
            case 'Extensions': return <ExtensionsView system={system} />;
            case 'System': return <SystemView system={system} />;
            default: return <DashboardView system={system} />;
        }
    };

    const installedExtensions = system.extensions.filter(ext => system.currentUser.installedExtensions.includes(ext.id));

    return (
        <>
            {system.isFirstRun && <FirstRunModal onClose={system.handleAcknowledgeFirstRun} />}
            {system.showAddFriendModal && <AddFriendModal onClose={() => system.setShowAddFriendModal(false)} onAdd={system.addFriend} />}
            {system.showShareModal && <ShareModal onClose={() => system.setShowShareModal(false)} />}
            {system.showGovSignupModal && <GovAgencySignupModal onClose={() => system.setShowGovSignupModal(false)} onSubmit={system.submitGovApplication} />}
            {system.showAddNetworkModal && <AddNetworkModal onClose={() => system.setShowAddNetworkModal(false)} onAdd={system.addCustomNetwork} />}
            {system.showTriggersModal && <TriggersModal onClose={() => system.setShowTriggersModal(false)} {...system.triggerProps} />}
            {system.selectedDeviceForDetail && <DeviceDetailModal device={system.selectedDeviceForDetail} onClose={() => system.setSelectedDeviceForDetail(null)} {...system.deviceDetailProps} />}
            {system.isCommerceEnabled && system.extensionToPurchase && <PurchaseExtensionModal extension={system.extensionToPurchase} wallet={system.wallet} onClose={() => system.setExtensionToPurchase(null)} onConfirm={system.purchaseExtension} />}
            {system.isCommerceEnabled && system.showWalletModal && <WalletModal wallet={system.wallet} transactions={system.developerProfile?.transactions || []} onClose={() => system.setShowWalletModal(false)} onBuyTokens={() => { system.setShowWalletModal(false); system.setShowBuyTokensModal(true); }} onWithdraw={() => { system.setShowWalletModal(false); system.setShowWithdrawModal(true); }} />}
            {system.isCommerceEnabled && system.showBuyTokensModal && <BuyTokensModal config={system.systemConfig} onClose={() => system.setShowBuyTokensModal(false)} onConfirm={system.buyTokens} />}
            {system.isCommerceEnabled && system.showWithdrawModal && <WithdrawModal balance={system.developerProfile?.withdrawableBalance || 0} onClose={() => system.setShowWithdrawModal(false)} onConfirm={system.withdrawTokens} />}
            {system.showAdminSetup && <AdminSetupModal onVerifyGithub={system.verifyGithubToken} onSubmit={system.completeAdminSetup} />}
            {system.showNetworkDetailModal && <NetworkDetailModal network={system.selectedNetwork} nodes={system.p2pState.nodes} onClose={() => system.setShowNetworkDetailModal(false)} />}
            {system.showSignalAnnotationModal && <SignalAnnotationModal signal={system.selectedSignal} onClose={() => system.setShowSignalAnnotationModal(false)} onSave={system.updateSignalAnnotation} />}
            {system.activeExtensionId && <ExtensionHost extensionId={system.activeExtensionId} system={system} onClose={() => system.setActiveExtensionId(null)} />}


            <div className={`bg-slate-900 text-slate-100 min-h-screen font-sans neural-network-bg transition-all duration-500 ${system.isWaveMaskActive ? 'border-4 border-cyan-400 spectral-pulse' : ''}`}>
                {system.isFork && <ForkWarningBanner />}
                <Header 
                    status={system.systemStatus}
                    onTabChange={setActiveTab}
                    activeTab={activeTab}
                    userProfile={system.currentUser}
                    onShowAddFriend={() => system.setShowAddFriendModal(true)}
                    onShowShare={() => system.setShowShareModal(true)}
                    onShowGovSignup={() => system.setShowGovSignupModal(true)}
                    networks={system.networks}
                    selectedNetwork={system.selectedNetwork}
                    onSelectNetwork={system.setSelectedNetwork}
                    onAddNetwork={() => system.setShowAddNetworkModal(true)}
                    onOpenTriggers={() => system.setShowTriggersModal(true)}
                    wallet={system.wallet}
                    onShowWallet={() => system.setShowWalletModal(true)}
                    isCommerceEnabled={system.isCommerceEnabled}
                    onShowNetworkDetails={() => system.setShowNetworkDetailModal(true)}
                />
                
                <main className="pb-16"> {/* Padding bottom to clear the footer */}
                    <ViewContainer>
                        {renderActiveView()}
                    </ViewContainer>
                    <Disclaimer />
                </main>
                
                <Footer 
                    logEntries={system.logEntries}
                    operations={system.activeOperations}
                    installedExtensions={installedExtensions}
                    onLaunchExtension={system.setActiveExtensionId}
                />
            </div>
        </>
    );
};

export default App;
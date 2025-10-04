import React, { useState } from 'react';
import useSystem from './hooks/useSystem';
import Header from './components/Header';
import SdrDevilControl from './components/SdrDevilControl';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import DetectedThreats from './components/DetectedThreats';
import DetectedSignals from './components/DetectedSignals';
import ObfuscationLayers from './components/ObfuscationLayers';
import ActiveCountermeasures from './components/ActiveCountermeasures';
import LogPanel from './components/LogPanel';
import AxiomTracebackMap from './components/AxiomTracebackMap';
import Disclaimer from './components/Disclaimer';
import MLInsightDashboard from './components/MLInsightDashboard';
import GhostNetTriage from './components/GhostNetTriage';
import AxiomSilenceControl from './components/AxiomSilenceControl';
import HerdHealthControl from './components/HerdHealthControl';
import ContinuityProtocol from './components/ContinuityProtocol';
import AIConfigStrip from './components/AIConfigStrip';
import SystemDashboard from './components/SystemDashboard';
import FrequencySafetyControl from './components/FrequencySafetyControl';
import SystemPersistenceControl from './components/SystemPersistenceControl';
import ManagementTabs from './components/ManagementTabs';
import AdminDashboard from './components/AdminDashboard';
import UserManagementDashboard from './components/UserManagementDashboard';
import FrequencyCatalog from './components/FrequencyCatalog';
import FourDSafetyAxiomGenerator from './components/FourDSafetyAxiomGenerator';
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


const App: React.FC = () => {
    const system = useSystem();
    const [activeTab, setActiveTab] = useState('Operations');
    const [activeManagementTab, setActiveManagementTab] = useState('System');

    const managementTabs = ['System', 'Network', 'Security', 'Hardware', 'Admin', 'User', 'Extensions', 'Developer'];

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
            {system.isCommerceEnabled && system.showWalletModal && <WalletModal wallet={system.wallet} transactions={system.developerProfile?.transactions || []} onClose={() => system.setShowWalletModal(false)} onBuyTokens={() => { system.setShowWalletModal(false); system.setShowBuyTokensModal(true); }} />}
            {system.isCommerceEnabled && system.showBuyTokensModal && <BuyTokensModal config={system.systemConfig} onClose={() => system.setShowBuyTokensModal(false)} onConfirm={system.buyTokens} />}
            {system.showAdminSetup && <AdminSetupModal onVerifyGithub={system.verifyGithubToken} onSubmit={system.completeAdminSetup} />}


            <div className="bg-slate-900 text-slate-100 min-h-screen font-sans">
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
                />
                
                <main className="p-4 sm:p-6 lg:p-8">
                    <AIConfigStrip isVisible={activeTab === 'Operations'} onApplyConfig={system.setAiConfig} />

                    {activeTab === 'Operations' && (
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Left Column */}
                            <div className="lg:col-span-1 space-y-6">
                                <SdrDevilControl {...system.sdrDevilProps} />
                                <AxiomSilenceControl {...system.axiomSilenceProps} />
                                <HerdHealthControl {...system.herdHealthProps} />
                            </div>

                            {/* Middle Column */}
                            <div className="lg:col-span-2 space-y-6">
                                <SystemDashboard {...system.systemDashboardProps}/>
                                <DetectedThreats {...system.detectedThreatsProps} />
                                <ObfuscationLayers layers={system.obfuscationLayers} isProtected={system.isProtected} />
                                <ActiveCountermeasures countermeasures={system.countermeasures} />
                                <AxiomTracebackMap tracebackData={system.tracebackData} isTracing={system.isTracing} />
                            </div>

                            {/* Right Column */}
                            <div className="lg:col-span-1 space-y-6">
                                <SpectrumAnalyzer signals={system.signals} />
                                <GhostNetTriage {...system.ghostNetTriageProps} />
                                <DetectedSignals signals={system.signals.filter(s => s.amplitude > 60 || s.snr > 30)} />
                                <MLInsightDashboard insights={system.mlInsights} />
                                <LogPanel logEntries={system.logEntries} />
                            </div>
                        </div>
                    )}

                     {activeTab === 'Management' && (
                        <div>
                            <ManagementTabs activeTab={activeManagementTab} onTabChange={setActiveManagementTab} tabs={managementTabs} />
                            {activeManagementTab === 'System' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <ContinuityProtocol sentinels={system.sentinels} doomsdayActive={false} />
                                    <SystemPersistenceControl {...system.persistenceProps} />
                                </div>
                            )}
                            {activeManagementTab === 'Security' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FourDSafetyAxiomGenerator {...system.fourDSafetyProps} />
                                    <FrequencySafetyControl />
                                </div>
                            )}
                            {activeManagementTab === 'Hardware' && (
                                <BioImplantDashboard {...system.bioImplantProps} />
                            )}
                             {activeManagementTab === 'User' && (
                                <UserManagementDashboard currentUser={system.currentUser} friends={system.friends} />
                            )}
                             {activeManagementTab === 'Network' && (
                                <FrequencyCatalog />
                            )}
                            {activeManagementTab === 'Admin' && system.isSuperAdmin && (
                                <AdminDashboard applications={system.govApplications} onApprove={() => {}} onReject={() => {}} />
                            )}
                             {activeManagementTab === 'Extensions' && (
                                 <ExtensionStoreDashboard extensions={system.extensions} onInstall={system.installExtension} onUninstall={system.uninstallExtension} onPurchase={ext => system.setExtensionToPurchase(ext)} isCommerceEnabled={system.isCommerceEnabled} />
                            )}
                             {activeManagementTab === 'Developer' && system.currentUser.role === 'DEVELOPER' && (
                                <DeveloperPortal currentUser={system.currentUser} developerProfile={system.developerProfile} onUpdateDeveloperProfile={() => {}} extensions={system.extensions} onExtensionSubmit={system.submitExtension} />
                            )}
                        </div>
                    )}


                    <Disclaimer />
                </main>
            </div>
        </>
    );
};

export default App;

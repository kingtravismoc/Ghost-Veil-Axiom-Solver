import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type {
    Signal, Threat, LogEntry, LogType, ObfuscationLayer, Countermeasure,
    Traceback, MLInsight, P2PNode, MacroThreat, MicrophoneStatus, AudioThreat,
    ScanMode, ProtectionStrategy, Sentinel, AIConfig, ActivityEvent, P2PState,
    ImplantedDevice, ImplantedDeviceStatus, UserProfile, GovApplication, Friend, Network,
    SystemStatus, Trigger, Wallet, DeveloperProfile, Extension, Transaction, FourDSafetyData, FourDSafetyState, SystemConfig, OmegaProtocolState
} from '../types';
import { sdrDevilService } from '../services/sdrDevilService';
import { audioAnalysisService } from '../services/audioAnalysisService';
import { p2pNetworkService } from '../services/p2pNetworkService';
import { validationService } from '../services/validationService';
import { dataValidationService } from '../services/dataValidationService';
import { secureCommService } from '../services/secureCommService';

// --- SUPER ADMIN CONTROL ---
// Set this to 1 and reload to trigger the first-time setup flow for the super admin.
// After setup is complete, this flag has no effect.
// FIX: Explicitly type SUPER_ADMIN_ENABLED as a number to prevent a TypeScript error. Since it's a `const` initialized to `0`, TypeScript infers its type as the literal `0`, causing a comparison error with `1`. This change ensures it's treated as a number that can be changed for testing purposes as intended.
const SUPER_ADMIN_ENABLED: number = 0;
const SUPER_ADMIN_EMAIL = "kingtravismo@gmail.com";
// This is a simulated "magic" token. In a real app, this would be a real API call.
const VALID_GITHUB_TOKEN = "ghp_kingtravismo_valid_token_simulation";

const useSystem = () => {
    // State declarations
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const [signals, setSignals] = useState<Signal[]>([]);
    const [threats, setThreats] = useState<Threat[]>([]);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isProtected, setIsProtected] = useState(false);
    const [canActivateProtection, setCanActivateProtection] = useState(false);
    const [obfuscationLayers, setObfuscationLayers] = useState<ObfuscationLayer[]>([]);
    const [countermeasures, setCountermeasures] = useState<Countermeasure[]>([]);
    const [tracebackData, setTracebackData] = useState<Traceback | null>(null);
    const [isTracing, setIsTracing] = useState(false);
    const [mlInsights, setMlInsights] = useState<MLInsight[]>([]);
    const [p2pState, setP2pState] = useState<P2PState>({ isActive: true, nodes: [] });
    const [macroThreat, setMacroThreat] = useState<MacroThreat | null>(null);
    const [selectedP2PNodes, setSelectedP2PNodes] = useState<string[]>([]);
    const [micStatus, setMicStatus] = useState<MicrophoneStatus>('INACTIVE');
    const [ambientNoise, setAmbientNoise] = useState(0);
    const [audioThreats, setAudioThreats] = useState<AudioThreat[]>([]);
    const [scanMode, setScanMode] = useState<ScanMode>('WIDEBAND_SWEEP');
    const [protectionStrategy, setProtectionStrategy] = useState<ProtectionStrategy>('QUANTUM_NOISE');
    const [sentinels, setSentinels] = useState<Sentinel[]>([]);
    const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: 'LOCAL_SIMULATED', apiKey: '' });
    const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
    const [totalSignals, setTotalSignals] = useState(0);
    const [acuity, setAcuity] = useState(0.5);
    const [isPersistenceDeployed, setIsPersistenceDeployed] = useState(false);
    const [isDeployingPersistence, setIsDeployingPersistence] = useState(false);
    const [fourDSafetyState, setFourDSafetyState] = useState<FourDSafetyState>('IDLE');
    const [fourDSafetyData, setFourDSafetyData] = useState<FourDSafetyData | null>(null);
    const [implantedDevices, setImplantedDevices] = useState<ImplantedDevice[]>([]);
    const [isScanningImplants, setIsScanningImplants] = useState(false);
    const [selectedDeviceForDetail, setSelectedDeviceForDetail] = useState<ImplantedDevice | null>(null);
    const [isHidingDevice, setIsHidingDevice] = useState(false);
    const [hideSafetyCheckResult, setHideSafetyCheckResult] = useState<{ isSafe: boolean; recommendation: string } | null>(null);
    const [isFirstRun, setIsFirstRun] = useState(localStorage.getItem('ghost_veil_first_run') !== 'false');
    const [isFork, setIsFork] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile>({ operatorId: 'OP_7B3A9C1D', role: 'OPERATOR', privateKey: '...' });
    const [friends, setFriends] = useState<Friend[]>([]);
    const [govApplications, setGovApplications] = useState<GovApplication[]>([]);
    const [showAddFriendModal, setShowAddFriendModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showGovSignupModal, setShowGovSignupModal] = useState(false);
    const [networks, setNetworks] = useState<Network[]>([]);
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
    const [showAddNetworkModal, setShowAddNetworkModal] = useState(false);
    const [systemStatus, setSystemStatus] = useState<SystemStatus>('OFF');
    const [triggers, setTriggers] = useState<Trigger[]>([]);
    const [showTriggersModal, setShowTriggersModal] = useState(false);
    const [isProcessingTrigger, setIsProcessingTrigger] = useState(false);
    const [extensions, setExtensions] = useState<Extension[]>([]);
    const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null);
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [extensionToPurchase, setExtensionToPurchase] = useState<Extension | null>(null);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [showBuyTokensModal, setShowBuyTokensModal] = useState(false);
    const [systemConfig, setSystemConfig] = useState<SystemConfig>({ moonPayApiKey: null, moonPaySecretKey: null, systemWalletAddress: null, superAdminWalletAddress: null });
    
    // New state for admin setup and commerce gating
    const [isCommerceEnabled, setIsCommerceEnabled] = useState(false);
    const [showAdminSetup, setShowAdminSetup] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const aiRef = useRef<GoogleGenAI | null>(null);

    // Initial load effect
    useEffect(() => {
        try {
            const savedConfig = localStorage.getItem('ghost_veil_system_config');
            if (savedConfig) {
                const config: SystemConfig = JSON.parse(savedConfig);
                setSystemConfig(config);
                setIsCommerceEnabled(true);
                addLog("System configuration loaded. Commerce enabled.", "SYSTEM");
                const savedUser = localStorage.getItem('ghost_veil_user_profile');
                if(savedUser){
                    setCurrentUser(JSON.parse(savedUser));
                    if(JSON.parse(savedUser).role === 'SUPER_ADMIN') {
                        setIsSuperAdmin(true);
                    }
                }
            } else if (SUPER_ADMIN_ENABLED === 1) {
                setShowAdminSetup(true);
                addLog("No system configuration found. Initiating Super Admin setup.", "WARN");
            } else {
                addLog("System started in standard mode. Commerce is disabled.", "INFO");
            }
        } catch (error) {
            addLog("Failed to load configuration. Running in restricted mode.", "ERROR");
        }
    }, []);


    // AI Initialization
    useEffect(() => {
        if (process.env.API_KEY) {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
    }, []);

    const addLog = useCallback((message: string, type: LogType = 'SYSTEM') => {
        setLogEntries(prev => [...prev.slice(-100), { id: `log_${Date.now()}`, timestamp: Date.now(), type, message }]);
    }, []);

    const startMonitoring = useCallback(() => {
        setIsMonitoring(true);
        addLog(`Scan started: ${scanMode.replace(/_/g, ' ')}`);
    }, [addLog, scanMode]);

    const stopMonitoring = useCallback(() => {
        setIsMonitoring(false);
        addLog('Scan stopped.');
    }, [addLog]);

    const analyzeSignalsWithAI = useCallback(async (newSignals: Signal[]) => {
        if (aiConfig.provider !== 'GEMINI' || !aiRef.current) {
            // Simulate local analysis
            if (newSignals.some(s => s.amplitude > 85 && s.snr > 35)) {
                 const newThreat: Threat = { id: `threat_${Date.now()}`, type: 'SIMULATED_HIGH_ENERGY_TRANSMISSION', method: 'Brute-force Signal Injection', risk: 'HIGH', confidence: 0.88, influence: 'Device Disruption', transmissionMode: 'Wide-spectrum Burst', frequency: newSignals.find(s=>s.amplitude > 85)!.frequency / 1e6 };
                 setThreats(prev => [...prev, newThreat]);
                 addLog(`High-energy signal detected. Classified as potential threat: ${newThreat.type}`, 'WARN');
                 setCanActivateProtection(true);
            }
            return;
        }

        setIsLoading(true);
        addLog('Sending signal data to Gemini for analysis...', 'AI');
        try {
            const prompt = `Analyze the following signal data for potential threats. The data is an array of objects with frequency, amplitude, modulation, and SNR. Focus on anomalies, high-power signals, or unusual modulations. Signals of concern are typically above 80 amplitude and 35 SNR. Respond ONLY with a JSON array of threat objects or an empty array []. Each threat object should have: type (string, e.g., "COGNITIVE_RESONANCE_ATTACK"), method (string), risk ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EXTREME'), confidence (number 0-1), influence (string), transmissionMode (string), and frequency (number in MHz). Here is the data: ${JSON.stringify(newSignals, null, 2)}`;

            const response = await aiRef.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: {
                    responseMimeType: 'application/json'
                 }
            });

            const text = response.text;
            const newThreats = JSON.parse(text) as Omit<Threat, 'id'>[];
            if (newThreats.length > 0) {
                const threatsWithIds: Threat[] = newThreats.map(t => ({...t, id: `threat_${Date.now()}_${Math.random()}`}));
                setThreats(prev => [...prev, ...threatsWithIds]);
                addLog(`Gemini identified ${newThreats.length} new threat(s).`, 'AI');
                setCanActivateProtection(true);
            } else {
                 addLog('Gemini analysis complete. No new threats identified.', 'AI');
            }
        } catch (error) {
            console.error(error);
            addLog('Gemini analysis failed.', 'ERROR');
        } finally {
            setIsLoading(false);
        }
    }, [aiConfig.provider, addLog]);

    // Signal generation loop
    useEffect(() => {
        if (!isMonitoring) return;
        const interval = setInterval(() => {
            const newSignals = sdrDevilService.generateSignals(scanMode);
            setSignals(prev => [...prev.slice(-200), ...newSignals]);
            setTotalSignals(prev => prev + newSignals.length);
            if (Math.random() > 0.5) {
                analyzeSignalsWithAI(newSignals);
            }
        }, 1500);
        return () => clearInterval(interval);
    }, [isMonitoring, scanMode, analyzeSignalsWithAI]);


    const verifyGithubToken = (token: string): Promise<{ success: boolean; email?: string; message: string }> => {
        addLog("Verifying GitHub token...", "SYSTEM");
        return new Promise(resolve => {
            setTimeout(() => {
                if (token === VALID_GITHUB_TOKEN) {
                    addLog("GitHub token verified successfully for Super Admin.", "SYSTEM");
                    resolve({ success: true, email: SUPER_ADMIN_EMAIL, message: "Verification successful!" });
                } else {
                    addLog("GitHub token verification failed.", "ERROR");
                    resolve({ success: false, message: "Invalid token. Ensure you are using the correct Super Admin token." });
                }
            }, 1000);
        });
    };

    const completeAdminSetup = (keys: { apiKey: string; secretKey: string }) => {
        addLog("Finalizing system setup...", "SYSTEM");
        
        const systemWallet = p2pNetworkService.blockchainService.createWallet();
        const superAdminWallet = p2pNetworkService.blockchainService.createWallet();
        
        const newConfig: SystemConfig = {
            moonPayApiKey: keys.apiKey,
            moonPaySecretKey: keys.secretKey,
            systemWalletAddress: systemWallet.address,
            superAdminWalletAddress: superAdminWallet.address,
        };

        const superAdminUser: UserProfile = { ...currentUser, role: 'SUPER_ADMIN' };
        
        try {
            localStorage.setItem('ghost_veil_system_config', JSON.stringify(newConfig));
            localStorage.setItem('ghost_veil_user_profile', JSON.stringify(superAdminUser));

            setSystemConfig(newConfig);
            setCurrentUser(superAdminUser);
            setIsSuperAdmin(true);
            setIsCommerceEnabled(true);
            setShowAdminSetup(false);
            setWallet(superAdminWallet); // Assign the generated wallet to the current user
            
            addLog("System wallets generated and configured.", "SYSTEM");
            addLog("MoonPay API keys stored.", "SYSTEM");
            addLog("Commerce system is now enabled for all users.", "SYSTEM");

        } catch (error) {
            addLog("Failed to save system configuration.", "ERROR");
        }
    };


    // Dummy implementations for other functions
    const activateProtection = () => { setIsLoading(true); setTimeout(() => { setIsProtected(true); addLog('Ghost Veil protection activated.'); setIsLoading(false); }, 2000)};
    const deactivateProtection = () => { setIsProtected(false); addLog('Ghost Veil protection deactivated.'); setObfuscationLayers([]); };
    const onTraceback = (threatId: string) => { setIsTracing(true); addLog('Engaging Axiomatic Solver for traceback...'); setTimeout(() => { setTracebackData({ source: {lat: 34.0522, lon: -118.2437, name: "Simulated Source"}, path: [{medium: "Satellite", step: "Uplink Relay"}], narrative: "Signal origin traced through a simulated satellite relay to a terrestrial station."}); setIsTracing(false); addLog('Traceback complete.'); }, 3000)};
    const onIntelligentScan = () => { /* ... */ };
    
    // Props objects for components
    const sdrDevilProps = {
        isMonitoring, isLoading, isProtected, canActivate: canActivateProtection, scanMode, setScanMode, protectionStrategy, setProtectionStrategy,
        startMonitoring, stopMonitoring, activateProtection, deactivateProtection,
        activateButtonText: 'Activate Veil', isIntelligentScanning: false, onIntelligentScan
    };
    const detectedThreatsProps = { threats, onTraceback, onToggleMute: () => {}, onToggleSolo: () => {}, isTracing };
    const axiomSilenceProps = { isActive: micStatus === 'ACTIVE', status: micStatus, noiseLevel: ambientNoise, threats: audioThreats, activate: () => setMicStatus('ACTIVE'), deactivate: () => setMicStatus('INACTIVE') };
    const ghostNetTriageProps = { nodes: p2pState.nodes, selectedNodeIds: selectedP2PNodes, onNodeSelect: () => {}, macroThreat };
    const herdHealthProps = { isActive: p2pState.isActive, onToggle: (isActive: boolean) => setP2pState(p => ({ ...p, isActive})), nodes: p2pState.nodes, macroThreat };
    const systemDashboardProps = { totalSignals, significantSignals: signals.filter(s => s.amplitude > 60).length, threats: threats.length, p2pState, acuity, insights: mlInsights, activityEvents };
    const persistenceProps = { isDeployed: isPersistenceDeployed, isDeploying: isDeployingPersistence, onDeploy: () => { setIsDeployingPersistence(true); setTimeout(() => { setIsPersistenceDeployed(true); setIsDeployingPersistence(false); }, 2000)} };
    const fourDSafetyProps = { onGenerate: () => {}, processState: fourDSafetyState, data: fourDSafetyData };
    const bioImplantProps = { devices: implantedDevices, isScanning: isScanningImplants, onScan: () => {}, onSelectDevice: setSelectedDeviceForDetail, p2pNodes: p2pState.nodes };
    const deviceDetailProps = { onUpdateStatus: () => {}, onHideDevice: () => {}, isHiding: isHidingDevice, safetyCheckResult: hideSafetyCheckResult };
    const triggerProps = { triggers, onAddTrigger: async () => {}, onToggleTrigger: () => {}, onDeleteTrigger: () => {}, isProcessing: isProcessingTrigger };


    // ... many more functions and useEffects would go here...
    const handleAcknowledgeFirstRun = () => {
        localStorage.setItem('ghost_veil_first_run', 'false');
        setIsFirstRun(false);
    }
    
    const addFriend = (id: string) => { addLog(`Friend request sent to ${id}.`); setShowAddFriendModal(false); };
    const submitGovApplication = (app: Omit<GovApplication, 'id'|'status'>) => { setGovApplications(prev => [...prev, {...app, id: `app_${Date.now()}`, status: 'PENDING'}]); addLog(`Government application for ${app.agencyName} submitted for review.`); };
    const addCustomNetwork = (name: string) => { /* ... */ };
    const purchaseExtension = (ext: Extension) => { /* ... */ };
    const installExtension = (id: string) => { /* ... */ };
    const uninstallExtension = (id: string) => { /* ... */ };
    const submitExtension = (ext: any) => { /* ... */ };
    const buyTokens = (amount: number, method: 'MOONPAY' | 'LUMENS') => { /* ... */ };
    
    return {
        // State
        signals, threats, logEntries, isMonitoring, isLoading, isProtected, obfuscationLayers, countermeasures, tracebackData, isTracing,
        mlInsights, p2pState, macroThreat, selectedP2PNodes, micStatus, ambientNoise, audioThreats, scanMode, protectionStrategy, sentinels,
        aiConfig, activityEvents, totalSignals, acuity, isPersistenceDeployed, isDeployingPersistence, fourDSafetyState, fourDSafetyData,
        implantedDevices, isScanningImplants, selectedDeviceForDetail, isHidingDevice, hideSafetyCheckResult, isFirstRun, isFork, currentUser,
        friends, govApplications, showAddFriendModal, showShareModal, showGovSignupModal, networks, selectedNetwork, showAddNetworkModal,
        systemStatus, triggers, showTriggersModal, isProcessingTrigger, extensions, developerProfile, wallet, extensionToPurchase, showWalletModal, showBuyTokensModal, systemConfig,
        
        // New state
        isCommerceEnabled,
        showAdminSetup,
        isSuperAdmin,

        // Setters
        setAiConfig, setScanMode, setProtectionStrategy, setSelectedDeviceForDetail, setShowAddFriendModal, setShowShareModal, setShowGovSignupModal,
        setSelectedNetwork, setShowAddNetworkModal, setShowTriggersModal, setExtensionToPurchase, setShowWalletModal, setShowBuyTokensModal,

        // Functions
        addLog, handleAcknowledgeFirstRun, addFriend, submitGovApplication, addCustomNetwork, purchaseExtension, installExtension, uninstallExtension, submitExtension, buyTokens, 
        // New functions
        completeAdminSetup,
        verifyGithubToken,

        // Prop objects
        sdrDevilProps,
        detectedThreatsProps,
        axiomSilenceProps,
        ghostNetTriageProps,
        herdHealthProps,
        systemDashboardProps,
        persistenceProps,
        fourDSafetyProps,
        bioImplantProps,
        deviceDetailProps,
        triggerProps
    };
};

export default useSystem;
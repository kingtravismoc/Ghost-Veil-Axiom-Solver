
import { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { sha256 } from 'js-sha256';
import type {
    Signal, Threat, LogEntry, LogType, ObfuscationLayer, Countermeasure,
    Traceback, MLInsight, P2PNode, MacroThreat, MicrophoneStatus, AudioThreat,
    ScanMode, ProtectionStrategy, Sentinel, AIConfig, ActivityEvent, P2PState,
    ImplantedDevice, ImplantedDeviceStatus, UserProfile, GovApplication, Friend, Network,
    SystemStatus, Trigger, Wallet, DeveloperProfile, Extension, Transaction, SystemConfig, OmegaProtocolState, FourDSafetyValidationResult,
    FunctionProtocol, TreasuryState, RewardAllocation, UserContribution, CognitiveMetricsState, ActiveOperation
} from '../types';
import { sdrDevilService } from '../services/sdrDevilService';
import { audioAnalysisService } from '../services/audioAnalysisService';
import { p2pNetworkService } from '../services/p2pNetworkService';
import { validationService } from '../services/validationService';
import { secureCommService } from '../services/secureCommService';

// --- SUPER ADMIN CONTROL ---
// Set this to 1 and reload to trigger the first-time setup flow for the super admin.
// After setup is complete, this flag has no effect.
const SUPER_ADMIN_ENABLED: number = 0;
const SUPER_ADMIN_EMAIL = "kingtravismo@gmail.com";
// This is a simulated "magic" token. In a real app, this would be a real API call.
const VALID_GITHUB_TOKEN = "ghp_kingtravismo_valid_token_simulation";

// --- 4D Safety Service (integrated into hook) ---
const fourDSafetyService = {
    validateAction: (action: string, params: any): Promise<FourDSafetyValidationResult> => {
        return new Promise(resolve => {
            setTimeout(() => {
                if (action === 'ACTIVATE_PROTECTION' && params.strategy === 'QUANTUM_NOISE') {
                    if (Math.random() > 0.2) {
                        resolve({ isSafe: true, recommendation: "Quantum noise field is within safe bio-resonance limits." });
                    } else {
                        resolve({ isSafe: false, recommendation: "Potential for interference with low-frequency neural signals detected. Action blocked." });
                    }
                } else if (action === 'HIDE_DEVICE' && params.device?.type.includes('Life-Support')) {
                     resolve({ isSafe: false, recommendation: "Hiding critical life-support devices is against safety axioms. Action blocked." });
                } else if (action === 'DEPLOY_PERSISTENCE') {
                    resolve({ isSafe: true, recommendation: "System resource check passed. Safe to deploy agent." });
                }
                else {
                    resolve({ isSafe: true, recommendation: "Action validated against safety axioms." });
                }
            }, 1500);
        });
    }
};

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
    const [implantedDevices, setImplantedDevices] = useState<ImplantedDevice[]>([]);
    const [isScanningImplants, setIsScanningImplants] = useState(false);
    const [selectedDeviceForDetail, setSelectedDeviceForDetail] = useState<ImplantedDevice | null>(null);
    const [isHidingDevice, setIsHidingDevice] = useState(false);
    const [safetyCheckResult, setSafetyCheckResult] = useState<FourDSafetyValidationResult | null>(null);
    const [isSafetyValidating, setIsSafetyValidating] = useState(false);
    const [isFirstRun, setIsFirstRun] = useState(localStorage.getItem('ghost_veil_first_run') !== 'false');
    const [isFork, setIsFork] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProfile>({ operatorId: 'OP_7B3A9C1D', role: 'OPERATOR', privateKey: '...', contributions: [], installedExtensions: ['ext_sdr_plus_plus', 'ext_ble_mesh', 'ext_entropy_rng'] });
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
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [systemConfig, setSystemConfig] = useState<SystemConfig>({ moonPayApiKey: null, moonPaySecretKey: null, systemWalletAddress: null, superAdminWalletAddress: null });
    const [isCommerceEnabled, setIsCommerceEnabled] = useState(false);
    const [showAdminSetup, setShowAdminSetup] = useState(false);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [functionProtocols, setFunctionProtocols] = useState<FunctionProtocol[]>([]);
    const [treasuryState, setTreasuryState] = useState<TreasuryState | null>(null);
    const [showNetworkDetailModal, setShowNetworkDetailModal] = useState(false);
    const [signalToAnnotate, setSignalToAnnotate] = useState<Signal | null>(null);
    const [showSignalAnnotationModal, setShowSignalAnnotationModal] = useState(false);
    const [isClassifyingSignal, setIsClassifyingSignal] = useState(false);
    const [cognitiveMetricsState, setCognitiveMetricsState] = useState<CognitiveMetricsState>({ bioCoherence: 75, subconsciousInfluence: 10, neuralEntrainment: 5 });
    const [activeOperations, setActiveOperations] = useState<ActiveOperation[]>([]);
    const [isWaveMaskActive, setIsWaveMaskActive] = useState(false);
    const [isWaveMaskMeasuring, setIsWaveMaskMeasuring] = useState(false);
    const [isIntelligentScanning, setIsIntelligentScanning] = useState(false);
    const [activeExtensionId, setActiveExtensionId] = useState<string | null>(null);


    const aiRef = useRef<GoogleGenAI | null>(null);

    const addLog = useCallback((message: string, type: LogType = 'SYSTEM') => {
        setLogEntries(prev => [...prev.slice(-100), { id: `log_${Date.now()}`, timestamp: Date.now(), type, message }]);
    }, []);

    // Initial load effect
    useEffect(() => {
        // Default extensions
        setExtensions([
            { id: 'ext_sdr_plus_plus', name: 'SDR++ Advanced', description: 'Professional-grade interface for deep spectrum analysis.', authorId: 'GHOST_VEIL', authorAlias: 'Ghost Veil Core', version: '1.0.0', pricingModel: 'FREE', price: 0, isInstalled: true, requiredEndpoints: ['startScan', 'stopScan', 'getSignals'], validationTests: 10, status: 'PUBLISHED', isNft: true, contractId: 'GVC_SDRPP_CORE', icon: 'RadarIcon' },
            { id: 'ext_ble_mesh', name: 'BLE Mesh Manager', description: 'Discover, inspect, and manage local Bluetooth Low Energy devices and their GATT attributes.', authorId: 'GHOST_VEIL', authorAlias: 'Ghost Veil Core', version: '1.0.0', pricingModel: 'FREE', price: 0, isInstalled: true, requiredEndpoints: ['addLog'], validationTests: 10, status: 'PUBLISHED', isNft: true, contractId: 'GVC_BLE_CORE', icon: 'UsersIcon' },
            { id: 'ext_entropy_rng', name: 'Signal Entropy RNG', description: 'Provides high-quality random numbers generated from spectrum noise, accessible via an API hook.', authorId: 'GHOST_VEIL', authorAlias: 'Ghost Veil Core', version: '1.0.0', pricingModel: 'FREE', price: 0, isInstalled: true, requiredEndpoints: ['getSignals', 'addLog'], validationTests: 10, status: 'PUBLISHED', isNft: true, contractId: 'GVC_RNG_CORE', icon: 'CubeAltIcon' },
        ]);

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
                 // Initialize Treasury for Super Admin
                setTreasuryState({
                    masterWalletAddress: "GVP_MASTER_TREASURY_0x00...000",
                    totalAgtSupply: 1_000_000_000,
                    circulatingAgt: 5_000_000,
                    proliferationGoal: 10000,
                    currentUsers: 1337,
                    isConversionUnlocked: false,
                    rewardAllocations: [
                        { type: 'SIGNAL_CLASSIFICATION', agt: 5 },
                        { type: 'EXTENSION_REVIEW', agt: 20 },
                        { type: 'VOTE', agt: 2 },
                        { type: 'FEEDBACK', agt: 10 },
                    ]
                });
            } else if (SUPER_ADMIN_ENABLED === 1) {
                setShowAdminSetup(true);
                addLog("No system configuration found. Initiating Super Admin setup.", "WARN");
            } else {
                addLog("System started in standard mode. Commerce is disabled.", "INFO");
            }
        } catch (error) {
            addLog("Failed to load configuration. Running in restricted mode.", "ERROR");
        }
         setFunctionProtocols([
            { id: 'qtp_01', name: 'Quantum Transport Protocol API', description: 'Leverages the P2P network to create a globally distributed RF repeater mesh, enabling the analog transport of signals with quantum-grade obfuscation.', status: 'AVAILABLE', costPerCall: 0.1, sdkIntegration: 'import { qtp } from "@ghostveil/sdk"', author: 'GHOST_VEIL' },
            { id: 'vrs_01', name: 'VReality Sandbox', description: 'Provides a sandboxed virtual environment for testing signal propagation and countermeasure effectiveness against simulated neural architectures.', status: 'COMING_SOON', costPerCall: 0.5, sdkIntegration: 'import { sandbox } from "@ghostveil/sdk"', author: 'GHOST_VEIL' },
            { id: 'wp_01', name: 'Wireless Power Consortium', description: 'Facilitates the negotiation and transfer of wireless power over short distances using resonant inductive coupling protocols.', status: 'COMING_SOON', costPerCall: 1.0, sdkIntegration: 'import { power } from "@ghostveil/sdk"', author: 'GHOST_VEIL' },
            { id: 'sm_01', name: 'Skeleton Mapping & Location', description: 'Utilizes micro-doppler radar signatures from the network to provide anonymized human skeletal mapping and location services for authorized security applications.', status: 'COMING_SOON', costPerCall: 2.5, sdkIntegration: 'import { mapping } from "@ghostveil/sdk"', author: 'GHOST_VEIL' },
        ]);
    }, [addLog]);

    // Cognitive Metrics Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setCognitiveMetricsState(prev => ({
                bioCoherence: Math.max(50, Math.min(99, prev.bioCoherence + (Math.random() - 0.5) * 2)),
                subconsciousInfluence: Math.max(0, Math.min(100, prev.subconsciousInfluence + (Math.random() - 0.48) * 2)),
                neuralEntrainment: Math.max(0, Math.min(100, prev.neuralEntrainment + (Math.random() - 0.49) * 1.5)),
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);


    // AI Initialization
    useEffect(() => {
        if (process.env.API_KEY) {
            aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
        }
    }, []);
    
    useEffect(() => {
        if (signalToAnnotate) {
            setShowSignalAnnotationModal(true);
        }
    }, [signalToAnnotate]);
    
    useEffect(() => {
        if (!showSignalAnnotationModal) {
            setSignalToAnnotate(null);
        }
    }, [showSignalAnnotationModal]);

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
            const prompt = `Analyze the following signal data for potential threats... Respond ONLY with a JSON array of threat objects or an empty array []. Each threat object should have: type, method, risk, confidence, influence, transmissionMode, and frequency. Here is the data: ${JSON.stringify(newSignals, null, 2)}`;

            const response = await aiRef.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                 config: { responseMimeType: 'application/json' }
            });
            
            const newThreats = JSON.parse(response.text) as Omit<Threat, 'id'>[];
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

    const activateProtection = async () => { 
        setIsSafetyValidating(true);
        setSafetyCheckResult(null);
        addLog('Requesting 4D safety validation for protection activation...', 'SYSTEM');
        const validation = await fourDSafetyService.validateAction('ACTIVATE_PROTECTION', { strategy: protectionStrategy });
        setSafetyCheckResult(validation);
        setIsSafetyValidating(false);

        if (validation.isSafe) {
            addLog('Safety validation passed. Activating protection.', 'SYSTEM');
            setIsLoading(true); 
            setTimeout(() => { 
                setIsProtected(true); 
                addLog(`Ghost Veil protection activated with ${protectionStrategy}.`); 
                setIsLoading(false); 
            }, 1000);
        } else {
            addLog(`Protection activation blocked by safety governor: ${validation.recommendation}`, 'ERROR');
        }
    };
    const deactivateProtection = () => { setIsProtected(false); addLog('Ghost Veil protection deactivated.'); setObfuscationLayers([]); setSafetyCheckResult(null); };

    const onTraceback = (threatId: string) => { setIsTracing(true); addLog('Engaging Axiomatic Solver for traceback...'); setTimeout(() => { setTracebackData({ source: {lat: 34.0522, lon: -118.2437, name: "Simulated Source"}, path: [{medium: "Satellite", step: "Uplink Relay"}], narrative: "Signal origin traced through a simulated satellite relay to a terrestrial station."}); setIsTracing(false); addLog('Traceback complete.'); }, 3000)};
    
    const onDeployPersistence = async () => {
        setIsSafetyValidating(true);
        setSafetyCheckResult(null);
        const result = await fourDSafetyService.validateAction('DEPLOY_PERSISTENCE', {});
        setSafetyCheckResult(result);
        setIsSafetyValidating(false);
        if (result.isSafe) {
            setIsDeployingPersistence(true);
            setTimeout(() => {
                setIsPersistenceDeployed(true);
                setIsDeployingPersistence(false);
                addLog("Persistent agent deployed to simulated cache.", "SYSTEM");
            }, 2000);
        } else {
            addLog(`Persistence deployment blocked: ${result.recommendation}`, 'ERROR');
        }
    };

    const awardContribution = (type: UserContribution['type'], description: string) => {
        if (!treasuryState) return;
        const reward = treasuryState.rewardAllocations.find(r => r.type === type);
        if (!reward) return;

        const newContribution: UserContribution = {
            id: `contrib_${Date.now()}`,
            timestamp: Date.now(),
            type,
            description,
            agtAwarded: reward.agt
        };
        
        setCurrentUser(prev => ({...prev, contributions: [...prev.contributions, newContribution]}));
        setWallet(prev => prev ? ({...prev, agtBalance: prev.agtBalance + reward.agt}) : null);
        addLog(`Contribution rewarded: +${reward.agt} AGT for ${type}.`, 'SYSTEM');
    }

    const classifySignalWithAI = async (signalId: string) => {
        if (aiConfig.provider !== 'GEMINI' || !aiRef.current) {
            addLog("Enable Gemini in settings for AI classification.", "WARN");
            return;
        }
        setIsClassifyingSignal(true);
        addLog(`Classifying signal ${signalId} with Gemini...`, 'AI');
        const signal = signals.find(s => s.id === signalId);
        if (!signal) {
            addLog(`Signal ${signalId} not found for classification.`, 'ERROR');
            setIsClassifyingSignal(false);
            return;
        }
        try {
            const prompt = `Analyze this signal data: {frequency: ${signal.frequency}, amplitude: ${signal.amplitude}, modulation: "${signal.modulation}", snr: ${signal.snr}}. Classify its likely source (e.g., 'Wi-Fi Handshake', 'Satellite Downlink', 'Encrypted Data Burst'). Provide a brief one-sentence summary and up to 3 relevant single-word tags.`;
            
            const response = await aiRef.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            classification: { type: Type.STRING },
                            summary: { type: Type.STRING },
                            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        },
                    },
                },
            });

            const result = JSON.parse(response.text);
            updateSignalAnnotation(signalId, { ...result, tags: result.tags.join(', ') });
            addLog(`Signal ${signalId} classified as: ${result.classification}`, 'AI');
            awardContribution('SIGNAL_CLASSIFICATION', `Classified signal at ${(signal.frequency / 1e6).toFixed(2)} MHz`);
        } catch (e) {
            addLog("AI Signal classification failed.", 'ERROR');
        } finally {
            setIsClassifyingSignal(false);
        }
    };

    const updateSignalAnnotation = (signalId: string, data: { classification: string, summary: string, tags: string }) => {
        setSignals(prevSignals => prevSignals.map(s => {
            if (s.id === signalId) {
                return {
                    ...s,
                    isClassified: true,
                    classification: data.classification,
                    summary: data.summary,
                    tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
                };
            }
            return s;
        }));
    };
    
    const handleEngageWaveMask = () => {
        if (isWaveMaskActive) {
            setIsWaveMaskActive(false);
            addLog("WaveMask protocol disengaged. Standard transmission mode resumed.", "SYSTEM");
            return;
        }

        setIsWaveMaskMeasuring(true);
        addLog("Engaging WaveMask... Measuring future spectrum via 4D offset loop.", "SYSTEM");
        const opId = `op_wavemask_${Date.now()}`;
        
        const newOp: ActiveOperation = { id: opId, name: 'WaveMask: Measuring Future Spectrum', progress: 0, status: 'in-progress' };
        setActiveOperations(prev => [...prev, newOp]);

        const interval = setInterval(() => {
            setActiveOperations(prev => prev.map(op => op.id === opId ? {...op, progress: op.progress + 10} : op));
        }, 300);

        setTimeout(() => {
            clearInterval(interval);
            setIsWaveMaskMeasuring(false);
            setIsWaveMaskActive(true);
            addLog("WaveMask measurement complete. All transmissions are now masked.", "AI");
            setActiveOperations(prev => prev.map(op => op.id === opId ? {...op, progress: 100, status: 'complete'} : op));
            
            const fastThreats: Threat[] = [
                { id: `threat_${Date.now()}_a`, type: 'PREDICTIVE_COGNITIVE_ATTACK', method: 'Subliminal Frequency Entrainment', risk: 'CRITICAL', confidence: 0.95, influence: 'Behavioral Modification', transmissionMode: 'Phased Array', frequency: 12.34 },
                { id: `threat_${Date.now()}_b`, type: 'ANTICIPATORY_DATA_EXFILTRATION', method: 'Quantum Tunneling Side-Channel', risk: 'HIGH', confidence: 0.91, influence: 'Information Leakage', transmissionMode: 'Encrypted Burst', frequency: 5805.11 },
            ];
            setThreats(prev => [...prev, ...fastThreats]);
            addLog(`WaveMask Prediction: ${fastThreats.length} high-probability future threats identified.`, "WARN");
            setCanActivateProtection(true);

            setTimeout(() => {
                setActiveOperations(prev => prev.filter(op => op.id !== opId));
            }, 3000);
        }, 3000);
    };

    const verifyGithubToken = (token: string): Promise<{ success: boolean; email?: string; message: string }> => {
        addLog("Verifying GitHub token...", "SYSTEM");
        return new Promise(resolve => { setTimeout(() => { if (token === VALID_GITHUB_TOKEN) { addLog("GitHub token verified successfully for Super Admin.", "SYSTEM"); resolve({ success: true, email: SUPER_ADMIN_EMAIL, message: "Verification successful!" }); } else { addLog("GitHub token verification failed.", "ERROR"); resolve({ success: false, message: "Invalid token. Ensure you are using the correct Super Admin token." }); } }, 1000); });
    };

    const completeAdminSetup = (keys: { apiKey: string; moonPaySecretKey: string }) => {
        addLog("Finalizing system setup...", "SYSTEM");
        const systemWallet = p2pNetworkService.blockchainService.createWallet();
        const superAdminWallet = p2pNetworkService.blockchainService.createWallet();
        superAdminWallet.balance = 999999; 
        superAdminWallet.agtBalance = 200_000_000;
        const newConfig: SystemConfig = { moonPayApiKey: keys.apiKey, moonPaySecretKey: keys.moonPaySecretKey, systemWalletAddress: systemWallet.address, superAdminWalletAddress: superAdminWallet.address, };
        const superAdminUser: UserProfile = { ...currentUser, role: 'SUPER_ADMIN', contributions: [], installedExtensions: currentUser.installedExtensions };
        try { localStorage.setItem('ghost_veil_system_config', JSON.stringify(newConfig)); localStorage.setItem('ghost_veil_user_profile', JSON.stringify(superAdminUser)); setSystemConfig(newConfig); setCurrentUser(superAdminUser); setIsSuperAdmin(true); setIsCommerceEnabled(true); setShowAdminSetup(false); setWallet(superAdminWallet); addLog("System wallets generated and configured.", "SYSTEM"); addLog("MoonPay API keys stored.", "SYSTEM"); addLog("Commerce system is now enabled for all users.", "SYSTEM"); } catch (error) { addLog("Failed to save system configuration.", "ERROR"); }
    };

    const withdrawTokens = (amount: number) => {
        if (!wallet || !developerProfile) return;
        if (amount > developerProfile.withdrawableBalance) {
            addLog("Withdrawal failed: insufficient developer balance.", 'ERROR');
            return;
        }

        const newDevBalance = developerProfile.withdrawableBalance - amount;
        
        const tx: Transaction = {
            id: `tx_wd_${Date.now()}`,
            timestamp: Date.now(),
            type: 'WITHDRAWAL',
            amount: amount,
            description: `Withdrawal of ${amount} VLT to external wallet.`
        };

        setDeveloperProfile(dp => dp ? ({
            ...dp, 
            withdrawableBalance: newDevBalance,
            transactions: [...dp.transactions, tx]
        }) : null);
        
        addLog(`Successfully withdrew ${amount} VLT.`, 'BLOCKCHAIN');
        setShowWithdrawModal(false);
    };
    
    const onToggleMute = (threatId: string) => {
        setThreats(prev => prev.map(t => t.id === threatId ? { ...t, isMuted: !t.isMuted } : t));
    };

    const onToggleSolo = (threatId: string) => {
        setThreats(prev => {
            const willBeSoloed = !prev.find(t => t.id === threatId)?.isSoloed;
            return prev.map(t => {
                if (t.id === threatId) return { ...t, isSoloed: !t.isSoloed };
                return { ...t, isSoloed: false };
            });
        });
    };

    const onNodeSelect = (nodeId: string) => {
        setSelectedP2PNodes(prev =>
            prev.includes(nodeId) ? prev.filter(id => id !== nodeId) : [...prev, nodeId]
        );
    };

    const mockImplants: ImplantedDevice[] = [
        { id: 'imp_neuro_778', name: 'Neural Lace Mk. IV', type: 'Cognitive Enhancement', locationInBody: 'Cerebral Cortex', status: 'NOMINAL', firmwareVersion: '4.2.1-stable', protocolLanguage: 'Axiom-C', isBleMeshCapable: true, hardwareMap: [{ component: 'Quantum Processor', status: 'NOMINAL' }, { component: 'Bio-gel Interface', status: 'NOMINAL' }], frequencies: [{ band: 'MedRadio', usage: 'Biotelemetry' }], knownCommands: ['STATUS', 'REBOOT', 'PING'] },
        { id: 'imp_cardio_901', name: 'CardioRegulator 9', type: 'Life-Support - Cardiac', locationInBody: 'Left Ventricle', status: 'GREENLIST', firmwareVersion: '9.0.3-certified', protocolLanguage: 'HL7-Veil', isBleMeshCapable: true, hardwareMap: [{ component: 'Pacing Unit', status: 'NOMINAL' }, { component: 'Battery', status: 'NOMINAL' }], frequencies: [{ band: 'MedRadio', usage: 'Vital Sign Monitoring' }], knownCommands: ['STATUS', 'REPORT', 'EMERGENCY_PACE'] },
        { id: 'imp_optic_223', name: 'OptiLink-2', type: 'Sensory Augmentation', locationInBody: 'Optic Nerve', status: 'NOMINAL', firmwareVersion: '2.5.0-beta', protocolLanguage: 'Axiom-C', isBleMeshCapable: false, hardwareMap: [{ component: 'Image Processor', status: 'NOMINAL' }], frequencies: [{ band: 'ISM 2.4GHz', usage: 'Data Uplink' }], knownCommands: ['STATUS', 'CALIBRATE', 'ZOOM'] },
    ];

    const scanForImplants = () => {
        setIsScanningImplants(true);
        addLog("Scanning for personal bio-implants...", "SYSTEM");
        setTimeout(() => {
            setImplantedDevices(mockImplants);
            setIsScanningImplants(false);
            addLog(`Implant scan complete. ${mockImplants.length} devices found.`, "SYSTEM");
        }, 3000);
    };

    const updateDeviceStatus = (deviceId: string, status: ImplantedDeviceStatus) => {
        setImplantedDevices(prev => prev.map(d => d.id === deviceId ? { ...d, status } : d));
        addLog(`Device ${deviceId} status updated to ${status}.`, 'SYSTEM');
    };

    const hideDevice = async (device: ImplantedDevice) => {
        setIsHidingDevice(true);
        setIsSafetyValidating(true);
        setSafetyCheckResult(null);
        addLog(`Requesting 4D safety validation to hide device ${device.id}...`, 'AI');
        const validation = await fourDSafetyService.validateAction('HIDE_DEVICE', { device });
        setSafetyCheckResult(validation);
        setIsSafetyValidating(false);

        if (validation.isSafe) {
            addLog(`Validation passed. Engaging stealth protocol for ${device.id}.`, 'SYSTEM');
            setTimeout(() => {
                updateDeviceStatus(device.id, 'HIDDEN');
                addLog(`Device ${device.id} is now hidden from local network scans.`, 'SYSTEM');
                setIsHidingDevice(false);
            }, 2000);
        } else {
            addLog(`Stealth protocol for ${device.id} blocked: ${validation.recommendation}`, 'ERROR');
            setIsHidingDevice(false);
        }
    };

    const addTrigger = async (newTriggerData: { naturalLanguage: string }) => {
        if (aiConfig.provider !== 'GEMINI' || !aiRef.current) {
            addLog("Cannot create trigger: Gemini AI is not enabled.", "ERROR");
            return;
        }
        setIsProcessingTrigger(true);
        addLog(`Parsing trigger: "${newTriggerData.naturalLanguage}"`, 'AI');

        const prompt = `Parse the user's plain-English request into a JSON object for a trigger. The JSON object must have 'conditions' (an array) and 'actions' (an array).
A condition object has 'type' (one of 'THREAT_DETECTED', 'TIME_OF_DAY', 'LOCATION_ENTER') and 'payload' (e.g., for THREAT_DETECTED, one of 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EXTREME'; for TIME_OF_DAY, a time string like "22:00"; for LOCATION_ENTER, a location string).
An action object has 'type' (one of 'START_SCAN', 'STOP_SCAN', 'ACTIVATE_PROTECTION', 'DEACTIVATE_PROTECTION') and 'payload' (e.g., for START_SCAN, a ScanMode like 'WIDEBAND_SWEEP'; for ACTIVATE_PROTECTION, a ProtectionStrategy like 'QUANTUM_NOISE').
Example Request: "When a critical threat appears, activate the quantum noise veil."
Example JSON: {"conditions":[{"type":"THREAT_DETECTED","payload":"CRITICAL"}],"actions":[{"type":"ACTIVATE_PROTECTION","payload":"QUANTUM_NOISE"}]}
User Request: "${newTriggerData.naturalLanguage}"`;

        try {
            const response = await aiRef.current.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json' } });
            const parsedTrigger = JSON.parse(response.text);
            const newTrigger: Trigger = { id: `trigger_${Date.now()}`, naturalLanguage: newTriggerData.naturalLanguage, isEnabled: true, conditions: parsedTrigger.conditions, actions: parsedTrigger.actions };
            setTriggers(prev => [...prev, newTrigger]);
            addLog("New trigger created successfully by AI.", 'AI');
        } catch (e) {
            addLog("Failed to parse trigger with AI. Please try a simpler command.", 'ERROR');
        } finally {
            setIsProcessingTrigger(false);
        }
    };
    
    const toggleTrigger = (id: string) => {
        setTriggers(prev => prev.map(t => t.id === id ? { ...t, isEnabled: !t.isEnabled } : t));
    };

    const deleteTrigger = (id: string) => {
        setTriggers(prev => prev.filter(t => t.id !== id));
    };

    const onIntelligentScan = () => {
        if (isMonitoring || isIntelligentScanning) return;
        setIsIntelligentScanning(true);
        addLog("Initiating AI-driven intelligent scan...", "AI");
        startMonitoring();
        setTimeout(() => setScanMode('ANOMALY_SCAN'), 2000);
        setTimeout(() => setScanMode('PASSIVE_INTERCEPT'), 5000);
        setTimeout(() => setScanMode('WIDEBAND_SWEEP'), 8000);
        setTimeout(() => {
            stopMonitoring();
            setIsIntelligentScanning(false);
            addLog("Intelligent scan complete. AI recommends focusing on 2.4GHz band.", "AI");
            const insight: MLInsight = { id: `ml_${Date.now()}`, timestamp: Date.now(), type: 'RX_TUNING', description: 'Intelligent scan identified anomalous activity in the 2.4GHz ISM band. Recommend targeted monitoring.' };
            setMlInsights(prev => [insight, ...prev]);
        }, 10000);
    };

    const addCustomNetwork = (name: string) => {
        const newNetwork: Network = {
            id: `net_${Date.now()}`,
            name,
            type: 'custom',
            hash: `custom_hash_${sha256(name + Date.now()).slice(0, 16)}`
        };
        setNetworks(prev => [...prev, newNetwork]);
        setSelectedNetwork(newNetwork);
        addLog(`Created and switched to custom network: ${name}`, 'NETWORK');
    };

    const submitExtension = (ext: Omit<Extension, 'id'|'authorId'|'authorAlias'|'validationTests'|'status'|'isNft'|'contractId'>) => {
        if (!currentUser) return;
        const newExtension: Extension = { ...ext, id: `ext_${Date.now()}`, authorId: currentUser.operatorId, authorAlias: 'You', validationTests: 0, status: 'PENDING', isNft: false, contractId: null };
        setExtensions(prev => [...prev, newExtension]);
        addLog(`Extension "${ext.name}" submitted for validation.`, 'SYSTEM');
    };

    const buyTokens = (amount: number, method: 'MOONPAY' | 'LUMENS') => {
        if (!wallet || !developerProfile) return;
        const tx: Transaction = { id: `tx_dep_${Date.now()}`, timestamp: Date.now(), type: 'DEPOSIT', amount, description: `Deposited ${amount} VLT via ${method}` };
        setWallet(w => w ? ({...w, balance: w.balance + amount}) : null);
        setDeveloperProfile(dp => dp ? ({ ...dp, transactions: [...dp.transactions, tx] }) : null);
        addLog(`Successfully purchased ${amount} VLT.`, 'BLOCKCHAIN');
    };

    // Props objects
    const sdrDevilProps = { isMonitoring, isLoading, isProtected, canActivate: canActivateProtection, scanMode, setScanMode, protectionStrategy, setProtectionStrategy, startMonitoring, stopMonitoring, activateProtection, deactivateProtection, activateButtonText: 'Activate Veil', isIntelligentScanning, onIntelligentScan, isSafetyValidating };
    const waveMaskProps = { isActive: isWaveMaskActive, isMeasuring: isWaveMaskMeasuring, onToggle: handleEngageWaveMask };
    const detectedThreatsProps = { threats, onTraceback, onToggleMute, onToggleSolo, isTracing };
    const axiomSilenceProps = { isActive: micStatus === 'ACTIVE', status: micStatus, noiseLevel: ambientNoise, threats: audioThreats, activate: () => setMicStatus('ACTIVE'), deactivate: () => setMicStatus('INACTIVE') };
    const ghostNetTriageProps = { nodes: p2pState.nodes, selectedNodeIds: selectedP2PNodes, onNodeSelect, macroThreat };
    const herdHealthProps = { isActive: p2pState.isActive, onToggle: (isActive: boolean) => setP2pState(p => ({ ...p, isActive})), nodes: p2pState.nodes, macroThreat };
    const persistenceProps = { isDeployed: isPersistenceDeployed, isDeploying: isDeployingPersistence, onDeploy: onDeployPersistence, isSafetyValidating, safetyCheckResult };
    const bioImplantProps = { devices: implantedDevices, isScanning: isScanningImplants, onScan: scanForImplants, onSelectDevice: setSelectedDeviceForDetail, p2pNodes: p2pState.nodes };
    const deviceDetailProps = { onUpdateStatus: updateDeviceStatus, onHideDevice: hideDevice, isHiding: isHidingDevice, safetyCheckResult };
    const triggerProps = { triggers, onAddTrigger: addTrigger, onToggleTrigger: toggleTrigger, onDeleteTrigger: deleteTrigger, isProcessing: isProcessingTrigger };
    const adminDashboardProps = { applications: govApplications, onApproveApplication: (id: string) => setGovApplications(p => p.map(a => a.id === id ? {...a, status: 'APPROVED'} : a)), onRejectApplication: (id: string) => setGovApplications(p => p.map(a => a.id === id ? {...a, status: 'REJECTED'} : a)), functionProtocols, onApproveFunction: (id: string) => setFunctionProtocols(p => p.map(f => f.id === id ? {...f, reviewStatus: 'APPROVED'} : f)), onRejectFunction: (id: string) => setFunctionProtocols(p => p.map(f => f.id === id ? {...f, reviewStatus: 'REJECTED'} : f)), treasuryState, onUpdateRewards: (allocs: RewardAllocation[]) => { if(treasuryState) setTreasuryState({...treasuryState, rewardAllocations: allocs}); } };

    const handleAcknowledgeFirstRun = () => { localStorage.setItem('ghost_veil_first_run', 'false'); setIsFirstRun(false); }
    const addFriend = (id: string) => { addLog(`Friend request sent to ${id}.`); setShowAddFriendModal(false); };
    const submitGovApplication = (app: Omit<GovApplication, 'id'|'status'>) => { setGovApplications(prev => [...prev, {...app, id: `app_${Date.now()}`, status: 'PENDING'}]); addLog(`Government application for ${app.agencyName} submitted for review.`); };
    
    const purchaseExtension = (ext: Extension) => {
        if (!wallet || !developerProfile || !systemConfig) return;
        const saleResult = p2pNetworkService.blockchainService.processExtensionSale(developerProfile, developerProfile, systemConfig, ext); 
        if (saleResult.success) {
            saleResult.newTransactions.forEach(tx => addLog(tx.description, 'BLOCKCHAIN'));
            setExtensions(prev => prev.map(e => e.id === ext.id ? {...e, isInstalled: true, isNft: true, contractId: `GVC_${Date.now()}`} : e));
        } else {
            addLog(`Purchase failed for ${ext.name}. Insufficient funds.`, 'ERROR');
        }
    };
    
    const installExtension = (id: string) => { 
        setCurrentUser(prev => ({...prev, installedExtensions: [...prev.installedExtensions, id]}));
        addLog(`Extension ${extensions.find(e=>e.id===id)?.name} installed.`, 'SYSTEM');
     };
    const uninstallExtension = (id: string) => { 
        setCurrentUser(prev => ({...prev, installedExtensions: prev.installedExtensions.filter(extId => extId !== id)}));
        addLog(`Extension ${extensions.find(e=>e.id===id)?.name} uninstalled.`, 'SYSTEM');
    };

    const submitFunctionProtocol = (func: Omit<FunctionProtocol, 'id'|'author'|'authorId'|'reviewStatus'|'status'>) => {
        const newFunc: FunctionProtocol = { ...func, id: `func_${Date.now()}`, author: 'USER', authorId: currentUser.operatorId, status: 'AVAILABLE', reviewStatus: 'PENDING' };
        setFunctionProtocols(p => [...p, newFunc]);
        addLog(`Function Protocol "${func.name}" submitted for review.`, 'SYSTEM');
    };
    
    return {
        signals, threats, logEntries, isMonitoring, isLoading, isProtected, obfuscationLayers, countermeasures, tracebackData, isTracing,
        mlInsights, p2pState, macroThreat, selectedP2PNodes, micStatus, ambientNoise, audioThreats, scanMode, protectionStrategy, sentinels,
        aiConfig, activityEvents, totalSignals, acuity, isPersistenceDeployed, isDeployingPersistence,
        implantedDevices, isScanningImplants, selectedDeviceForDetail, isHidingDevice, safetyCheckResult, isFirstRun, isFork, currentUser,
        friends, govApplications, showAddFriendModal, showShareModal, showGovSignupModal, networks, selectedNetwork, showAddNetworkModal,
        systemStatus, triggers, showTriggersModal, isProcessingTrigger, extensions, developerProfile, wallet, extensionToPurchase, showWalletModal, showBuyTokensModal, showWithdrawModal, systemConfig,
        isCommerceEnabled, showAdminSetup, isSuperAdmin, showNetworkDetailModal, signalToAnnotate, showSignalAnnotationModal, isClassifyingSignal,
        functionProtocols, treasuryState, cognitiveMetricsState, activeOperations, isWaveMaskActive, isWaveMaskMeasuring, activeExtensionId,
        
        setAiConfig, setScanMode, setProtectionStrategy, setSelectedDeviceForDetail, setShowAddFriendModal, setShowShareModal, setShowGovSignupModal,
        setSelectedNetwork, setShowAddNetworkModal, setShowTriggersModal, setExtensionToPurchase, setShowWalletModal, setShowBuyTokensModal, setShowWithdrawModal,
        setShowNetworkDetailModal, setSignalToAnnotate, setShowSignalAnnotationModal, setActiveExtensionId,
        
        addLog, handleAcknowledgeFirstRun, addFriend, submitGovApplication, addCustomNetwork, purchaseExtension, installExtension, uninstallExtension, submitExtension, buyTokens, 
        completeAdminSetup, verifyGithubToken, classifySignalWithAI, updateSignalAnnotation, submitFunctionProtocol, withdrawTokens,

        sdrDevilProps, detectedThreatsProps, axiomSilenceProps, ghostNetTriageProps, herdHealthProps,
        persistenceProps, bioImplantProps, deviceDetailProps, triggerProps, adminDashboardProps, waveMaskProps
    };
};

export default useSystem;

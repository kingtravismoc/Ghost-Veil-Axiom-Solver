import React, { useState, useEffect, useRef, useCallback } from 'react';
// FIX: Correctly import GoogleGenAI and Type from @google/genai
import { GoogleGenAI, Type } from "@google/genai";

// Components
import Header from './components/Header';
import SdrDevilControl from './components/SdrDevilControl';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import DetectedSignals from './components/DetectedSignals';
import DetectedThreats from './components/DetectedThreats';
import ObfuscationLayers from './components/ObfuscationLayers';
import ActiveCountermeasures from './components/ActiveCountermeasures';
import Disclaimer from './components/Disclaimer';
import LogPanel from './components/LogPanel';
import SystemDashboard from './components/SystemDashboard';
import AxiomSilenceControl from './components/AxiomSilenceControl';
import HerdHealthControl from './components/HerdHealthControl';
import ContinuityProtocol from './components/ContinuityProtocol';
import SystemPersistenceControl from './components/SystemPersistenceControl';
import AxiomTracebackMap from './components/AxiomTracebackMap';
import ManagementTabs from './components/ManagementTabs';
import FrequencySafetyControl from './components/FrequencySafetyControl';
import FrequencyCatalog from './components/FrequencyCatalog';
import AIConfigStrip from './components/AIConfigStrip';

// Services
import { sdrDevilService } from './services/sdrDevilService';
import { audioAnalysisService } from './services/audioAnalysisService';
import { p2pNetworkService } from './services/p2pNetworkService';

// Types
import type {
    Signal,
    Threat,
    ObfuscationLayer,
    Countermeasure,
    LogEntry,
    LogType,
    ScanMode,
    ProtectionStrategy,
    P2PState,
    AudioThreat,
    MicrophoneStatus,
    Traceback,
    AIConfig,
    MLInsight
} from './types';

const App: React.FC = () => {
    // Main state
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isProtected, setIsProtected] = useState(false);
    const [canActivateProtection, setCanActivateProtection] = useState(false);
    const [isIntelligentScanning, setIsIntelligentScanning] = useState(false);

    // Data state
    const [signals, setSignals] = useState<Signal[]>([]);
    const [threats, setThreats] = useState<Threat[]>([]);
    const [obfuscationLayers, setObfuscationLayers] = useState<ObfuscationLayer[]>([]);
    const [countermeasures, setCountermeasures] = useState<Countermeasure[]>([]);
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const [mlInsights, setMlInsights] = useState<MLInsight[]>([]);
    
    // Config state
    const [scanMode, setScanMode] = useState<ScanMode>('WIDEBAND_SWEEP');
    const [protectionStrategy, setProtectionStrategy] = useState<ProtectionStrategy>('QUANTUM_NOISE');
    const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: 'LOCAL_SIMULATED', apiKey: '' });
    const aiClient = useRef<GoogleGenAI | null>(null);

    // UI State
    const [activeTab, setActiveTab] = useState('Dashboard');
    
    // SDRDevil state
    const monitoringInterval = useRef<number | null>(null);
    const totalSignalsProcessed = useRef(0);

    // Audio state
    const [micStatus, setMicStatus] = useState<MicrophoneStatus>('INACTIVE');
    const [ambientNoise, setAmbientNoise] = useState(0);
    const [audioThreats, setAudioThreats] = useState<AudioThreat[]>([]);
    const audioInterval = useRef<number | null>(null);

    // P2P Network State
    const [p2pState, setP2pState] = useState<P2PState>(p2pNetworkService.getState());

    // Traceback State
    const [isTracing, setIsTracing] = useState(false);
    const [tracebackData, setTracebackData] = useState<Traceback | null>(null);
    
    // System Persistence
    const [isAgentDeployed, setIsAgentDeployed] = useState(false);

    // Add log entry utility
    const addLog = useCallback((message: string, type: LogType = 'SYSTEM') => {
        setLogEntries(prev => [...prev.slice(-100), { id: `log_${Date.now()}`, timestamp: Date.now(), type, message }]);
    }, []);

    // Effect to initialize AI client when config changes
    useEffect(() => {
        if (aiConfig.provider === 'GEMINI' && process.env.API_KEY) {
            try {
                // FIX: Initialize GoogleGenAI client correctly
                aiClient.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
                addLog('Gemini AI Core initialized successfully.', 'AI');
            } catch (error) {
                addLog('Failed to initialize Gemini AI Core.', 'ERROR');
                console.error(error);
            }
        } else {
            aiClient.current = null;
        }
    }, [aiConfig, addLog]);

    // P2P Service Subscription
    useEffect(() => {
        p2pNetworkService.registerLogger(addLog);
        const handleP2PUpdate = (state: P2PState) => setP2pState(state);
        p2pNetworkService.subscribe(handleP2PUpdate);
        return () => p2pNetworkService.unsubscribe(handleP2PUpdate);
    }, [addLog]);


    const analyzeSignalsAndThreats = useCallback(async (newSignals: Signal[]) => {
        if (newSignals.length === 0) return;
        addLog(`Analyzing ${newSignals.length} new signals...`, 'AI');
        setIsLoading(true);

        const significantSignals = newSignals.filter(s => s.amplitude > 60 || s.snr > 30);
        if (significantSignals.length === 0) {
            addLog('No significant signals detected in this batch.');
            setIsLoading(false);
            return;
        }

        if (aiConfig.provider === 'LOCAL_SIMULATED' || !aiClient.current) {
            // Simulate AI analysis
            await new Promise(res => setTimeout(res, 500));
            const newThreats: Threat[] = significantSignals.map(s => ({
                id: `threat_${s.id}`,
                type: 'SIMULATED_INTERFERENCE',
                method: 'Frequency Hopping',
                risk: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)] as Threat['risk'],
                influence: 'Data exfiltration attempt',
                transmissionMode: 'Packetized Digital',
                confidence: Math.random() * 0.3 + 0.6,
                frequency: s.frequency / 1e6
            }));
            setThreats(prev => [...prev.slice(-20), ...newThreats].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i));
            if (newThreats.length > 0) {
                 addLog(`Local AI detected ${newThreats.length} potential threats.`, 'AI');
                 setCanActivateProtection(true);
            }
        } else {
             const prompt = `You are a cybersecurity expert analyzing radio signals. Given this JSON array of signals, identify potential threats. For each threat, provide a JSON object with: type (e.g., "SPOOFING_ATTACK"), method (e.g., "GPS Replay"), risk ("LOW", "MEDIUM", "HIGH", "CRITICAL", "EXTREME"), influence (e.g., "Navigation system takeover"), transmissionMode, confidence (0.0-1.0), and the original signal frequency in MHz. Only return threats for signals with high amplitude (>60) or high SNR (>30). If no threats, return an empty array. Signals: ${JSON.stringify(significantSignals)}`;

             try {
                const response = await aiClient.current.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: prompt,
                    config: {
                        responseMimeType: "application/json",
                        responseSchema: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING },
                                    method: { type: Type.STRING },
                                    risk: { type: Type.STRING },
                                    influence: { type: Type.STRING },
                                    transmissionMode: { type: Type.STRING },
                                    confidence: { type: Type.NUMBER },
                                    frequency: { type: Type.NUMBER },
                                }
                            }
                        }
                    }
                });
                const parsedThreats = JSON.parse(response.text) as Omit<Threat, 'id'>[];
                const newThreats: Threat[] = parsedThreats.map(t => ({...t, id: `threat_${Date.now()}_${Math.random()}`}));
                
                setThreats(prev => [...prev.slice(-20), ...newThreats].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i));
                 if (newThreats.length > 0) {
                    addLog(`Gemini AI detected ${newThreats.length} potential threats.`, 'AI');
                    setCanActivateProtection(true);
                } else {
                    addLog('Gemini AI analysis found no new threats in this batch.');
                }
             } catch(e) {
                console.error("Gemini threat analysis failed", e);
                addLog('Gemini AI analysis failed. Falling back to local simulation.', 'ERROR');
                // Fallback to local
                const newThreats: Threat[] = significantSignals.map(s => ({
                    id: `threat_${s.id}`, type: 'SIMULATED_INTERFERENCE', method: 'Frequency Hopping',
                    risk: 'MEDIUM', influence: 'Data exfiltration attempt', transmissionMode: 'Packetized Digital',
                    confidence: 0.75, frequency: s.frequency / 1e6
                }));
                 setThreats(prev => [...prev.slice(-20), ...newThreats]);
                 setCanActivateProtection(true);
             }
        }
        setIsLoading(false);
    }, [aiConfig.provider, addLog]);

    const startMonitoring = () => {
        addLog(`Starting scan with mode: ${scanMode}...`);
        setIsMonitoring(true);
        if (monitoringInterval.current) clearInterval(monitoringInterval.current);
        monitoringInterval.current = window.setInterval(() => {
            const newSignals = sdrDevilService.generateSignals(scanMode);
            setSignals(prev => [...prev.slice(-200), ...newSignals]);
            totalSignalsProcessed.current += newSignals.length;
            analyzeSignalsAndThreats(newSignals);
        }, 2000);
    };

    const stopMonitoring = () => {
        addLog('Scan stopped.');
        setIsMonitoring(false);
        if (monitoringInterval.current) {
            clearInterval(monitoringInterval.current);
            monitoringInterval.current = null;
        }
    };
    
    const activateProtection = async () => {
        addLog(`Engaging protection strategy: ${protectionStrategy}...`, 'SYSTEM');
        setIsLoading(true);
        await new Promise(res => setTimeout(res, 1500));
        
        const newLayers: ObfuscationLayer[] = [
            { name: 'Quantum Tunneling', status: 'ACTIVE', type: 'ENCRYPTION', effectiveness: Math.random() * 0.2 + 0.75 },
            { name: 'Waveform Mimicry', status: 'ACTIVE', type: 'DECEPTION', effectiveness: Math.random() * 0.3 + 0.65 },
            { name: 'Temporal Distortion Field', status: 'ACTIVE', type: 'TIMING', effectiveness: Math.random() * 0.15 + 0.8 },
        ];
        const newCountermeasures: Countermeasure[] = threats.slice(-3).map(threat => ({
            method: 'Adaptive Nulling', threatType: threat.type, effectiveness: Math.random() * 0.4 + 0.55,
            source: 'LOCAL', implementation: 'Phase-inverted signal injection', waveform: 'SAW_TOOTH_INVERTED'
        }));
        
        setObfuscationLayers(newLayers);
        setCountermeasures(newCountermeasures);
        
        setIsProtected(true);
        setIsLoading(false);
        addLog('Ghost Veil protection is active.', 'SYSTEM');
    };

    const deactivateProtection = () => {
        addLog('Disengaging protection...', 'SYSTEM');
        setIsProtected(false);
        setObfuscationLayers([]);
        setCountermeasures([]);
    };
    
    const handleIntelligentScan = async () => {
        if (!aiClient.current) {
            addLog("Intelligent Scan requires Gemini AI Core to be enabled.", "WARN");
            return;
        }
        addLog("AI is optimizing scan parameters...", "AI");
        setIsIntelligentScanning(true);
        const prompt = `Based on these recent threats, recommend the best ScanMode ('WIDEBAND_SWEEP', 'ANOMALY_SCAN', 'PASSIVE_INTERCEPT') and ProtectionStrategy ('QUANTUM_NOISE', 'DYNAMIC_MIMICRY', 'DECENTRALIZED_OBFUSCATION'). Provide a JSON object with 'scanMode' and 'protectionStrategy'. Threats: ${JSON.stringify(threats.slice(-5))}`;
        try {
            const response = await aiClient.current.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            scanMode: { type: Type.STRING },
                            protectionStrategy: { type: Type.STRING },
                        }
                    }
                }
            });
            const { scanMode: newScanMode, protectionStrategy: newProtectionStrategy } = JSON.parse(response.text);
            setScanMode(newScanMode);
            setProtectionStrategy(newProtectionStrategy);
            addLog(`AI recommended Scan Mode: ${newScanMode} and Strategy: ${newProtectionStrategy}`, 'AI');
            const insight: MLInsight = {id: `insight_${Date.now()}`, timestamp: Date.now(), type: 'RX_TUNING', description: `AI optimized scan to ${newScanMode} based on threat profile.`};
            setMlInsights(prev => [insight, ...prev].slice(0, 10));
        } catch (e) {
            console.error("Intelligent scan failed", e);
            addLog("AI optimization failed.", "ERROR");
        }
        setIsIntelligentScanning(false);
    };

    const handleTraceback = async (threatId: string) => {
        const threat = threats.find(t => t.id === threatId);
        if (!threat) return;
        
        addLog(`Initiating Axiomatic Traceback for threat: ${threat.type}...`, 'AI');
        setIsTracing(true);
        setTracebackData(null);
        await new Promise(res => setTimeout(res, 3000)); // Simulate work

        const newTraceback: Traceback = {
            source: { lat: 34.0522 + (Math.random() - 0.5) * 5, lon: -118.2437 + (Math.random() - 0.5) * 5 },
            narrative: 'Signal origin traced to a mobile, heavily shielded emitter. Path analysis suggests multiple refraction points to obscure source.',
            path: [
                { medium: 'SATELLITE', step: 'KU-Band Uplink' },
                { medium: 'TERRESTRIAL', step: 'Microwave Relay' },
                { medium: 'URBAN_CANYON', step: 'Multipath Reflection' },
            ]
        };
        setTracebackData(newTraceback);
        addLog('Traceback complete. Source location estimated.', 'SYSTEM');
        setIsTracing(false);
    };

    // Update P2P network with self's threats
    useEffect(() => {
        if (p2pState.isActive) {
            p2pNetworkService.updateSelfThreats(threats, aiClient.current, aiConfig);
        }
    }, [threats, p2pState.isActive, aiConfig]);

    const handleToggleMute = (threatId: string) => {
        setThreats(prev => prev.map(t => t.id === threatId ? {...t, isMuted: !t.isMuted} : t));
    };

    const handleToggleSolo = (threatId: string) => {
         setThreats(prev => prev.map(t => t.id === threatId ? {...t, isSoloed: !t.isSoloed} : t));
    };

    // Aural Scan Logic
    const startAuralScan = async () => {
        setMicStatus('CALIBRATING');
        const success = await audioAnalysisService.start();
        if (success) {
            setMicStatus('ACTIVE');
            addLog('Aural Bio-Resonance Scan engaged.', 'SYSTEM');
            audioInterval.current = window.setInterval(() => {
                const analysis = audioAnalysisService.getAnalysis();
                if (analysis) {
                    setAmbientNoise(analysis.ambientNoiseLevel);
                    if (analysis.newThreats.length > 0) {
                        const newAudioThreats: AudioThreat[] = analysis.newThreats.map(t => ({...t, id: `audio_${Date.now()}`, timestamp: Date.now()}));
                        setAudioThreats(prev => [...prev, ...newAudioThreats].slice(-20));
                        addLog(`Aural scan detected potential audio threat: ${newAudioThreats[0].type}`, 'WARN');
                    }
                }
            }, 500);
        } else {
            setMicStatus('ERROR');
            addLog('Failed to access microphone for Aural Scan.', 'ERROR');
        }
    };

    const stopAuralScan = () => {
        audioAnalysisService.stop();
        if(audioInterval.current) clearInterval(audioInterval.current);
        setMicStatus('INACTIVE');
        setAmbientNoise(0);
        addLog('Aural Bio-Resonance Scan disengaged.', 'SYSTEM');
    };
    
    const tabs = ['Dashboard', 'Network', 'System'];

    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen font-sans">
            <Header />
            <main className="container mx-auto p-4 sm:p-6">
                <AIConfigStrip isVisible={true} onApplyConfig={setAiConfig} />
                <ManagementTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

                {activeTab === 'Dashboard' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        <div className="lg:col-span-1 xl:col-span-1 space-y-4 sm:space-y-6">
                            <SdrDevilControl 
                                isMonitoring={isMonitoring}
                                isLoading={isLoading}
                                isProtected={isProtected}
                                canActivate={canActivateProtection}
                                scanMode={scanMode}
                                setScanMode={setScanMode}
                                protectionStrategy={protectionStrategy}
                                setProtectionStrategy={setProtectionStrategy}
                                startMonitoring={startMonitoring}
                                stopMonitoring={stopMonitoring}
                                activateProtection={activateProtection}
                                deactivateProtection={deactivateProtection}
                                activateButtonText={isProtected ? 'Veil Active' : 'Activate Veil'}
                                isIntelligentScanning={isIntelligentScanning}
                                onIntelligentScan={handleIntelligentScan}
                            />
                            <AxiomSilenceControl 
                                isActive={micStatus === 'ACTIVE' || micStatus === 'CALIBRATING'}
                                status={micStatus}
                                noiseLevel={ambientNoise}
                                threats={audioThreats}
                                activate={startAuralScan}
                                deactivate={stopAuralScan}
                            />
                        </div>
                        <div className="lg:col-span-2 xl:col-span-2 space-y-4 sm:space-y-6">
                            <SpectrumAnalyzer signals={signals} />
                            <DetectedSignals signals={signals.filter(s => s.amplitude > 60 || s.snr > 30)} />
                            <DetectedThreats threats={threats} onTraceback={handleTraceback} isTracing={isTracing} onToggleMute={handleToggleMute} onToggleSolo={handleToggleSolo} />
                            <ObfuscationLayers layers={obfuscationLayers} isProtected={isProtected} />
                            <ActiveCountermeasures countermeasures={countermeasures} />
                        </div>
                        <div className="lg:col-span-3 xl:col-span-1 space-y-4 sm:space-y-6">
                             <SystemDashboard 
                                totalSignals={totalSignalsProcessed.current} 
                                significantSignals={signals.filter(s => s.amplitude > 60 || s.snr > 30).length} 
                                threats={threats.length}
                                p2pState={p2pState}
                                acuity={Math.min(1, (threats.length + totalSignalsProcessed.current / 100) / 50)}
                                insights={mlInsights}
                            />
                            <LogPanel logEntries={logEntries} />
                            <AxiomTracebackMap tracebackData={tracebackData} isTracing={isTracing} />
                            <Disclaimer />
                        </div>
                    </div>
                )}
                
                {activeTab === 'Network' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <HerdHealthControl 
                            isActive={p2pState.isActive}
                            onToggle={(status) => p2pNetworkService.toggleActive(status)}
                            nodes={p2pState.nodes}
                            macroThreat={p2pState.macroThreat}
                        />
                        <ContinuityProtocol sentinels={p2pState.sentinels} doomsdayActive={p2pState.doomsdayActive} />
                        <FrequencyCatalog />
                    </div>
                )}

                {activeTab === 'System' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <SystemPersistenceControl isDeployed={isAgentDeployed} onDeploy={() => {
                            addLog('Simulating persistent agent deployment...', 'SYSTEM');
                            setTimeout(() => {
                                setIsAgentDeployed(true);
                                addLog('Agent deployed to simulated system cache.', 'SYSTEM');
                            }, 2000);
                        }} />
                        <FrequencySafetyControl />
                    </div>
                )}

            </main>
        </div>
    );
};

export default App;

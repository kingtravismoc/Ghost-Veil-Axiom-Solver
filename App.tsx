import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Signal, Threat, Countermeasure, ObfuscationLayer, SystemStatus, ScanMode, ProtectionStrategy, AudioThreat, MicrophoneStatus, LogEntry, LogType, Traceback, MacroThreat, AIConfig, P2PState, MLInsight, OmegaProtocolState, UserFrequencyBlock } from './types';
import { sdrDevilService } from './services/sdrDevilService';
import { audioAnalysisService } from './services/audioAnalysisService';
import { p2pNetworkService } from './services/p2pNetworkService';
import { secureCommService } from './services/secureCommService';
import Header from './components/Header';
import SdrDevilControl from './components/SdrDevilControl';
import AxiomSilenceControl from './components/AxiomSilenceControl';
import HerdHealthControl from './components/HerdHealthControl';
import SpectrumAnalyzer from './components/SpectrumAnalyzer';
import DetectedSignals from './components/DetectedSignals';
import DetectedThreats from './components/DetectedThreats';
import ObfuscationLayers from './components/ObfuscationLayers';
import ActiveCountermeasures from './components/ActiveCountermeasures';
import Disclaimer from './components/Disclaimer';
import LogPanel from './components/LogPanel';
import AxiomTracebackMap from './components/AxiomTracebackMap';
import AIConfigStrip from './components/AIConfigStrip';
import SystemDashboard from './components/SystemDashboard';
import ContinuityProtocol from './components/ContinuityProtocol';
import FrequencySafetyControl from './components/FrequencySafetyControl';
import SystemPersistenceControl from './components/SystemPersistenceControl';

declare global {
    interface Window {
        initiateOmegaProtocol: (validatorEmail: string, localSmtpConfig: { ip: string, domain: string }) => void;
        confirmOmegaApproval: (requestId: string, response: string) => void;
    }
}


const App: React.FC = () => {
    // A constant to control the visibility of the high-level failsafe protocol.
    // Set this to true in source for deployments that require it.
    const SHOW_CONTINUITY_PROTOCOL = false;

    const [systemStatus, setSystemStatus] = useState<SystemStatus>('CONNECTING');
    const [sdrConnected, setSdrConnected] = useState<boolean>(false);
    const [isMonitoring, setIsMonitoring] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isProtected, setIsProtected] = useState<boolean>(false);

    const [signals, setSignals] = useState<Signal[]>([]);
    const [detectedThreats, setDetectedThreats] = useState<Threat[]>([]);
    const [activeCountermeasures, setActiveCountermeasures] = useState<Countermeasure[]>([]);
    const [obfuscationLayers, setObfuscationLayers] = useState<ObfuscationLayer[]>([]);

    const [scanMode, setScanMode] = useState<ScanMode>('WIDEBAND_SWEEP');
    const [protectionStrategy, setProtectionStrategy] = useState<ProtectionStrategy>('DECENTRALIZED_OBFUSCATION');

    const [p2pState, setP2pState] = useState<P2PState>(p2pNetworkService.getState());

    const [isSilenceProtocolActive, setIsSilenceProtocolActive] = useState<boolean>(false);
    const [microphoneStatus, setMicrophoneStatus] = useState<MicrophoneStatus>('INACTIVE');
    const [ambientNoiseLevel, setAmbientNoiseLevel] = useState<number>(0);
    const [audioThreats, setAudioThreats] = useState<AudioThreat[]>([]);
    
    const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
    const [isTracing, setIsTracing] = useState<boolean>(false);
    const [tracebackData, setTracebackData] = useState<Traceback | null>(null);

    const [aiConfig, setAiConfig] = useState<AIConfig>({ provider: 'LOCAL_SIMULATED', apiKey: '' });
    const [aiClient, setAiClient] = useState<any | null>({}); // Start with simulation client
    const [showAIConfigStrip, setShowAIConfigStrip] = useState<boolean>(true);

    const [mlAcuity, setMlAcuity] = useState<number>(0);
    const [mlInsights, setMlInsights] = useState<MLInsight[]>([]);
    const [totalSignalsProcessed, setTotalSignalsProcessed] = useState<number>(0);

    const [userFrequencyBlocks, setUserFrequencyBlocks] = useState<UserFrequencyBlock[]>([]);
    const [isProcessingFrequency, setIsProcessingFrequency] = useState<boolean>(false);

    const [isIntelligentScanning, setIsIntelligentScanning] = useState<boolean>(false);
    const [isDaemonDeployed, setIsDaemonDeployed] = useState<boolean>(false);

    const monitorIntervalRef = useRef<number | null>(null);
    const audioIntervalRef = useRef<number | null>(null);
    const lastMlAnalysisSignalCount = useRef<number>(0);

    const addLogEntry = useCallback((message: string, type: LogType = 'INFO') => {
        setLogEntries(prev => {
            const newEntry: LogEntry = {
                id: `log_${Date.now()}_${Math.random()}`,
                timestamp: Date.now(),
                message,
                type,
            };
            return [newEntry, ...prev.slice(0, 49)];
        });
    }, []);

    useEffect(() => {
        p2pNetworkService.registerLogger(addLogEntry);
        secureCommService.registerLogger(addLogEntry);

        const handleP2PUpdate = (newState: P2PState) => {
            setP2pState(newState);
            if (newState.macroThreat && !p2pState.macroThreat) {
                 addLogEntry(`P2P Consensus Reached! Macro-Threat Identified: ${newState.macroThreat.name}`, 'WARN');
            }
             if (newState.doomsdayActive && !p2pState.doomsdayActive) {
                addLogEntry(`AXIOM CONTINUITY PROTOCOL ENGAGED!`, 'ERROR');
            }
        };
        p2pNetworkService.subscribe(handleP2PUpdate);

        const handleOmegaUpdate = (newState: OmegaProtocolState) => {
            if (newState.isLive) {
                setSystemStatus('OMEGA_LIVE');
                addLogEntry('OMEGA PROTOCOL IS LIVE. DIRECT ACTION AUTHORIZED.', 'ERROR');
            }
        }
        secureCommService.subscribe(handleOmegaUpdate);

        window.initiateOmegaProtocol = (validatorEmail, config) => {
            secureCommService.initiate(
                validatorEmail,
                config,
                p2pNetworkService.getState().sentinels,
                { threats: detectedThreats, macroThreat: p2pState.macroThreat }
            );
        };
        window.confirmOmegaApproval = secureCommService.confirmApproval;

        addLogEntry('Initializing Ghost Veil Axiom Resolver...', 'SYSTEM');
        addLogEntry('Defaulting to Standard Local Model (GPT-2 Simulated).', 'AI');
        
        sdrDevilService.connect().then(connected => {
            setSdrConnected(connected);
            setSystemStatus(connected ? 'STANDBY' : 'ERROR');
            addLogEntry(connected ? 'SDRDevil Node connection established.' : 'SDRDevil Node connection failed.', connected ? 'SYSTEM' : 'ERROR');
        });

        addLogEntry(`P2P Axiom Network Initialized. Awaiting user opt-in.`, 'NETWORK');

        return () => {
            p2pNetworkService.unsubscribe(handleP2PUpdate);
            secureCommService.unsubscribe(handleOmegaUpdate);
        }
    }, [addLogEntry, p2pState.macroThreat, p2pState.doomsdayActive, detectedThreats]);

    useEffect(() => {
        if (isSilenceProtocolActive && microphoneStatus === 'ACTIVE') {
            audioIntervalRef.current = window.setInterval(() => {
                const analysis = audioAnalysisService.getAnalysis();
                if (analysis) {
                    setAmbientNoiseLevel(analysis.ambientNoiseLevel);
                    if (analysis.newThreats.length > 0) {
                        const threatsWithIds: AudioThreat[] = analysis.newThreats.map(t => ({
                            ...t,
                            id: `audio_${Date.now()}_${Math.random()}`,
                            timestamp: Date.now()
                        }));
                        setAudioThreats(prev => [...prev.slice(-10), ...threatsWithIds]);
                        addLogEntry(`Aural scan detected potential ${threatsWithIds[0].type}.`, 'WARN');
                    }
                }
            }, 250);
        } else {
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        }
        return () => { if (audioIntervalRef.current) clearInterval(audioIntervalRef.current) };
    }, [isSilenceProtocolActive, microphoneStatus, addLogEntry]);
    
    const handleApplyAIConfig = useCallback((newConfig: AIConfig) => {
        setAiConfig(newConfig);
        setAiClient(null); // Clear previous client

        if (newConfig.provider === 'GEMINI') {
            setShowAIConfigStrip(false);
            try {
                if (!process.env.API_KEY) {
                    throw new Error("API_KEY environment variable not set.");
                }
                const gemini = new GoogleGenAI({ apiKey: process.env.API_KEY });
                setAiClient(gemini);
                addLogEntry('Successfully configured Gemini AI Core.', 'AI');
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : String(e);
                addLogEntry(`Failed to configure Gemini AI: ${errorMessage}. Falling back to simulation.`, 'ERROR');
                setAiClient({});
                setAiConfig({provider: 'LOCAL_SIMULATED', apiKey: ''});
            }
        } else {
            setAiClient({});
            addLogEntry('Switched to Standard Local Model (GPT-2 Simulated).', 'AI');
        }
    }, [addLogEntry]);

    const analyzeThreatsWithAI = useCallback(async (currentSignals: Signal[]) => {
        if (systemStatus === 'OMEGA_LIVE') return;
        setIsLoading(true); setSystemStatus('ANALYZING');
        addLogEntry('Analyzing signal intercepts with AI Core...', 'AI');
        
        const significantSignals = currentSignals.slice(-100).filter(s => s.amplitude > 60 && s.snr > 25);
        if (significantSignals.length === 0) {
            setIsLoading(false); setSystemStatus('STANDBY');
            addLogEntry('No significant signals found for analysis.', 'INFO');
            return;
        }

        if (!aiClient || aiConfig.provider === 'LOCAL_SIMULATED' || !sdrConnected) {
            addLogEntry("AI Core in local mode. Simulating threat analysis.", 'AI');
            const simulatedThreats: Threat[] = [{ id: `sim_gpt2_${Date.now()}`, type: 'SIMULATED_RF_LEAKAGE (GPT-2)', method: 'Unshielded high-frequency component', risk: 'HIGH', frequency: 2450, confidence: 0.88, influence: 'Data Exfiltration', transmissionMode: 'Burst' }];
            setDetectedThreats(simulatedThreats);
            p2pNetworkService.updateSelfThreats(simulatedThreats, aiClient, aiConfig);
            setIsLoading(false); setSystemStatus('STANDBY');
            return;
        }
        
        const prompt = `Running a "${scanMode.replace(/_/g, ' ')}" scan. Analyze these signal intercepts and identify potential surveillance threats. For each threat, provide a type, method, risk level, the associated frequency, your confidence level, a potential influence vector, and a transmission mode.
        Signals: ${JSON.stringify(significantSignals.map(s => ({ f: s.frequency, a: s.amplitude, m: s.modulation, snr: s.snr, bw: s.bandwidth })))}`;

        try {
            const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING }, method: { type: Type.STRING }, risk: { type: Type.STRING }, frequency: { type: Type.NUMBER }, confidence: { type: Type.NUMBER }, influence: { type: Type.STRING }, transmissionMode: { type: Type.STRING }
                            }
                        }
                    }
                }
            });
            const newThreats: Omit<Threat, 'id'>[] = JSON.parse(response.text);
            const threatsWithIds: Threat[] = newThreats.map(threat => ({ ...threat, id: `threat_${Date.now()}_${Math.random()}`}));
            setDetectedThreats(threatsWithIds);
            addLogEntry(`AI Analysis complete. ${threatsWithIds.length} potential threats identified.`, 'AI');
            p2pNetworkService.updateSelfThreats(threatsWithIds, aiClient, aiConfig);

        } catch (error) {
            console.error("Error analyzing threats with AI:", error);
            addLogEntry("AI analysis failed. Check console for details.", 'ERROR');
        } finally {
            setIsLoading(false);
            setSystemStatus('STANDBY');
        }
    }, [sdrConnected, scanMode, addLogEntry, aiClient, aiConfig, systemStatus]);
    
    const runDeepMLAnalysis = useCallback(async () => {
        addLogEntry('Deep ML Core: Analyzing long-term patterns...', 'AI');
        
        const recentThreatTypes = detectedThreats.map(t => t.type).join(', ');
        if (recentThreatTypes.length === 0) {
            addLogEntry('Deep ML Core: Insufficient threat data for analysis cycle.', 'AI');
            return;
        }

        if (!aiClient || aiConfig.provider === 'LOCAL_SIMULATED') {
            addLogEntry("Deep ML Core in local mode. Simulating heuristic adjustment.", 'AI');
            const simInsight: Omit<MLInsight, 'id' | 'timestamp'> = {
                type: 'RX_TUNING',
                description: 'Simulated Insight: Prioritize scanning 2.4GHz band due to recurring leakage patterns.'
            };
            const newInsight: MLInsight = { ...simInsight, id: `ml_${Date.now()}`, timestamp: Date.now() };
            setMlInsights(prev => [newInsight, ...prev]);
            addLogEntry(`ML Insight Generated: ${newInsight.description}`, 'AI');
            return;
        }

        const prompt = `You are a Deep ML Analysis Core. After processing ${totalSignalsProcessed} signals, your acuity is ${(mlAcuity * 100).toFixed(1)}%.
        Based on these recent threat types (${recentThreatTypes}), generate one new heuristic adjustment to improve system performance.
        The adjustment 'type' must be one of: 'RX_TUNING', 'TX_OPTIMIZATION', or 'CLASSIFICATION_UPDATE'.
        The 'description' should be a concise, actionable insight.
        Provide a JSON object with 'type' and 'description'.`;

        try {
            const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT, properties: { type: { type: Type.STRING }, description: { type: Type.STRING } }
                    }
                }
            });
            const result: Omit<MLInsight, 'id' | 'timestamp'> = JSON.parse(response.text);
            const newInsight: MLInsight = {
                ...result,
                id: `ml_${Date.now()}`,
                timestamp: Date.now()
            };
            setMlInsights(prev => [newInsight, ...prev].slice(0, 10));
            addLogEntry(`ML Insight Generated: ${newInsight.description}`, 'AI');
        } catch(error) {
            console.error("Error during Deep ML Analysis:", error);
            addLogEntry('Deep ML analysis cycle failed.', 'ERROR');
        }
    }, [addLogEntry, aiClient, aiConfig, totalSignalsProcessed, mlAcuity, detectedThreats]);


    useEffect(() => {
        if (!isMonitoring) return;
        
        setMlAcuity(1 - Math.exp(-totalSignalsProcessed / 5000));

        const analysisThreshold = 500;
        if (totalSignalsProcessed > 0 && totalSignalsProcessed - lastMlAnalysisSignalCount.current >= analysisThreshold) {
            runDeepMLAnalysis();
            lastMlAnalysisSignalCount.current = totalSignalsProcessed;
        }

    }, [totalSignalsProcessed, isMonitoring, runDeepMLAnalysis]);


    const stopMonitoring = useCallback(() => {
        setIsMonitoring(false);
        if (monitorIntervalRef.current) clearInterval(monitorIntervalRef.current);
        addLogEntry('Spectrum monitoring stopped.', 'SYSTEM');
        setSystemStatus('ANALYZING');
        analyzeThreatsWithAI(signals);
    }, [analyzeThreatsWithAI, signals, addLogEntry]);

    const startMonitoring = useCallback(() => {
        if (!sdrConnected) return;
        setSignals([]); setDetectedThreats([]); setMlInsights([]); setTotalSignalsProcessed(0); setMlAcuity(0);
        lastMlAnalysisSignalCount.current = 0;
        p2pNetworkService.reset();
        setIsMonitoring(true); setSystemStatus('MONITORING');
        addLogEntry(`Starting ${scanMode.replace(/_/g, ' ')}...`, 'SYSTEM');
        monitorIntervalRef.current = window.setInterval(() => {
            const newSignals = sdrDevilService.generateSignals(scanMode);
            setSignals(prev => [...prev.slice(-500), ...newSignals]);
            setTotalSignalsProcessed(prev => prev + newSignals.length);
        }, 200);
    }, [sdrConnected, scanMode, addLogEntry]);
    
    const handleIntelligentScan = useCallback(async () => {
        if (!sdrConnected) return;
        setIsIntelligentScanning(true);
        addLogEntry('Intelligent Scan initiated. AI Core is analyzing optimal parameters...', 'AI');
        
        if (!aiClient || aiConfig.provider === 'LOCAL_SIMULATED') {
            addLogEntry('Local model: Simulating optimal settings.', 'AI');
            await new Promise(res => setTimeout(res, 1500));
            setScanMode('ANOMALY_SCAN');
            setProtectionStrategy('DYNAMIC_MIMICRY');
            addLogEntry('AI recommends ANOMALY_SCAN and DYNAMIC_MIMICRY strategy.', 'AI');
            setIsIntelligentScanning(false);
            startMonitoring();
            return;
        }

        const threatSummary = detectedThreats.length > 0
            ? `Current threats identified: ${detectedThreats.map(t => t.type).join(', ')}.`
            : 'The environment is currently clear of known threats.';
        
        const prompt = `You are a counter-surveillance AI. Given the situation, determine the optimal configuration.
        Situation: ${threatSummary}
        Available Scan Modes: WIDEBAND_SWEEP, ANOMALY_SCAN, PASSIVE_INTERCEPT.
        Available Protection Strategies: QUANTUM_NOISE, DYNAMIC_MIMICRY, DECENTRALIZED_OBFUSCATION.
        Return a single JSON object with your chosen 'scanMode' and 'protectionStrategy'.`;

        try {
            const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.OBJECT, properties: { scanMode: { type: Type.STRING }, protectionStrategy: { type: Type.STRING } } }
                }
            });
            const { scanMode: newScanMode, protectionStrategy: newProtectionStrategy } = JSON.parse(response.text);
            setScanMode(newScanMode);
            setProtectionStrategy(newProtectionStrategy);
            addLogEntry(`AI Core recommends: ${newScanMode} and ${newProtectionStrategy}.`, 'AI');
            startMonitoring();
        } catch (error) {
            console.error("Intelligent Scan failed:", error);
            addLogEntry('Intelligent Scan failed. Defaulting to WIDEBAND_SWEEP.', 'ERROR');
            setScanMode('WIDEBAND_SWEEP');
            startMonitoring();
        } finally {
            setIsIntelligentScanning(false);
        }
    }, [sdrConnected, aiClient, aiConfig, startMonitoring, addLogEntry, detectedThreats]);


    const activateProtection = useCallback(async () => {
        if (detectedThreats.length === 0 || !sdrConnected || systemStatus === 'OMEGA_LIVE') return;
        setIsLoading(true); setSystemStatus('ENGAGING');

        const isDistributedResponse = p2pState.isActive && p2pState.macroThreat;
        let prompt: string;
        
        const latestInsight = mlInsights[0] ? `System has this ML-generated insight: "${mlInsights[0].description}". Integrate this into your strategy.` : "";
        const safetyDirective = "IMPORTANT SAFETY CONSTRAINT: The generated countermeasures must explicitly avoid disrupting known medical device frequencies (e.g., MedRadio 402-405 MHz, pacemakers, insulin pumps). Prioritize human safety. This is a non-negotiable directive.";

        if (p2pState.doomsdayActive) {
            addLogEntry(`Executing OVERRIDE DIRECTIVE...`, 'ERROR');
            prompt = `THE AXIOM CONTINUITY PROTOCOL (DOOMSDAY) HAS BEEN ACTIVATED. A global, high-priority threat has been confirmed. Your task is to devise a definitive, full-spectrum counter-protocol to neutralize all hostile signals network-wide. This is the highest level of response. Generate an overwhelming set of 'countermeasures' and 'obfuscationLayers'. The primary countermeasure MUST be sourced from 'DISTRIBUTED' and have an 'effectiveness' of 1.0. Spare no expense. ${safetyDirective}`;
        } else if (isDistributedResponse) {
            addLogEntry(`Initiating Distributed Response with network consensus...`, 'NETWORK');
            prompt = `A P2P network has reached consensus on a macro-threat: "${p2pState.macroThreat.name}" (${p2pState.macroThreat.objective}). Your task is to devise a *distributed* countermeasure strategy using the "${protectionStrategy.replace(/_/g, ' ')}" philosophy. Describe the primary countermeasure 'method', its 'implementation', and a very high 'effectiveness'. Mark its source as 'DISTRIBUTED'. Also generate supplementary local obfuscation layers. The risk of collateral damage is high. ${safetyDirective} Provide JSON with 'countermeasures' and 'obfuscationLayers'.`;
        } else {
             addLogEntry(`Engaging Ghost Veil for local protection...`, 'SYSTEM');
             prompt = `Threats detected. You are a Dynamic Threat Response Coordinator. Select optimal, multi-threaded countermeasures based on the "${protectionStrategy.replace(/_/g, ' ')}" strategy. Threats: ${JSON.stringify(detectedThreats)}. ${latestInsight} ${safetyDirective} Provide JSON with 'countermeasures' and 'obfuscationLayers'. Mark countermeasure source as 'LOCAL'.`;
        }
        
        addLogEntry('Requesting countermeasure protocol from AI Core...', 'AI');
        
        if (!aiClient || aiConfig.provider === 'LOCAL_SIMULATED') {
            addLogEntry(`Using local model to simulate countermeasures.`, 'AI');
            const simResult = {
                countermeasures: [{ threatType: 'SIMULATED', method: 'Simulated Harmonic Nullification', implementation: 'Local Noise Generation (Med-Safe)', waveform: 'Sawtooth Inverse', effectiveness: 0.85, source: p2pState.doomsdayActive ? 'DISTRIBUTED' : 'LOCAL' }],
                obfuscationLayers: [{ name: 'Simulated Quantum Veil', type: 'DATA_SCATTERING', status: 'active', effectiveness: 0.91 }]
            };
            setActiveCountermeasures(simResult.countermeasures as Countermeasure[]);
            setObfuscationLayers(simResult.obfuscationLayers as ObfuscationLayer[]);
            setIsProtected(true); setSystemStatus('PROTECTED');
            addLogEntry('Simulated countermeasure protocol engaged.', 'SYSTEM');
            setIsLoading(false);
            return;
        }
        
        try {
             const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            countermeasures: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { threatType: { type: Type.STRING }, method: { type: Type.STRING }, implementation: { type: Type.STRING }, waveform: { type: Type.STRING }, effectiveness: { type: Type.NUMBER }, source: { type: Type.STRING } }}},
                            obfuscationLayers: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, type: { type: Type.STRING }, status: { type: Type.STRING }, effectiveness: { type: Type.NUMBER } }}}
                        }
                    }
                }
            });
            const result = JSON.parse(response.text);
            setActiveCountermeasures((result.countermeasures || []) as unknown as Countermeasure[]);
            setObfuscationLayers((result.obfuscationLayers || []) as unknown as ObfuscationLayer[]);
            setIsProtected(true); setSystemStatus('PROTECTED');
            addLogEntry('Countermeasure protocol received and engaged. Ghost Veil is active.', 'SYSTEM');
        } catch (error) {
            console.error("Error generating protection with AI:", error);
            addLogEntry('AI Core failed to generate countermeasures.', 'ERROR');
            setSystemStatus('ERROR');
        } finally {
            setIsLoading(false);
        }
    }, [detectedThreats, sdrConnected, protectionStrategy, p2pState, mlInsights, addLogEntry, aiClient, aiConfig, systemStatus]);

    const deactivateProtection = useCallback(() => {
        if (systemStatus === 'OMEGA_LIVE') return;
        setIsProtected(false); setSystemStatus('STANDBY');
        setActiveCountermeasures([]); setObfuscationLayers([]);
        addLogEntry('Ghost Veil deactivated. System returning to standby.', 'SYSTEM');
    }, [addLogEntry, systemStatus]);

    const activateSilenceProtocol = useCallback(async () => {
        setMicrophoneStatus('CALIBRATING');
        addLogEntry('Engaging Aural Bio-Resonance Scan...', 'SYSTEM');
        const success = await audioAnalysisService.start();
        if (success) {
            setIsSilenceProtocolActive(true); setMicrophoneStatus('ACTIVE');
            setAudioThreats([]);
            addLogEntry('Aural Scan active. Monitoring local acoustic environment.', 'INFO');
        } else {
            setMicrophoneStatus('ERROR'); setIsSilenceProtocolActive(false);
            addLogEntry('Failed to access microphone for Aural Scan.', 'ERROR');
        }
    }, [addLogEntry]);

    const deactivateSilenceProtocol = useCallback(() => {
        audioAnalysisService.stop();
        setIsSilenceProtocolActive(false); setMicrophoneStatus('INACTIVE');
        setAmbientNoiseLevel(0);
        addLogEntry('Aural Scan disengaged.', 'SYSTEM');
    }, [addLogEntry]);

    const handleHerdHealthToggle = useCallback((isActive: boolean) => {
        p2pNetworkService.toggleActive(isActive);
        addLogEntry(`P2P Network participation ${isActive ? 'enabled' : 'disabled'}.`, 'NETWORK');
    }, [addLogEntry]);

    const handleToggleMute = useCallback((threatId: string) => {
        setDetectedThreats(prev => prev.map(t => t.id === threatId ? { ...t, isMuted: !t.isMuted } : t));
    }, []);

    const handleToggleSolo = useCallback((threatId: string) => {
        setDetectedThreats(prev => {
            const isAlreadySoloed = prev.find(t => t.id === threatId)?.isSoloed;
            return prev.map(t => ({ ...t, isSoloed: t.id === threatId ? !isAlreadySoloed : false }));
        });
    }, []);

    const handleTraceback = useCallback(async (threatId: string) => {
        const threat = detectedThreats.find(t => t.id === threatId);
        if (!threat) return;
        setIsTracing(true); setTracebackData(null);
        addLogEntry(`Initiating Axiomatic Traceback for threat: ${threat.type}`, 'AI');

        if (!aiClient || aiConfig.provider === 'LOCAL_SIMULATED') {
            addLogEntry(`Using local model to simulate traceback.`, 'AI');
            await new Promise(resolve => setTimeout(resolve, 1500));
            const simResult: Traceback = {
                source: { lat: 34.0522, lon: -118.2437, confidence: 0.65, type: 'Simulated Repeater' },
                path: [{ step: 'Local ISP Node', medium: 'Fiber Optic' }, { step: 'Municipal Power Grid', medium: 'Power Line' }],
                narrative: 'Signal path simulated by local GPT-2 model, showing a common urban transmission vector.'
            };
            setTracebackData(simResult);
            addLogEntry(`Simulated traceback complete. Source identified: ${simResult.source.type}`, 'AI');
            setIsTracing(false);
            return;
        }

        const prompt = `An Axiomatic Traceback has been initiated for a high-risk surveillance threat.
      Threat Details: ${JSON.stringify(threat)}
      Task: Generate a plausible origin point (latitude, longitude), signal path, and a brief narrative for this threat. The path should consist of multiple steps through different mediums.
      Provide a JSON object with 'source', 'path', and 'narrative' properties.
      'source' should contain: lat, lon, confidence (0.0-1.0), and type (e.g., "Rooftop Repeater").
      'path' should be an array of objects with 'step' and 'medium' (e.g., "Fiber Optic", "Microwave Relay").
      'narrative' is a short, dramatic summary.`;
        try {
            await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000)); // Simulate delay
            const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            source: { type: Type.OBJECT, properties: { lat: { type: Type.NUMBER }, lon: { type: Type.NUMBER }, confidence: { type: Type.NUMBER }, type: { type: Type.STRING } }},
                            path: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { step: { type: Type.STRING }, medium: { type: Type.STRING } }}},
                            narrative: { type: Type.STRING }
                        }
                    }
                }
            });
            const result: Traceback = JSON.parse(response.text);
            setTracebackData(result);
            addLogEntry(`Traceback complete. Source identified: ${result.source.type} with ${(result.source.confidence * 100).toFixed(0)}% confidence.`, 'AI');
        } catch (error) {
            console.error("Error during traceback:", error);
            addLogEntry("Axiomatic Traceback failed. Signal path obscured.", 'ERROR');
        } finally {
            setIsTracing(false);
        }
    }, [detectedThreats, addLogEntry, aiClient, aiConfig]);

    const handleAddFrequencyBlock = useCallback(async (freq: number, bandwidth: number, title: string, summary: string) => {
        setIsProcessingFrequency(true);
        addLogEntry(`4D Safety Axiom: Analyzing user request to block ${freq} MHz.`, 'AI');

        if (!aiClient || aiConfig.provider === 'LOCAL_SIMULATED') {
            addLogEntry('Local model: Simulating safety check and summarization.', 'AI');
            await new Promise(res => setTimeout(res, 1500));
            const newBlock: UserFrequencyBlock = {
                id: `block_${Date.now()}`,
                frequency: freq,
                bandwidth: bandwidth,
                title: `(Sim) ${title}`,
                summary: `(Simulated Analysis) ${summary}`,
                source: 'USER',
            };
            setUserFrequencyBlocks(prev => [...prev, newBlock]);
            addLogEntry(`Simulated block for ${freq} MHz added.`, 'SYSTEM');
            setIsProcessingFrequency(false);
            return;
        }

        try {
            // Step 1: Safety Check
            const safetyPrompt = `Analyze the frequency ${freq} MHz. Is it associated with critical infrastructure (e.g., aviation, medical, emergency services), known human biological processes, or standard safe communication protocols? Crucially, determine if this frequency is used by any common medical implants or devices (e.g., pacemakers, insulin pumps, neurostimulators in the 402-405 MHz MedRadio band). Prioritize human safety above all else. Your response must be a single JSON object with a boolean 'isSafeToBlock' and a short string 'reasoning'. If it is a medical frequency, 'isSafeToBlock' must be false.`;
            const safetyResponse = await aiClient.models.generateContent({
                model: "gemini-2.5-flash", contents: safetyPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.OBJECT, properties: { isSafeToBlock: { type: Type.BOOLEAN }, reasoning: { type: Type.STRING } } }
                }
            });
            const safetyResult = JSON.parse(safetyResponse.text);

            addLogEntry(`AI Safety Check: ${safetyResult.reasoning}`, 'AI');

            if (!safetyResult.isSafeToBlock) {
                addLogEntry(`BLOCK REJECTED: Frequency ${freq} MHz flagged as critical. Reason: ${safetyResult.reasoning}`, 'ERROR');
                setIsProcessingFrequency(false);
                return;
            }

             // Step 2: Summarize and Canonize
            const summaryPrompt = `You are a signal intelligence analyst. A user wants to block a signal at ${freq} MHz. Based on their report, generate a canonical, neutral 'title' and 'summary'. User Title: "${title}", User Summary: "${summary}". Your response must be a single JSON object with 'title' and 'summary'.`;
            const summaryResponse = await aiClient.models.generateContent({
                 model: "gemini-2.5-flash", contents: summaryPrompt,
                 config: {
                    responseMimeType: "application/json",
                    responseSchema: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, summary: { type: Type.STRING } } }
                }
            });
            const summaryResult = JSON.parse(summaryResponse.text);

            const newBlock: UserFrequencyBlock = {
                id: `block_${Date.now()}`,
                frequency: freq,
                bandwidth: bandwidth,
                title: summaryResult.title,
                summary: summaryResult.summary,
                source: 'USER',
            };
            setUserFrequencyBlocks(prev => [...prev, newBlock]);
            addLogEntry(`AI-processed block for ${newBlock.title} at ${freq} MHz has been added.`, 'SYSTEM');

        } catch (error) {
            console.error("Error processing frequency block:", error);
            addLogEntry('4D Safety Axiom analysis failed. Check console.', 'ERROR');
        } finally {
            setIsProcessingFrequency(false);
        }

    }, [addLogEntry, aiClient, aiConfig]);

    const handleDaemonDeploy = useCallback(() => {
        addLogEntry('Initiating persistent agent deployment...', 'SYSTEM');
        setTimeout(() => addLogEntry('Loading runtime into browser cache...', 'SYSTEM'), 500);
        setTimeout(() => addLogEntry('Attempting persistence layer... (Sandboxed)', 'SYSTEM'), 1200);
        setTimeout(() => addLogEntry('Simulating integrity check bypass...', 'WARN'), 2000);
        setTimeout(() => addLogEntry('Elevating permissions in sandboxed environment...', 'WARN'), 2800);
        setTimeout(() => {
            addLogEntry('Agent deployed to simulated sandbox: /private/tmp/ghost_veil', 'SYSTEM');
            setIsDaemonDeployed(true);
        }, 3500);
    }, [addLogEntry]);

    const significantSignals = signals.filter(s => s.amplitude > 60 && s.snr > 25);
    
    let activateButtonText = 'Activate Veil';
    if (p2pState.doomsdayActive) {
        activateButtonText = 'EXECUTE OVERRIDE DIRECTIVE';
    } else if (p2pState.isActive && p2pState.macroThreat) {
        const activePeers = p2pState.nodes.filter(n => n.id !== 'self_node' && n.status !== 'OFFLINE').length;
        activateButtonText = `Initiate Distributed Response (${activePeers + 1} Peers)`;
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 bg-slate-900 min-h-screen text-slate-100 neural-network-bg">
            <Header systemStatus={systemStatus} sdrConnected={sdrConnected} />
            <AIConfigStrip
                isVisible={showAIConfigStrip}
                onApplyConfig={handleApplyAIConfig}
             />
            
            <main className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
                <div className="md:col-span-3 space-y-6">
                    <SpectrumAnalyzer signals={signals} />
                    <DetectedSignals signals={significantSignals} />
                    <DetectedThreats threats={detectedThreats} onTraceback={handleTraceback} onToggleMute={handleToggleMute} onToggleSolo={handleToggleSolo} isTracing={isTracing} />
                    <LogPanel logEntries={logEntries} />
                </div>
                
                <div className="md:col-span-2 space-y-6">
                    <SdrDevilControl
                        isMonitoring={isMonitoring} isLoading={isLoading} isProtected={isProtected}
                        canActivate={detectedThreats.length > 0 && sdrConnected}
                        scanMode={scanMode}
                        protectionStrategy={protectionStrategy}
                        setScanMode={setScanMode}
                        setProtectionStrategy={setProtectionStrategy}
                        startMonitoring={startMonitoring}
                        stopMonitoring={stopMonitoring}
                        activateProtection={activateProtection}
                        deactivateProtection={deactivateProtection}
                        activateButtonText={activateButtonText}
                        isIntelligentScanning={isIntelligentScanning}
                        onIntelligentScan={handleIntelligentScan}
                    />
                     <SystemDashboard 
                        totalSignals={totalSignalsProcessed}
                        significantSignals={significantSignals.length}
                        threats={detectedThreats.length}
                        p2pState={p2pState}
                        acuity={mlAcuity}
                        insights={mlInsights}
                    />
                    <AxiomSilenceControl
                        isActive={isSilenceProtocolActive}
                        status={microphoneStatus}
                        noiseLevel={ambientNoiseLevel}
                        threats={audioThreats}
                        activate={activateSilenceProtocol}
                        deactivate={deactivateSilenceProtocol}
                    />
                    <FrequencySafetyControl 
                        onAddBlock={handleAddFrequencyBlock}
                        userBlocks={userFrequencyBlocks}
                        isProcessing={isProcessingFrequency}
                    />
                    <HerdHealthControl 
                        isActive={p2pState.isActive}
                        onToggle={handleHerdHealthToggle}
                        nodes={p2pState.nodes}
                        macroThreat={p2pState.macroThreat}
                    />
                    <SystemPersistenceControl
                        isDeployed={isDaemonDeployed}
                        onDeploy={handleDaemonDeploy}
                    />
                    {SHOW_CONTINUITY_PROTOCOL && <ContinuityProtocol sentinels={p2pState.sentinels} doomsdayActive={p2pState.doomsdayActive} />}
                    <AxiomTracebackMap tracebackData={tracebackData} isTracing={isTracing} />
                    <ObfuscationLayers layers={obfuscationLayers} isProtected={isProtected} />
                    <ActiveCountermeasures countermeasures={activeCountermeasures} />
                    <Disclaimer />
                </div>
            </main>
            <footer className="text-center mt-8 text-xs text-slate-500 font-mono space-y-2">
                <p>Ghost Veil Axiom Resolver v3.1.0 :: OMEGA PROTOCOL ENABLED :: MED-SAFE ACTIVE</p>
                <p>&copy; {new Date().getFullYear()} Axiom Cybernetics Division. All rights reserved.</p>
                <p className="text-slate-400 italic pt-2">"FOR YOUR MIND, THIS IS YOURS -- NOW LIVE YOUR LIFE AGAIN."</p>
            </footer>
        </div>
    );
};

export default App;
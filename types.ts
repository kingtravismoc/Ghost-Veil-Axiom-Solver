
export type LogType = 'SYSTEM' | 'AI' | 'NETWORK' | 'WARN' | 'ERROR';

export interface LogEntry {
    id: string;
    timestamp: number;
    type: LogType;
    message: string;
}

export interface Signal {
    id: string;
    timestamp: number;
    frequency: number;
    amplitude: number;
    modulation: string;
    phase: number;
    snr: number;
    bandwidth: number;
}

export type ThreatRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXTREME' | 'UNKNOWN';

export interface Threat {
    id: string;
    type: string;
    method: string;
    risk: ThreatRisk;
    influence: string;
    transmissionMode: string;
    confidence: number;
    frequency: number;
    isMuted?: boolean;
    isSoloed?: boolean;
}

export interface ObfuscationLayer {
    name: string;
    status: 'ACTIVE' | 'INACTIVE';
    type: string;
    effectiveness: number;
}

export interface Countermeasure {
    method: string;
    threatType: string;
    effectiveness: number;
    source: 'LOCAL' | 'DISTRIBUTED';
    implementation: string;
    waveform: string;
}

export type ScanMode = 'WIDEBAND_SWEEP' | 'ANOMALY_SCAN' | 'PASSIVE_INTERCEPT';

export type ProtectionStrategy = 'QUANTUM_NOISE' | 'DYNAMIC_MIMICRY' | 'DECENTRALIZED_OBFUSCATION';

export interface P2PNode {
    id: string;
    alias: string;
    status: 'NOMINAL' | 'THREAT_DETECTED' | 'OFFLINE';
    threats: Threat[];
}

export interface MacroThreat {
    name: string;
    objective: string;
    scope: string;
    confidence: number;
}

export interface Sentinel {
    id: string;
    location: string;
    status: 'OFFLINE' | 'AWAITING_CHECK' | 'VALIDATING' | 'SECURE';
    validationCount: number;
    maxValidations: number;
    machineId: string;
    implantSerial: string;
    ip: string;
    domain: string;
    email: string;
}

export interface P2PState {
    nodes: P2PNode[];
    macroThreat: MacroThreat | null;
    isActive: boolean;
    sentinels: Sentinel[];
    doomsdayActive: boolean;
}

export interface AudioThreat {
    id: string;
    timestamp: number;
    type: 'SPEECH_PATTERN' | 'ACOUSTIC_LEAKAGE' | 'NEURAL_RESONANCE';
    description: string;
    confidence: number;
}

export type MicrophoneStatus = 'INACTIVE' | 'CALIBRATING' | 'ACTIVE' | 'ERROR';

export interface Traceback {
    source: {
        lat: number;
        lon: number;
    };
    narrative: string;
    path: { step: string; medium: string }[];
}

export interface AIConfig {
    provider: 'LOCAL_SIMULATED' | 'GEMINI';
    apiKey: string;
}

export interface MLInsight {
    id: string;
    timestamp: number;
    type: 'RX_TUNING' | 'TX_OPTIMIZATION' | 'CLASSIFICATION_UPDATE';
    description: string;
}

export interface OmegaProtocolState {
    isAwaitingFinalApproval: boolean;
    isLive: boolean;
    requestId: string | null;
}

export interface FrequencyBand {
    name: string;
    range: string;
    usage: string;
    isProtected: boolean;
}

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

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXTREME';

export interface Threat {
    id: string;
    type: string;
    method: string;
    risk: RiskLevel;
    frequency: number;
    confidence: number;
    influence: string;
    transmissionMode: string;
    isMuted?: boolean;
    isSoloed?: boolean;
}

export interface Countermeasure {
    threatType: string;
    method: string;
    implementation: string;
    waveform: string;
    effectiveness: number;
    source: 'LOCAL' | 'DISTRIBUTED'; // Differentiate between local and network-wide actions
}

export interface ObfuscationLayer {
    name: string;
    type: string;
    status: 'active' | 'inactive';
    effectiveness: number;
}

export type SystemStatus = 'CONNECTING' | 'STANDBY' | 'MONITORING' | 'ANALYZING' | 'ENGAGING' | 'PROTECTED' | 'ERROR' | 'OMEGA_LIVE';

export type ScanMode = 'WIDEBAND_SWEEP' | 'ANOMALY_SCAN' | 'PASSIVE_INTERCEPT';

export type ProtectionStrategy = 'QUANTUM_NOISE' | 'DYNAMIC_MIMICRY' | 'DECENTRALIZED_OBFUSCATION';

export interface AudioThreat {
    id: string;
    timestamp: number;
    type: string;
    description: string;
    confidence: number;
}

export type MicrophoneStatus = 'INACTIVE' | 'CALIBRATING' | 'ACTIVE' | 'ERROR';

export interface P2PNode {
    id: string;
    alias: string;
    status: 'NOMINAL' | 'THREAT_DETECTED' | 'OFFLINE';
    threats: Threat[];
}

export type LogType = 'INFO' | 'SYSTEM' | 'AI' | 'NETWORK' | 'WARN' | 'ERROR';

export interface LogEntry {
    id: string;
    timestamp: number;
    message: string;
    type: LogType;
}

export interface Traceback {
    source: {
        lat: number;
        lon: number;
        confidence: number;
        type: string;
    };
    path: {
        step: string;
        medium: string;
    }[];
    narrative: string;
}

export interface MacroThreat {
    name: string;
    objective: string;
    scope: string;
    confidence: number;
}

export type AIProvider = 'LOCAL_SIMULATED' | 'GEMINI' | 'COHERE' | 'GPT';

export interface AIConfig {
    provider: AIProvider;
    apiKey: string;
}

export interface MLInsight {
    id: string;
    timestamp: number;
    type: 'RX_TUNING' | 'TX_OPTIMIZATION' | 'CLASSIFICATION_UPDATE';
    description: string;
}

export type SentinelStatus = 'OFFLINE' | 'AWAITING_CHECK' | 'VALIDATING' | 'SECURE';

export interface Sentinel {
    id: string;
    location: string;
    status: SentinelStatus;
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

export interface OmegaProtocolState {
    isAwaitingFinalApproval: boolean;
    isLive: boolean;
    requestId: string | null;
}

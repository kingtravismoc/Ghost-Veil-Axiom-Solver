import { UserPlusIcon } from "./icons";

export type Modulation = 'AM' | 'FM' | 'PULSE' | 'FSK' | 'QAM' | 'MAGNETIC_PULSE' | 'BIO_OPTICAL' | 'SONAR_PING' | 'UV_BEAM' | 'PLASMA_WAVE';

export interface Signal {
  timestamp: number;
  frequency: number;
  amplitude: number;
  modulation: Modulation | string;
  phase: number;
  snr: number; // Signal-to-Noise Ratio
  bandwidth: number;
  id: string;
  classification?: string;
  tags?: string[];
  summary?: string;
  isClassified?: boolean;
  origin?: string; // To track downloaded intel, e.g., "p2p_intel_OP_1234"
}

export type ThreatRisk = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'EXTREME';

export interface Threat {
  id: string;
  type: string; // e.g., "COGNITIVE_RESONANCE_ATTACK"
  method: string;
  risk: ThreatRisk;
  confidence: number;
  influence: string;
  transmissionMode: string;
  frequency: number;
  isMuted?: boolean;
  isSoloed?: boolean;
}

export interface ObfuscationLayer {
    name: string;
    type: string; // e.g., "QUANTUM_TUNNELING"
    status: 'ACTIVE' | 'INACTIVE' | 'COMPROMISED';
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

export type LogType = 'SYSTEM' | 'AI' | 'NETWORK' | 'WARN' | 'ERROR' | 'INFO' | 'BLOCKCHAIN';

export interface LogEntry {
  id: string;
  timestamp: number;
  type: LogType;
  message: string;
}

export interface Traceback {
    source: {
        lat: number;
        lon: number;
        name: string;
    };
    path: { medium: string; step: string }[];
    narrative: string;
}

export type MLInsightType = 'RX_TUNING' | 'TX_OPTIMIZATION' | 'CLASSIFICATION_UPDATE';

export interface MLInsight {
    id: string;
    timestamp: number;
    type: MLInsightType;
    description: string;
}

export type P2PNodeStatus = 'ONLINE' | 'OFFLINE' | 'THREAT_DETECTED' | 'SECURE';

export interface P2PNode {
    id: string;
    alias: string;
    status: P2PNodeStatus;
    lastSeen: number;
    ip: string; // simulated
    appHash: string;
}

export interface P2PState {
    isActive: boolean;
    nodes: P2PNode[];
}

export interface MacroThreat {
    name: string;
    objective: string;
    scope: 'REGIONAL' | 'GLOBAL' | 'LOCALIZED';
    confidence: number;
}

export type MicrophoneStatus = 'INACTIVE' | 'CALIBRATING' | 'ACTIVE' | 'ERROR';

export type AudioThreatType = 'SPEECH_PATTERN' | 'ACOUSTIC_LEAKAGE' | 'NEURAL_RESONANCE';

export interface AudioThreat {
    id: string;
    timestamp: number;
    type: AudioThreatType;
    description: string;
    confidence: number;
}

export type ScanMode = 'WIDEBAND_SWEEP' | 'ANOMALY_SCAN' | 'PASSIVE_INTERCEPT';
export type ProtectionStrategy = 'QUANTUM_NOISE' | 'DYNAMIC_MIMICRY' | 'DECENTRALIZED_OBFUSCATION';

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

export interface AIConfig {
    provider: 'LOCAL_SIMULATED' | 'GEMINI';
    apiKey: string;
}

export interface ActivityEvent {
    id: string;
    timestamp: number;
    message: string;
}

export interface FrequencyBand {
    name: string;
    range: string;
    usage: string;
    isProtected: boolean;
}

export type ImplantedDeviceStatus = 'NOMINAL' | 'GREENLIST' | 'BLOCKED' | 'HIDDEN' | 'UNKNOWN';

export interface ImplantedDevice {
    id: string;
    name: string;
    type: string;
    locationInBody: string;
    status: ImplantedDeviceStatus;
    firmwareVersion: string;
    protocolLanguage: string;
    isBleMeshCapable: boolean;
    hardwareMap: { component: string, status: 'NOMINAL' | 'DEGRADED' }[];
    frequencies: { band: string, usage: string }[];
    knownCommands: string[];
}

export type UserRole = 'OPERATOR' | 'ADMIN' | 'SUPER_ADMIN' | 'GOV_AGENT' | 'DEVELOPER';

export type ContributionType = 'SIGNAL_CLASSIFICATION' | 'EXTENSION_REVIEW' | 'FEEDBACK' | 'VOTE';
export interface UserContribution {
    id: string;
    timestamp: number;
    type: ContributionType;
    description: string;
    agtAwarded: number;
}

export interface UserProfile {
    operatorId: string;
    role: UserRole;
    privateKey: string; // simulated
    contributions: UserContribution[];
    installedExtensions: string[]; // List of extension IDs
}

export interface Friend {
    id: string;
    operatorId: string;
    alias: string;
    status: 'ONLINE' | 'OFFLINE';
}

export interface GovApplication {
    id: string;
    agencyName: string;
    jurisdiction: string;
    contactEmail: string;
    justification: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export type NetworkType = 'mainnet' | 'forknet' | 'custom';
export interface Network {
    id: string;
    name: string;
    type: NetworkType;
    hash: string; // app hash associated with this network
}

export type SystemStatus = 'OFF' | 'ACTIVE_MONITORING' | 'PROTECTION_ACTIVE' | 'INTELLIGENT_SCAN' | 'WAVEMASK_ACTIVE';

export interface TriggerAction {
    type: 'START_SCAN' | 'STOP_SCAN' | 'ACTIVATE_PROTECTION' | 'DEACTIVATE_PROTECTION';
    payload: any; // ScanMode or ProtectionStrategy
}
export interface TriggerCondition {
    type: 'THREAT_DETECTED' | 'TIME_OF_DAY' | 'LOCATION_ENTER';
    payload: any; // ThreatRisk, time string, location string
}

export interface Trigger {
    id: string;
    naturalLanguage: string;
    isEnabled: boolean;
    conditions: TriggerCondition[];
    actions: TriggerAction[];
}

export interface Wallet {
    address: string;
    privateKey: string; // Simulated!
    balance: number; // VLT (Veil Tokens)
    agtBalance: number; // AGT (Axiom Governance Tokens)
}

export type TransactionType = 'PURCHASE' | 'DEPOSIT' | 'WITHDRAWAL' | 'SALE' | 'MINT' | 'FEE';
export interface Transaction {
    id: string;
    timestamp: number;
    type: TransactionType;
    amount: number;
    description: string;
}

export interface DeveloperProfile {
    totalSales: number;
    withdrawableBalance: number;
    transactions: Transaction[];
    wallet: Wallet;
}

export interface Extension {
    id: string;
    name: string;
    description: string;
    authorId: string;
    authorAlias: string;
    authorName: string;
    version: string;
    pricingModel: 'FREE' | 'FIXED_PRICE';
    price: number;
    isInstalled: boolean;
    requiredEndpoints: string[];
    validationTests: number;
    status: 'PENDING' | 'TESTING' | 'PUBLISHED' | 'REJECTED';
    isNft: boolean;
    contractId: string | null;
    icon: string;
    installDate: string;
    userCount: number;
    githubUrl: string;
    allowExport: boolean;
    isObfuscated: boolean;
    readme?: string;
    screenshots?: string[];
    hasBackgroundFunction?: boolean;
}

export interface SDKEndpoint {
    name: string;
    description: string;
    parameters: {
        name: string;
        type: string;
        description: string;
    }[];
    returns: string;
}

export interface SystemConfig {
    moonPayApiKey: string | null;
    moonPaySecretKey: string | null;
    systemWalletAddress: string | null;
    superAdminWalletAddress: string | null;
}

export interface OmegaProtocolState {
    isAwaitingFinalApproval: boolean;
    isLive: boolean;
    requestId: string | null;
}

export type FourDSafetyValidationResult = { isSafe: boolean; recommendation: string };

// New types for FaaS and Tokenomics
export type FunctionProtocolStatus = 'AVAILABLE' | 'COMING_SOON' | 'DEPRECATED';

export interface FunctionProtocol {
    id: string;
    name: string;
    description: string;
    status: FunctionProtocolStatus;
    costPerCall: number; // in VLT
    sdkIntegration: string;
    author: 'GHOST_VEIL' | 'USER';
    authorId?: string;
    reviewStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface RewardAllocation {
    type: ContributionType;
    agt: number;
}

export interface TreasuryState {
    masterWalletAddress: string;
    totalAgtSupply: number;
    circulatingAgt: number;
    proliferationGoal: number; // number of users
    currentUsers: number;
    isConversionUnlocked: boolean;
    rewardAllocations: RewardAllocation[];
}

export interface CognitiveMetricsState {
    bioCoherence: number;
    subconsciousInfluence: number;

    neuralEntrainment: number;
}

export interface ActiveOperation {
    id: string;
    name: string;
    progress: number;
    status: 'in-progress' | 'complete' | 'error';
}

// New types for Window Management
export type WindowState = 'open' | 'minimized' | 'maximized';
export interface OpenExtensionState {
    id: string;
    zIndex: number;
    windowState: WindowState;
    pos: { x: number; y: number };
    size: { w: number; h: number };
}

// New type for Feedback
export interface Feedback {
    id: string;
    timestamp: number;
    extensionId: string;
    text: string;
    status: 'PENDING' | 'REVIEWED';
    authorId: string;
}

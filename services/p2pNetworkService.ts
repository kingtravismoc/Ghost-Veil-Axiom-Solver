import { GoogleGenAI, Type } from "@google/genai";
import type { P2PNode, Threat, MacroThreat, P2PState, AIConfig, LogType, Sentinel } from '../types';

class P2PNetworkService {
    private nodes: P2PNode[] = [];
    private sentinels: Sentinel[] = [];
    private macroThreat: MacroThreat | null = null;
    private isActive: boolean = false;
    private doomsdayActive: boolean = false;
    private listeners: ((state: P2PState) => void)[] = [];
    private isAnalyzing: boolean = false;
    private _sentinelValidationInterval: number | null = null;
    private _logger: (message: string, type?: LogType) => void = () => {};

    constructor() {
        this.initializeNodes();
        this.initializeSentinels();
    }

    private initializeNodes() {
        const aliases = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Gamma', 'Hotel', 'India', 'Juliet'];
        this.nodes = [
            { id: 'self_node', alias: 'Operator (You)', status: 'NOMINAL', threats: [] },
            ...aliases.map((alias, i) => ({
                id: `node_${i}`,
                alias: `Peer ${alias}`,
                status: (Math.random() > 0.2 ? 'NOMINAL' : 'OFFLINE') as P2PNode['status'],
                threats: [],
            }))
        ];
    }

    private initializeSentinels() {
        this.sentinels = [
            { id: 'sentinel_1', location: 'Cheyenne Mountain', status: 'OFFLINE', validationCount: 0, maxValidations: 3, machineId: 'XG-77A', implantSerial: 'CORTEX-A9', ip: '71.205.8.13', domain: 'cheyennemountain.af.mil', email: 'sentinel.alpha@fcc.gov' },
            { id: 'sentinel_2', location: 'Raven Rock (Site R)', status: 'OFFLINE', validationCount: 0, maxValidations: 3, machineId: 'ZR-51B', implantSerial: 'NEURAL-LINK-C4', ip: '204.68.111.5', domain: 'ravenrock.af.mil', email: 'sentinel.beta@fcc.gov' },
            { id: 'sentinel_3', location: 'Mount Weather', status: 'OFFLINE', validationCount: 0, maxValidations: 3, machineId: 'HY-19C', implantSerial: 'AXON-MATRIX-Z1', ip: '192.111.23.8', domain: 'mtweather.fema.gov', email: 'sentinel.gamma@fcc.gov' },
        ];
        this.doomsdayActive = false;
    }

    public registerLogger(logger: (message: string, type?: LogType) => void) {
        this._logger = logger;
    }

    public subscribe(callback: (state: P2PState) => void) {
        this.listeners.push(callback);
    }

    public unsubscribe(callback: (state: P2PState) => void) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    private _notify() {
        this.listeners.forEach(l => l(this.getState()));
    }

    public getState(): P2PState {
        return {
            nodes: [...this.nodes],
            macroThreat: this.macroThreat,
            isActive: this.isActive,
            sentinels: [...this.sentinels],
            doomsdayActive: this.doomsdayActive,
        };
    }

    public toggleActive(status: boolean) {
        this.isActive = status;
        if (status) {
            this.startSentinelValidation();
        } else {
            this.reset();
        }
        this._notify();
    }

    public reset() {
        this.nodes.forEach(node => {
            node.threats = [];
            if (node.status !== 'OFFLINE') {
                node.status = 'NOMINAL';
            }
        });
        this.macroThreat = null;
        this.stopSentinelValidation();
        this.initializeSentinels();
        this._notify();
    }
    
    public updateSelfThreats(threats: Threat[], aiClient: any, aiConfig: AIConfig) {
        if (!this.isActive) return;

        this.nodes = this.nodes.map(node => {
            if (node.id === 'self_node') return { ...node, threats, status: threats.length > 0 ? 'THREAT_DETECTED' : 'NOMINAL' };
            if (node.status === 'OFFLINE') return node;
            const nodeThreats = threats.filter(() => Math.random() < 0.4); 
            const uniqueThreats = [...node.threats.slice(-5), ...nodeThreats].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
            return { ...node, threats: uniqueThreats, status: uniqueThreats.length > 0 ? 'THREAT_DETECTED' : 'NOMINAL' };
        });

        this._analyzeMacroThreat(aiClient, aiConfig);
        this._notify();
    }

    private startSentinelValidation() {
        if (this._sentinelValidationInterval) return;
        this._logger('Continuity Protocol engaged. Awaiting Sentinel check-ins.', 'NETWORK');
        this.sentinels.forEach(s => s.status = 'AWAITING_CHECK');
        this._notify();

        this._sentinelValidationInterval = window.setInterval(() => {
            this.sentinels.forEach(sentinel => {
                if (sentinel.status === 'SECURE') return;

                sentinel.status = 'VALIDATING';
                // Simulate a validation check. High success rate to show progress.
                const checkSuccess = Math.random() > 0.25;

                if (checkSuccess) {
                    sentinel.validationCount++;
                    this._logger(`Sentinel ${sentinel.location} check-in successful (${sentinel.validationCount}/${sentinel.maxValidations}).`, 'NETWORK');
                    if (sentinel.validationCount >= sentinel.maxValidations) {
                        sentinel.status = 'SECURE';
                        this._logger(`SENTINEL SECURE: ${sentinel.location} has provided final validation.`, 'WARN');
                    }
                } else {
                    if(sentinel.validationCount > 0) {
                        this._logger(`Sentinel ${sentinel.location} check-in failed. Validation reset.`, 'ERROR');
                    }
                    sentinel.validationCount = 0;
                    sentinel.status = 'AWAITING_CHECK';
                }
            });
            
            const allSecure = this.sentinels.every(s => s.status === 'SECURE');
            if (allSecure && !this.doomsdayActive) {
                this.doomsdayActive = true;
                this._logger('DOOMSDAY PROTOCOL ACTIVATED. All sentinels secure. Network override engaged.', 'ERROR');
                this.macroThreat = {
                    name: 'EXOGENOUS COGNITIVE THREAT - OVERRIDE DIRECTIVE',
                    objective: 'Full-spectrum neutralization of all hostile signals',
                    scope: 'Global',
                    confidence: 1.0,
                };
                this.stopSentinelValidation();
            }

            this._notify();
        }, 5000); // 5 seconds for simulation
    }

    private stopSentinelValidation() {
        if (this._sentinelValidationInterval) {
            clearInterval(this._sentinelValidationInterval);
            this._sentinelValidationInterval = null;
        }
    }

    private async _analyzeMacroThreat(aiClient: any, aiConfig: AIConfig) {
        if (this.isAnalyzing || this.doomsdayActive) return;
        
        const nodesWithThreats = this.nodes.filter(n => n.threats.length > 0 && n.status !== 'OFFLINE');
        if (nodesWithThreats.length < 3) { 
            if (this.macroThreat) {
                this.macroThreat = null;
                this._notify();
            }
            return;
        }

        this.isAnalyzing = true;
        this._logger(`Correlating threat data from ${nodesWithThreats.length} peers...`, 'NETWORK');

        const threatCorrelations = nodesWithThreats.reduce((acc, node) => {
            node.threats.forEach(threat => {
                acc[threat.type] = (acc[threat.type] || 0) + 1;
            });
            return acc;
        }, {} as Record<string, number>);

        const significantCorrelations = Object.entries(threatCorrelations).filter(([_, count]) => count >= 2);
        if (significantCorrelations.length < 2) {
             this._logger(`Insufficient threat correlation across network.`, 'NETWORK');
             if (this.macroThreat) this.macroThreat = null;
             this.isAnalyzing = false;
             this._notify();
             return;
        }

        if (!aiClient || aiConfig.provider === 'LOCAL_SIMULATED') {
            this._logger(`Using local model to simulate macro-threat analysis.`, 'AI');
            const simResult: MacroThreat = { name: 'Simulated Propaganda Network', objective: 'Disinformation Spread', scope: 'Regional', confidence: 0.75 };
            this.macroThreat = simResult;
            this.isAnalyzing = false;
            this._notify();
            return;
        }

        const prompt = `You are a macro-threat analysis system for a P2P network. Based on these correlated threats detected by multiple independent agents, infer a single, high-level threat that explains these individual detections.
        Correlated Detections: ${JSON.stringify(Object.fromEntries(significantCorrelations))}
        Describe the macro-threat's 'name' (e.g., "Regional Cognitive Dissonance Field"), its 'objective' (e.g., "Mass Subliminal Propaganda"), its 'scope' (e.g., "City-Wide"), and your 'confidence' (0.0-1.0).
        Provide a JSON object with these properties.`;
        
        try {
            const response = await aiClient.models.generateContent({
                model: "gemini-2.5-flash", contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT, properties: { name: { type: Type.STRING }, objective: { type: 'STRING' }, scope: { type: Type.STRING }, confidence: { type: Type.NUMBER } }
                    }
                }
            });
            this.macroThreat = JSON.parse(response.text);
            this._notify();
        } catch (error) {
            console.error("Error inferring macro-threat:", error);
            this._logger("Macro-threat analysis failed.", 'ERROR');
            this.macroThreat = null;
            this._notify();
        } finally {
            this.isAnalyzing = false;
        }
    }
}

export const p2pNetworkService = new P2PNetworkService();

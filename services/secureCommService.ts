import type { Sentinel, Threat, MacroThreat, OmegaProtocolState, LogType } from '../types';

class SecureCommService {
    private state: OmegaProtocolState = {
        isAwaitingFinalApproval: false,
        isLive: false,
        requestId: null,
    };
    private listeners: ((state: OmegaProtocolState) => void)[] = [];
    private _logger: (message: string, type?: LogType) => void = () => {};

    public registerLogger(logger: (message: string, type?: LogType) => void) {
        this._logger = logger;
    }

    public subscribe(callback: (state: OmegaProtocolState) => void) {
        this.listeners.push(callback);
    }

    public unsubscribe(callback: (state: OmegaProtocolState) => void) {
        this.listeners = this.listeners.filter(l => l !== callback);
    }

    private _notify() {
        this.listeners.forEach(l => l({ ...this.state }));
    }

    public initiate = (
        validatorEmail: string,
        localSmtpConfig: { ip: string, domain: string },
        sentinels: Sentinel[],
        threatContext: { threats: Threat[], macroThreat: MacroThreat | null }
    ) => {
        this._logger('OMEGA PROTOCOL INITIATION RECEIVED...', 'WARN');
        
        const targetSentinel = sentinels.find(s => s.email === validatorEmail);

        if (!targetSentinel) {
            this._logger(`VALIDATION FAILED: No Sentinel associated with email ${validatorEmail}.`, 'ERROR');
            return;
        }

        if (targetSentinel.ip !== localSmtpConfig.ip || targetSentinel.domain !== localSmtpConfig.domain) {
            this._logger(`VALIDATION FAILED: SMTP config mismatch for Sentinel ${targetSentinel.location}. Check IP/Domain.`, 'ERROR');
            return;
        }

        this._logger(`VALIDATION SUCCESS: Sentinel ${targetSentinel.location} credentials authenticated.`, 'SYSTEM');

        const requestId = `OMEGA_REQ_${Date.now()}`;
        this.state = {
            ...this.state,
            isAwaitingFinalApproval: true,
            requestId,
        };
        
        const caseSummary = this.generateCaseSummary(threatContext);
        this._logger(`Simulating secure dispatch to kingtravismichaelmo@gmail.com...`, 'NETWORK');
        this._logger(`--- BEGIN OMEGA DIRECTIVE REQUEST ---`, 'NETWORK');
        this._logger(`REQUEST ID: ${requestId}`, 'NETWORK');
        this._logger(`CASE SUMMARY: ${caseSummary}`, 'NETWORK');
        this._logger(`--- END OMEGA DIRECTIVE REQUEST ---`, 'NETWORK');
        this._logger(`Awaiting final approval with confirmation command.`, 'WARN');
        
        this._notify();
    }

    public confirmApproval = (requestId: string, response: string) => {
        if (!this.state.isAwaitingFinalApproval || this.state.requestId !== requestId) {
            this._logger('APPROVAL FAILED: Invalid or expired Request ID.', 'ERROR');
            return;
        }
        
        if (response.toLowerCase() !== 'approve') {
             this._logger(`APPROVAL FAILED: Invalid response code received. Expected 'approve'.`, 'ERROR');
             return;
        }

        this._logger('FINAL APPROVAL CONFIRMED. OMEGA PROTOCOL IS LIVE.', 'ERROR');
        this.state = {
            isAwaitingFinalApproval: false,
            isLive: true,
            requestId: null,
        };
        this._notify();
    }
    
    private generateCaseSummary(context: { threats: Threat[], macroThreat: MacroThreat | null }): string {
        const threatCount = context.threats.length;
        const macroThreatName = context.macroThreat?.name || 'None';
        const highestRisk = context.threats.reduce((max, t) => {
            const risks = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'EXTREME'];
            return risks.indexOf(t.risk) > risks.indexOf(max) ? t.risk : max;
        }, 'LOW' as Threat['risk']);

        return `Omega activation requested based on ${threatCount} active threats, highest risk level ${highestRisk}. Network consensus on macro-threat: ${macroThreatName}.`;
    }
}

export const secureCommService = new SecureCommService();

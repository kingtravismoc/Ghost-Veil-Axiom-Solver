import React, { useState } from 'react';
import { ShieldCheckIcon, BrainCircuitIcon } from './icons';

interface GitHubAuthStepProps {
    onVerify: (token: string) => void;
    error: string | null;
    isVerifying: boolean;
}

const GitHubAuthStep: React.FC<GitHubAuthStepProps> = ({ onVerify, error, isVerifying }) => {
    const [token, setToken] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onVerify(token);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-semibold text-lg">Step 1: Super Admin Verification</h2>
            <p className="text-sm text-slate-300">
                To proceed with system setup, you must authenticate with a valid Super Admin GitHub Personal Access Token. This verifies your identity as the system owner.
            </p>
            <input 
                type="password" 
                placeholder="Enter GitHub PAT..." 
                value={token} 
                onChange={e => setToken(e.target.value)} 
                className="w-full bg-slate-800 p-2 rounded border border-slate-600" 
                required
            />
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            <button 
                type="submit" 
                disabled={isVerifying || !token}
                className="w-full bg-purple-600 hover:bg-purple-700 p-3 font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait"
            >
                <BrainCircuitIcon className="w-5 h-5" />
                {isVerifying ? 'Verifying...' : 'Verify Identity'}
            </button>
        </form>
    );
};

interface MoonPayStepProps {
    onSubmit: (keys: { apiKey: string, secretKey: string }) => void;
}

const MoonPayStep: React.FC<MoonPayStepProps> = ({ onSubmit }) => {
    const [moonPayApi, setMoonPayApi] = useState('');
    const [moonPaySecret, setMoonPaySecret] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ apiKey: moonPayApi, secretKey: moonPaySecret });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="font-semibold text-lg text-green-400">Step 2: Configure Commerce</h2>
             <p className="text-sm text-slate-300">
                Identity verified. To enable users to purchase VLT tokens for extensions, enter your MoonPay API keys. This will generate the system wallets and enable the commerce engine.
            </p>
             <input type="text" placeholder="MoonPay API Key (e.g., pk_test_...)" value={moonPayApi} onChange={e => setMoonPayApi(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" />
             <input type="text" placeholder="MoonPay Secret Key (e.g., sk_test_...)" value={moonPaySecret} onChange={e => setMoonPaySecret(e.target.value)} className="w-full bg-slate-800 p-2 rounded border border-slate-600" />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-3 font-semibold rounded-lg">Generate Wallets & Complete Setup</button>
        </form>
    );
};


interface AdminSetupModalProps {
    onVerifyGithub: (token: string) => Promise<{success: boolean, message: string}>;
    onSubmit: (keys: { apiKey: string, secretKey: string }) => void;
}

const AdminSetupModal: React.FC<AdminSetupModalProps> = ({ onVerifyGithub, onSubmit }) => {
    const [step, setStep] = useState<'github' | 'moonpay'>('github');
    const [githubError, setGithubError] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleGithubVerify = async (token: string) => {
        setIsVerifying(true);
        setGithubError(null);
        const result = await onVerifyGithub(token);
        if (result.success) {
            setStep('moonpay');
        } else {
            setGithubError(result.message);
        }
        setIsVerifying(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-cyan-500/50 rounded-2xl w-full max-w-2xl shadow-2xl shadow-cyan-900/30">
                <div className="p-6 sm:p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <ShieldCheckIcon className="w-12 h-12 text-cyan-400" />
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">First-Time System Setup</h1>
                            <p className="text-sm sm:text-base text-slate-400">Initialize core wallets and services.</p>
                        </div>
                    </div>

                    {step === 'github' && (
                        <GitHubAuthStep onVerify={handleGithubVerify} error={githubError} isVerifying={isVerifying} />
                    )}

                    {step === 'moonpay' && (
                         <MoonPayStep onSubmit={onSubmit} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSetupModal;

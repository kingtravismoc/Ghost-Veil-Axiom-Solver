
import React, { useState } from 'react';
import { XIcon, WalletIcon } from './icons';
import type { SystemConfig } from '../types';

interface BuyTokensModalProps {
    onClose: () => void;
    onConfirm: (amount: number, method: 'MOONPAY' | 'LUMENS') => void;
    config: SystemConfig;
}

const BuyTokensModal: React.FC<BuyTokensModalProps> = ({ onClose, onConfirm, config }) => {
    const [amount, setAmount] = useState('100');
    const [paymentMethod, setPaymentMethod] = useState<'moonpay' | 'lumens'>('moonpay');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(Number(amount), paymentMethod === 'moonpay' ? 'MOONPAY' : 'LUMENS');
        onClose();
    };
    
    const isMoonPayEnabled = !!(config.moonPayApiKey && config.moonPaySecretKey);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-green-900/20"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2"><WalletIcon className="w-6 h-6 text-green-400"/> Buy Veil Tokens (VLT)</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Amount to Buy (VLT)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100 font-mono text-lg"
                            min="1"
                            required
                        />
                         <p className="text-xs text-slate-400 mt-1 text-center">1 VLT = 1 USD (Simulated)</p>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-2">Payment Method</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setPaymentMethod('moonpay')} disabled={!isMoonPayEnabled} className={`p-3 rounded-lg border-2 ${paymentMethod === 'moonpay' ? 'border-cyan-500 bg-cyan-900/30' : 'border-slate-600 bg-slate-800'} disabled:opacity-50`}>
                                Credit Card (via MoonPay)
                                {!isMoonPayEnabled && <span className="text-xs block text-slate-500">(Not Configured)</span>}
                            </button>
                            <button type="button" onClick={() => setPaymentMethod('lumens')} className={`p-3 rounded-lg border-2 ${paymentMethod === 'lumens' ? 'border-cyan-500 bg-cyan-900/30' : 'border-slate-600 bg-slate-800'}`}>
                                Stellar Lumens (XLM)
                            </button>
                        </div>
                    </div>
                    
                     {paymentMethod === 'lumens' && (
                        <div className="text-xs text-center p-2 bg-slate-800 rounded">
                            <p>Send XLM to:</p>
                            <p className="font-mono text-cyan-300 break-all">GD64YIY3TWGDMCNPP553DPW4N6WJLC6GJ42ES4MAQU4AIN2JUT3JDB5B</p>
                            <p className="mt-1">Transaction will be credited automatically (simulated).</p>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold">
                        Confirm Purchase
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BuyTokensModal;

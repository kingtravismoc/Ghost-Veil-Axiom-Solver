
import React, { useState } from 'react';
import { XIcon, WalletIcon } from './icons';

interface WithdrawModalProps {
    onClose: () => void;
    onConfirm: (amount: number) => void;
    balance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose, onConfirm, balance }) => {
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');

    const numericAmount = Number(amount);
    const canWithdraw = numericAmount > 0 && numericAmount <= balance;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canWithdraw || !address) return;
        onConfirm(numericAmount);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-cyan-900/20"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2"><WalletIcon className="w-6 h-6 text-cyan-400"/> Withdraw VLT to Lumens</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-slate-400">Available to Withdraw</p>
                        <p className="font-mono text-2xl font-bold text-green-400">{balance.toFixed(2)} VLT</p>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Amount to Withdraw (VLT)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100 font-mono"
                            max={balance}
                            placeholder="0.00"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">Destination Stellar (XLM) Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100 font-mono"
                            placeholder="G..."
                            required
                        />
                    </div>
                    
                    <button type="submit" disabled={!canWithdraw || !address} className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                        Confirm Withdrawal
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WithdrawModal;

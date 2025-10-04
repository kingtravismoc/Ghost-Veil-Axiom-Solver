import React, { useState } from 'react';
import { XIcon, WalletIcon, BrainCircuitIcon } from './icons';
import type { Wallet, Transaction } from '../types';

interface WalletModalProps {
    onClose: () => void;
    wallet: Wallet | null;
    transactions: Transaction[];
    onBuyTokens: () => void;
    onWithdraw: () => void;
}

const TransactionItem: React.FC<{ tx: Transaction }> = ({ tx }) => {
    const isCredit = tx.type === 'DEPOSIT' || tx.type === 'SALE';
    const color = isCredit ? 'text-green-400' : 'text-red-400';
    const sign = isCredit ? '+' : '-';
    
    if (tx.type === 'MINT') {
        return (
             <div className="flex justify-between items-center text-sm py-1">
                <div>
                    <p className="text-slate-200">{tx.description}</p>
                    <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
                </div>
                <p className={`font-mono font-semibold text-purple-400`}>MINT</p>
            </div>
        )
    }

    return (
        <div className="flex justify-between items-center text-sm py-1">
            <div>
                <p className="text-slate-200">{tx.description}</p>
                <p className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleString()}</p>
            </div>
            <p className={`font-mono font-semibold ${color}`}>{sign} {tx.amount.toFixed(2)} VLT</p>
        </div>
    );
};


const WalletModal: React.FC<WalletModalProps> = ({ onClose, wallet, transactions, onBuyTokens, onWithdraw }) => {
    if (!wallet) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl shadow-green-900/20 flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2"><WalletIcon className="w-6 h-6 text-green-400"/> My Wallet</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center">
                            <p className="text-sm text-slate-400">VLT Balance</p>
                            <p className="text-3xl font-bold text-green-300 font-mono">{wallet.balance.toFixed(2)}</p>
                        </div>
                         <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 text-center">
                            <p className="text-sm text-slate-400 flex items-center justify-center gap-1"><BrainCircuitIcon className="w-4 h-4" /> AGT Balance</p>
                            <p className="text-3xl font-bold text-purple-300 font-mono">{wallet.agtBalance.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="text-center p-2 bg-slate-800 rounded-md">
                        <p className="text-xs text-slate-400">Your Wallet Address</p>
                        <p className="text-xs text-cyan-300 font-mono break-all">{wallet.address}</p>
                    </div>
                     <div className="grid grid-cols-2 gap-2">
                        <button onClick={onBuyTokens} className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold">Buy VLT</button>
                        <button onClick={onWithdraw} className="w-full bg-cyan-600 hover:bg-cyan-700 p-3 rounded-lg font-semibold">Withdraw VLT</button>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mt-4 mb-2">Transaction History</h3>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                            {transactions.length === 0 && <p className="text-slate-500 text-center py-4">No transactions yet.</p>}
                            {transactions.slice().reverse().map(tx => <TransactionItem key={tx.id} tx={tx} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletModal;
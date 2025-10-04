
import React from 'react';
import { XIcon, CubeIcon } from './icons';
import type { Extension, Wallet } from '../types';

interface PurchaseExtensionModalProps {
    onClose: () => void;
    onConfirm: (extension: Extension) => void;
    extension: Extension | null;
    wallet: Wallet | null;
}

const PurchaseExtensionModal: React.FC<PurchaseExtensionModalProps> = ({ onClose, onConfirm, extension, wallet }) => {
    if (!extension || !wallet) return null;

    const canAfford = wallet.balance >= extension.price;

    const handleConfirm = () => {
        if (canAfford) {
            onConfirm(extension);
            onClose();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-cyan-900/20"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <CubeIcon className="w-6 h-6" />
                        Confirm Purchase
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                     <div>
                        <p className="text-sm text-slate-400">You are about to purchase:</p>
                        <p className="text-lg font-semibold text-cyan-300">{extension.name}</p>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Your Balance</span>
                            <span className="font-mono text-slate-200">{wallet.balance.toFixed(2)} VLT</span>
                        </div>
                         <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Item Cost</span>
                            <span className="font-mono text-slate-200">- {extension.price.toFixed(2)} VLT</span>
                        </div>
                        <div className="my-2 h-px bg-slate-700"></div>
                        <div className="flex justify-between items-center font-semibold">
                            <span className="text-slate-300">New Balance</span>
                            <span className={`font-mono ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                                {(wallet.balance - extension.price).toFixed(2)} VLT
                            </span>
                        </div>
                    </div>

                    {!canAfford && (
                        <p className="text-center text-red-400 text-sm">You do not have enough VLT to purchase this extension.</p>
                    )}

                    <button
                        onClick={handleConfirm}
                        disabled={!canAfford}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                    >
                        Confirm and Install
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PurchaseExtensionModal;

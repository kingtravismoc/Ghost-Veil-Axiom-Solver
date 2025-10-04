import React from 'react';
import { XIcon } from './icons';

interface ShareModalProps {
    onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose }) => {
    const duckdnsLink = `http://${(Math.random().toString(36).substring(7))}.duckdns.org:8123`;

    const handleEmailShare = () => {
        const subject = "Ghost Veil Protocol - Signal Integrity Framework";
        const body = `Access the Ghost Veil Protocol simulation here: ${window.location.href}\n\nThis is a conceptual tool for educational purposes.`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    const handleTextShare = () => {
        const body = `Ghost Veil Protocol: ${window.location.href}`;
        window.location.href = `sms:?&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl shadow-cyan-900/20"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold">Share Protocol Access</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-400">Share a link to this simulation. Remember to only share with trusted operators.</p>
                    
                    <button onClick={handleEmailShare} className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                        <strong>Email</strong>
                        <p className="text-xs text-slate-400">Compose a pre-filled email.</p>
                    </button>
                    <button onClick={handleTextShare} className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                        <strong>Text Message / SMS</strong>
                        <p className="text-xs text-slate-400">Open your default messaging app.</p>
                    </button>

                    <div className="p-3 bg-slate-800 rounded-lg">
                        <strong className="text-sm">Local Server (Simulated)</strong>
                        <p className="text-xs text-slate-400 mb-2">Share this temporary link with users on your local network.</p>
                        <div className="bg-slate-900 p-2 rounded-md text-cyan-300 font-mono text-xs break-all">
                            {duckdnsLink}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ShareModal;
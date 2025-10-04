import React from 'react';
import { GhostIcon } from './icons';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-900/50 backdrop-blur-sm p-4 border-b border-slate-700 sticky top-0 z-20">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <GhostIcon className="w-8 h-8 text-cyan-400" />
                    <div>
                        <h1 className="text-xl font-bold text-slate-100">Ghost Veil Protocol</h1>
                        <p className="text-xs text-slate-400">Cognitive Liberty & Signal Integrity Framework</p>
                    </div>
                </div>
                <div className="text-xs font-mono text-green-400 animate-pulse">
                    SYSTEM NOMINAL
                </div>
            </div>
        </header>
    );
};

export default Header;

import React from 'react';
import { GhostIcon } from './icons';
import type { SystemStatus } from '../types';

interface HeaderProps {
    systemStatus: SystemStatus;
    sdrConnected: boolean;
}

const statusConfig: Record<SystemStatus, { text: string; color: string; pulse: boolean }> = {
    STANDBY: { text: 'SYSTEM STANDBY', color: 'text-slate-400', pulse: false },
    CONNECTING: { text: 'CONNECTING TO SDRDEVIL NODE...', color: 'text-yellow-400', pulse: true },
    MONITORING: { text: 'MONITORING SPECTRUM', color: 'text-yellow-400', pulse: true },
    ANALYZING: { text: 'ANALYZING THREATS', color: 'text-cyan-400', pulse: true },
    ENGAGING: { text: 'ENGAGING COUNTERMEASURES', color: 'text-orange-400', pulse: true },
    PROTECTED: { text: 'GHOST VEIL ACTIVE', color: 'text-green-400', pulse: false },
    ERROR: { text: 'SYSTEM ERROR', color: 'text-red-500', pulse: false },
    OMEGA_LIVE: { text: 'OMEGA PROTOCOL LIVE :: DIRECT ACTION', color: 'text-red-400', pulse: true },
};

const Header: React.FC<HeaderProps> = ({ systemStatus, sdrConnected }) => {
    const { text, color, pulse } = statusConfig[systemStatus] || statusConfig.ERROR;
    const isOmega = systemStatus === 'OMEGA_LIVE';

    return (
        <header className={`text-center mb-8 ghost-float transition-all duration-500 ${isOmega ? 'p-4 bg-red-900/50 border border-red-500 rounded-lg' : ''}`}>
            <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-green-300 via-cyan-300 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <GhostIcon className="w-10 h-10" />
                Ghost Veil Axiom Resolver
            </h1>
            <p className="text-slate-300 text-md sm:text-lg italic">"FOR YOUR MIND, THIS IS YOURS -- NOW LIVE YOUR LIFE AGAIN."</p>
            <div className={`mt-4 text-xl font-semibold transition-colors duration-300 ${color}`}>
                <span className={pulse ? 'animate-pulse' : ''}>{text}</span>
            </div>
            <p className={`text-sm font-mono mt-2 transition-colors duration-300 ${sdrConnected ? 'text-green-400' : 'text-red-500'}`}>
                SDRDevil Node: <span className={sdrConnected ? 'animate-pulse' : ''}>{sdrConnected ? 'CONNECTED' : 'DISCONNECTED'}</span>
            </p>
        </header>
    );
};

export default Header;
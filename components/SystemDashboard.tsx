import React from 'react';
import { ActivityIcon, BrainCircuitIcon, RadarIcon, UsersIcon, TerminalIcon } from './icons';
import type { MLInsight, P2PState, ActivityEvent } from '../types';

interface SystemDashboardProps {
    totalSignals: number;
    significantSignals: number;
    threats: number;
    p2pState: P2PState;
    acuity: number;
    insights: MLInsight[];
    activityEvents: ActivityEvent[];
}

const MetricCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; colorClass: string }> = ({ icon, label, value, colorClass }) => (
    <div className="bg-slate-900/50 p-3 rounded-lg flex items-center gap-3 border border-slate-700">
        <div className={`p-2 rounded-md ${colorClass}`}>
            {icon}
        </div>
        <div>
            <div className="text-xs text-slate-400">{label}</div>
            <div className="text-lg font-bold text-slate-100">{value}</div>
        </div>
    </div>
);

const getInsightTypeInfo = (type: MLInsight['type']): { label: string; color: string } => {
    switch (type) {
        case 'RX_TUNING': return { label: 'RX Tuning', color: 'bg-cyan-600' };
        case 'TX_OPTIMIZATION': return { label: 'TX Optimization', color: 'bg-green-600' };
        case 'CLASSIFICATION_UPDATE': return { label: 'Reclassification', color: 'bg-purple-600' };
        default: return { label: 'System Update', color: 'bg-slate-600' };
    }
};

const RecentActivityFeed: React.FC<{ events: ActivityEvent[] }> = ({ events }) => (
    <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2"><TerminalIcon className="w-4 h-4" />Recent Activity</h3>
        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-2 bg-slate-900/50 p-2 rounded-md font-mono text-xs">
            {events.length === 0 && <p className="text-slate-500">No recent activity.</p>}
            {events.map(event => (
                <div key={event.id} className="flex gap-2 items-start">
                    <span className="text-slate-500 flex-shrink-0">{new Date(event.timestamp).toLocaleTimeString()}</span>
                    <p className="text-slate-300 break-words">{event.message}</p>
                </div>
            ))}
        </div>
    </div>
);

const SystemDashboard: React.FC<SystemDashboardProps> = ({ totalSignals, significantSignals, threats, p2pState, acuity, insights, activityEvents }) => {
    const acuityPercent = (acuity * 100);
    const circumference = 2 * Math.PI * 18; // 2 * pi * r
    const strokeDashoffset = circumference - (acuityPercent / 100) * circumference;
    const activePeers = p2pState.isActive ? p2pState.nodes.filter(n => n.id !== 'self_node' && n.status !== 'OFFLINE').length : 0;

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 sm:p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold">System Dashboard & ML Core</h2>
            
            <div className="grid grid-cols-2 gap-3">
                <MetricCard icon={<ActivityIcon className="w-5 h-5"/>} label="Signals Processed" value={totalSignals.toLocaleString()} colorClass="bg-blue-600/50 text-blue-300" />
                <MetricCard icon={<RadarIcon className="w-5 h-5"/>} label="Threats Identified" value={threats} colorClass="bg-red-600/50 text-red-300" />
                <MetricCard icon={<ActivityIcon className="w-5 h-5"/>} label="Significant Signals" value={significantSignals} colorClass="bg-cyan-600/50 text-cyan-300" />
                <MetricCard icon={<UsersIcon className="w-5 h-5"/>} label="Active Peers" value={activePeers} colorClass="bg-purple-600/50 text-purple-300" />
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="18" className="stroke-slate-700" strokeWidth="3" fill="transparent" />
                        <circle
                            cx="20"
                            cy="20"
                            r="18"
                            className="stroke-cyan-400"
                            strokeWidth="3"
                            fill="transparent"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            transform="rotate(-90 20 20)"
                            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-cyan-300 font-bold text-lg">
                        {acuityPercent.toFixed(0)}<span className="text-xs">%</span>
                    </div>
                </div>
                 <div>
                    <h3 className="font-semibold text-slate-200">Deep ML Acuity</h3>
                    <p className="text-xs text-slate-400">System's predictive accuracy based on processed signals and threat analysis.</p>
                </div>
            </div>

            <RecentActivityFeed events={activityEvents} />

            {insights.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                     <h3 className="text-sm font-semibold text-slate-300">Learned Adjustments:</h3>
                     {insights.map(insight => {
                         const typeInfo = getInsightTypeInfo(insight.type);
                         return (
                            <div key={insight.id} className="bg-slate-900/70 p-2 rounded-md border-l-2 border-purple-400">
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className={`px-2 py-0.5 text-white rounded-full text-[10px] ${typeInfo.color}`}>{typeInfo.label}</span>
                                    <span className="text-slate-500">{new Date(insight.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-xs text-slate-200">{insight.description}</p>
                            </div>
                         )
                    })}
                </div>
            )}
        </div>
    );
};

export default SystemDashboard;

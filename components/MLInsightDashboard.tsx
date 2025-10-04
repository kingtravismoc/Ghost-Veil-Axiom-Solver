import React from 'react';
import type { MLInsight } from '../types';
import { BrainCircuitIcon } from './icons';

interface MLInsightDashboardProps {
    insights: MLInsight[];
}

const getInsightTypeInfo = (type: MLInsight['type']): { label: string; color: string } => {
    switch (type) {
        case 'RX_TUNING': return { label: 'RX Tuning', color: 'bg-cyan-600' };
        case 'TX_OPTIMIZATION': return { label: 'TX Optimization', color: 'bg-green-600' };
        case 'CLASSIFICATION_UPDATE': return { label: 'Reclassification', color: 'bg-purple-600' };
        default: return { label: 'System Update', color: 'bg-slate-600' };
    }
};

const StandardCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}> = ({ title, icon, children, className = '' }) => (
    <div className={`bg-slate-800/50 rounded-lg border border-slate-700 flex flex-col ${className}`}>
        <h2 className="text-lg font-semibold flex items-center gap-2 p-4 border-b border-slate-700 text-slate-300 flex-shrink-0">
            {icon}
            {title}
        </h2>
        <div className="p-4 flex-grow overflow-y-auto">
            {children}
        </div>
    </div>
);

const MLInsightDashboard: React.FC<MLInsightDashboardProps> = ({ insights }) => {
    if (insights.length === 0) {
        return (
            <StandardCard title="ML Insights & Adjustments" icon={<BrainCircuitIcon className="w-5 h-5 text-slate-400" />}>
                 <p className="text-center text-slate-400 py-8">No learned adjustments from the AI core yet.</p>
            </StandardCard>
        );
    }

    return (
        <StandardCard title="ML Insights & Adjustments" icon={<BrainCircuitIcon className="w-5 h-5 text-purple-400" />}>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
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
        </StandardCard>
    );
};

export default MLInsightDashboard;

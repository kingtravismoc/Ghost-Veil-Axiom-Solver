
import React from 'react';
import type { MLInsight } from '../types';

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

const MLInsightDashboard: React.FC<MLInsightDashboardProps> = ({ insights }) => {
    if (insights.length === 0) {
        return null;
    }

    return (
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <h2 className="text-lg font-semibold mb-3 text-slate-300">ML Insights & Learned Adjustments</h2>
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
        </div>
    );
};

export default MLInsightDashboard;

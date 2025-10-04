import React from 'react';
import { BrainCircuitIcon } from './icons';
import type { MLInsight } from '../types';

interface MLInsightDashboardProps {
    acuity: number;
    insights: MLInsight[];
}

const getInsightTypeInfo = (type: MLInsight['type']): { label: string; color: string } => {
    switch (type) {
        case 'RX_TUNING':
            return { label: 'RX Tuning', color: 'bg-cyan-600' };
        case 'TX_OPTIMIZATION':
            return { label: 'TX Optimization', color: 'bg-green-600' };
        case 'CLASSIFICATION_UPDATE':
            return { label: 'Reclassification', color: 'bg-purple-600' };
        default:
            return { label: 'System Update', color: 'bg-slate-600' };
    }
};

const MLInsightDashboard: React.FC<MLInsightDashboardProps> = ({ acuity, insights }) => {
    const acuityPercent = (acuity * 100).toFixed(1);

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <BrainCircuitIcon className="w-6 h-6 text-purple-400" />
                Deep ML Insight Core
            </h2>

            <div>
                <label className="text-sm font-medium text-slate-300">ML Acuity Level</label>
                <div className="w-full bg-slate-700 rounded-full h-2.5 mt-1">
                    <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${acuityPercent}%` }}
                    ></div>
                </div>
                <p className="text-right text-xs font-mono text-cyan-300 mt-1">{acuityPercent}%</p>
            </div>

            {insights.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                     <h3 className="text-sm font-semibold text-slate-300">Learned Adjustments:</h3>
                     {insights.map(insight => {
                         const typeInfo = getInsightTypeInfo(insight.type);
                         return (
                            <div key={insight.id} className="bg-slate-900/50 p-2 rounded-md border-l-2 border-purple-400">
                                <div className="flex justify-between items-center text-xs mb-1">
                                    <span className={`px-2 py-0.5 text-white rounded-full text-[10px] ${typeInfo.color}`}>{typeInfo.label}</span>
                                    <span className="text-slate-500">{new Date(insight.timestamp).toLocaleTimeString()}</span>
                                </div>
                                <p className="text-xs text-slate-200">{insight.description}</p>
                            </div>
                         )
                    })}
                </div>
            ) : (
                <div className="text-center text-sm text-slate-400 p-3 bg-slate-900/40 rounded-md border border-slate-700">
                    <p>Start monitoring to build ML acuity and generate insights.</p>
                </div>
            )}
        </div>
    );
};

export default MLInsightDashboard;
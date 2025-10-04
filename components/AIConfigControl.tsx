import React, { useState, useEffect, useCallback } from 'react';
import { BrainCircuitIcon } from './icons';
import type { AIProvider, AIConfig } from '../types';

interface AIConfigControlProps {
    onApply: (config: AIConfig) => void;
}

const AIConfigControl: React.FC<AIConfigControlProps> = ({ onApply }) => {
    const [isEnhanced, setIsEnhanced] = useState(false);
    
    const memoizedOnApply = useCallback(onApply, []);

    useEffect(() => {
        if (isEnhanced) {
            memoizedOnApply({ provider: 'GEMINI', apiKey: '' }); // apiKey is not used, but kept for type compliance
        } else {
            memoizedOnApply({ provider: 'LOCAL_SIMULATED', apiKey: '' });
        }
    }, [isEnhanced, memoizedOnApply]);

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <BrainCircuitIcon className="w-6 h-6 text-purple-400" />
                AI Core Configuration
            </h2>

            <div className="flex items-center space-x-3">
                <input
                    type="checkbox"
                    id="enhanced-ai-toggle"
                    checked={isEnhanced}
                    onChange={(e) => setIsEnhanced(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-cyan-500 focus:ring-cyan-600"
                />
                <label htmlFor="enhanced-ai-toggle" className="text-sm font-medium text-slate-200">
                    Enable Enhanced AI Analysis (Gemini)
                </label>
            </div>

            <div className="text-center text-sm text-slate-400 p-3 bg-slate-900/40 rounded-md border border-slate-700">
                {isEnhanced ? (
                    <p>Using Google Gemini via pre-configured API key.</p>
                ) : (
                    <>
                        <p>Using Standard Local Model (GPT-2 Simulated).</p>
                        <p className="text-xs">No configuration required.</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AIConfigControl;

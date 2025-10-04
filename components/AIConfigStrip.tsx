import React, { useState } from 'react';
import { BrainCircuitIcon } from './icons';
import type { AIConfig } from '../types';

interface AIConfigStripProps {
    isVisible: boolean;
    onApplyConfig: (config: AIConfig) => void;
}

const AIConfigStrip: React.FC<AIConfigStripProps> = ({ isVisible, onApplyConfig }) => {
    const [isEnhanced, setIsEnhanced] = useState(false);

    const handleToggle = (checked: boolean) => {
        setIsEnhanced(checked);
        if (checked) {
            onApplyConfig({ provider: 'GEMINI', apiKey: '' });
        } else {
            onApplyConfig({ provider: 'LOCAL_SIMULATED', apiKey: '' });
        }
    };

    return (
        <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
                isVisible ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 -translate-y-4'
            }`}
        >
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700 flex items-center justify-between gap-4 mb-4 quantum-shield">
                <div className="flex items-center gap-2">
                    <BrainCircuitIcon className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-semibold text-slate-200">AI CORE:</span>
                    <span className="text-sm text-slate-400">
                        Currently using Standard Local Model.
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <label htmlFor="enhanced-ai-toggle" className="text-sm font-medium text-cyan-300 cursor-pointer">
                        Enable Enhanced Analysis (Gemini)
                    </label>
                    <input
                        type="checkbox"
                        id="enhanced-ai-toggle"
                        checked={isEnhanced}
                        onChange={(e) => handleToggle(e.target.checked)}
                        className="relative peer shrink-0
                            appearance-none w-10 h-5 bg-slate-700 rounded-full
                            checked:bg-cyan-600
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500
                            transition-colors duration-200 cursor-pointer
                            after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md
                            after:absolute after:top-0.5 after:left-0.5
                            after:transition-all after:duration-200
                            peer-checked:after:translate-x-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default AIConfigStrip;

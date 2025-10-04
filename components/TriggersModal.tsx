
import React, { useState } from 'react';
import { XIcon, ZapIcon, BrainCircuitIcon } from './icons';
import type { Trigger, Threat, ScanMode, ProtectionStrategy } from '../types';

interface TriggersModalProps {
    onClose: () => void;
    triggers: Trigger[];
    onAddTrigger: (trigger: Omit<Trigger, 'id'|'isEnabled'>) => Promise<void>;
    onToggleTrigger: (id: string) => void;
    onDeleteTrigger: (id: string) => void;
    isProcessing: boolean;
}

const TriggerItem: React.FC<{ trigger: Trigger; onToggle: (id: string) => void; onDelete: (id: string) => void; }> = ({ trigger, onToggle, onDelete }) => (
    <div className="bg-slate-800 p-3 rounded-lg flex items-center justify-between gap-4">
        <p className="text-sm text-slate-200 flex-grow italic">"{trigger.naturalLanguage}"</p>
        <div className="flex items-center gap-3 flex-shrink-0">
             <button onClick={() => onDelete(trigger.id)} title="Delete Trigger" className="text-slate-500 hover:text-red-400 p-1">
                <XIcon className="w-4 h-4" />
            </button>
            <input
                type="checkbox"
                checked={trigger.isEnabled}
                onChange={() => onToggle(trigger.id)}
                className="relative peer shrink-0 appearance-none w-10 h-5 bg-slate-700 rounded-full checked:bg-cyan-600 transition-colors duration-200 cursor-pointer after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:absolute after:top-0.5 after:left-0.5 after:transition-all after:duration-200 peer-checked:after:translate-x-full"
            />
        </div>
    </div>
);

const TriggersModal: React.FC<TriggersModalProps> = ({ onClose, triggers, onAddTrigger, onToggleTrigger, onDeleteTrigger, isProcessing }) => {
    const [naturalLanguageInput, setNaturalLanguageInput] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!naturalLanguageInput.trim()) return;
        await onAddTrigger({ naturalLanguage: naturalLanguageInput.trim() } as any);
        setNaturalLanguageInput('');
    };
    
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl shadow-cyan-900/20 flex flex-col max-h-[90vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ZapIcon className="w-6 h-6 text-yellow-400" />
                        Automated Triggers (Watchdog)
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto">
                    <div>
                        <h3 className="text-lg font-semibold text-slate-100 mb-2">Create New Trigger</h3>
                        <p className="text-sm text-slate-400 mb-3">Describe the automation you want in plain English. The AI will create the rule. Examples:</p>
                        <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 mb-3 pl-2">
                            <li>When a critical threat appears, activate the quantum noise veil.</li>
                            <li>If I enter "downtown", start a wideband sweep.</li>
                            <li>At 10pm, scan for anomalies.</li>
                        </ul>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            <textarea
                                value={naturalLanguageInput}
                                onChange={e => setNaturalLanguageInput(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100 focus:ring-2 focus:ring-cyan-500"
                                placeholder="Enter trigger rule..."
                                rows={3}
                                required
                            />
                            <button
                                type="submit"
                                disabled={isProcessing || !naturalLanguageInput.trim()}
                                className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-wait px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300"
                            >
                                <BrainCircuitIcon className="w-5 h-5" />
                                {isProcessing ? 'AI is Processing...' : 'Generate and Add Trigger'}
                            </button>
                        </form>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-100 mb-3">Active Triggers ({triggers.length})</h3>
                        <div className="space-y-3">
                            {triggers.length > 0 ? (
                                triggers.map(trigger => (
                                    <TriggerItem key={trigger.id} trigger={trigger} onToggle={onToggleTrigger} onDelete={onDeleteTrigger} />
                                ))
                            ) : (
                                <p className="text-slate-500 text-center py-4">No triggers configured.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TriggersModal;

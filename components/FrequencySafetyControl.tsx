import React, { useState } from 'react';
import { PlusCircleIcon, ShieldCheckIcon } from './icons';
import type { UserFrequencyBlock } from '../types';

interface FrequencySafetyControlProps {
    onAddBlock: (freq: number, bandwidth: number, title: string, summary: string) => void;
    userBlocks: UserFrequencyBlock[];
    isProcessing: boolean;
}

const suggestedBlocks: Omit<UserFrequencyBlock, 'id'>[] = [
    { frequency: 462.6, bandwidth: 12.5, title: "GMRS Repeater Interference", summary: "Commonly reported source of wide-area interference on GMRS channel 18 in urban zones.", source: 'CROWDSOURCED', geographicalArea: 'US-WEST-2' },
    { frequency: 1575.42, bandwidth: 2000, title: "Errant GPS L1 Jammer", summary: "Crowdsourced reports indicate a non-state actor is jamming GPS L1 signals in this corridor.", source: 'CROWDSOURCED', geographicalArea: 'EU-CENTRAL-1' }
];

const FrequencySafetyControl: React.FC<FrequencySafetyControlProps> = ({ onAddBlock, userBlocks, isProcessing }) => {
    const [freq, setFreq] = useState('');
    const [bandwidth, setBandwidth] = useState('12.5');
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const freqNum = parseFloat(freq);
        const bwNum = parseFloat(bandwidth);
        if (freqNum > 0 && bwNum > 0 && title && summary) {
            onAddBlock(freqNum, bwNum, title, summary);
            setFreq('');
            setBandwidth('12.5');
            setTitle('');
            setSummary('');
        }
    };
    
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <ShieldCheckIcon className="w-6 h-6 text-green-400" />
                4D Safety Axiom
            </h2>
             <p className="text-xs text-slate-400">
                Manually define and submit frequencies for neutralization. The AI Core will perform a safety analysis to prevent disruption of critical services or biological frequencies before canonizing and engaging the block.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3 bg-slate-900/40 p-4 rounded-lg border border-slate-700">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                         <label htmlFor="freq" className="block text-xs font-medium text-slate-300 mb-1">Frequency (MHz)</label>
                         <input type="number" id="freq" value={freq} onChange={e => setFreq(e.target.value)} required placeholder="e.g., 462.6" className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm text-slate-100 focus:ring-1 focus:ring-cyan-500" />
                    </div>
                     <div>
                         <label htmlFor="bw" className="block text-xs font-medium text-slate-300 mb-1">Bandwidth (kHz)</label>
                         <input type="number" id="bw" value={bandwidth} onChange={e => setBandwidth(e.target.value)} required placeholder="e.g., 12.5" className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm text-slate-100 focus:ring-1 focus:ring-cyan-500" />
                    </div>
                </div>
                <div>
                     <label htmlFor="title" className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                     <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Short description of signal" className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm text-slate-100 focus:ring-1 focus:ring-cyan-500" />
                </div>
                 <div>
                     <label htmlFor="summary" className="block text-xs font-medium text-slate-300 mb-1">Summary</label>
                     <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} required rows={2} placeholder="Details about the signal's effect or nature" className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-sm text-slate-100 focus:ring-1 focus:ring-cyan-500"></textarea>
                </div>
                <button type="submit" disabled={isProcessing} className="w-full bg-gradient-to-r from-green-600 to-teal-700 hover:from-green-700 hover:to-teal-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-wait px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                    <PlusCircleIcon className="w-5 h-5" />
                    {isProcessing ? 'Analyzing...' : 'Submit for Blocking'}
                </button>
            </form>
            
            {(userBlocks.length > 0 || suggestedBlocks.length > 0) && (
                 <div className="space-y-3">
                     <h3 className="text-sm font-semibold text-slate-300">Active & Suggested Blocks:</h3>
                     <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {[...userBlocks, ...suggestedBlocks.map(b => ({...b, id: `sugg_${b.frequency}`}))].map(block => (
                            <div key={block.id} className={`p-2 rounded-md bg-slate-900/60 border-l-2 ${block.source === 'USER' ? 'border-green-400' : 'border-cyan-400'}`}>
                                <div className="flex justify-between items-center text-xs">
                                    <p className="font-bold text-slate-100">{block.title}</p>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${block.source === 'USER' ? 'bg-green-600' : 'bg-cyan-600'}`}>{block.source}</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1">{block.summary}</p>
                                <p className="text-[10px] font-mono text-cyan-300 mt-1">{block.frequency} MHz / {block.bandwidth} kHz</p>
                            </div>
                        ))}
                     </div>
                 </div>
            )}

        </div>
    );
};

export default FrequencySafetyControl;

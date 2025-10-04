import React, { useState, useEffect } from 'react';
import type { TreasuryState, RewardAllocation, ContributionType } from '../types';
import { ChartBarIcon, BrainCircuitIcon } from './icons';

interface TokenomicsDashboardProps {
    treasury: TreasuryState | null;
    onUpdateRewards: (allocations: RewardAllocation[]) => void;
}

const TokenomicsDashboard: React.FC<TokenomicsDashboardProps> = ({ treasury, onUpdateRewards }) => {
    const [rewards, setRewards] = useState<RewardAllocation[]>([]);

    useEffect(() => {
        if (treasury) {
            setRewards(treasury.rewardAllocations);
        }
    }, [treasury]);

    if (!treasury) {
        return <p className="text-slate-400">Loading tokenomics data...</p>;
    }
    
    const handleRewardChange = (type: ContributionType, value: string) => {
        const newRewards = rewards.map(r => r.type === type ? { ...r, agt: Number(value) } : r);
        setRewards(newRewards);
    };

    const handleSaveChanges = () => {
        onUpdateRewards(rewards);
        alert("Reward allocations updated.");
    };

    const proliferationProgress = (treasury.currentUsers / treasury.proliferationGoal) * 100;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400">Total AGT Supply</p>
                    <p className="text-2xl font-bold text-purple-300 font-mono">{treasury.totalAgtSupply.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400">Circulating AGT</p>
                    <p className="text-2xl font-bold text-purple-300 font-mono">{treasury.circulatingAgt.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400">Conversion Status</p>
                    <p className={`text-2xl font-bold font-mono ${treasury.isConversionUnlocked ? 'text-green-400' : 'text-red-400'}`}>
                        {treasury.isConversionUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </p>
                </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <h4 className="font-semibold text-slate-200">Network Proliferation Goal</h4>
                <p className="text-xs text-slate-400 mb-2">AGT value is unlocked when the network reaches critical mass.</p>
                <div className="w-full bg-slate-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full" style={{ width: `${proliferationProgress}%` }}></div>
                </div>
                <p className="text-right text-sm font-mono mt-1">{treasury.currentUsers.toLocaleString()} / {treasury.proliferationGoal.toLocaleString()} Users ({proliferationProgress.toFixed(2)}%)</p>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                 <h4 className="font-semibold text-slate-200 mb-2">Contribution Rewards (AGT)</h4>
                 <div className="space-y-2">
                    {rewards.map(reward => (
                        <div key={reward.type} className="flex items-center justify-between">
                            <label htmlFor={reward.type} className="text-sm text-slate-300">{reward.type.replace(/_/g, ' ')}</label>
                            <input
                                id={reward.type}
                                type="number"
                                value={reward.agt}
                                onChange={e => handleRewardChange(reward.type, e.target.value)}
                                className="bg-slate-800 border border-slate-600 rounded-md p-1 w-24 text-right font-mono"
                            />
                        </div>
                    ))}
                 </div>
                 <button onClick={handleSaveChanges} className="mt-4 w-full bg-cyan-600 hover:bg-cyan-700 p-2 rounded-md font-semibold">Save Reward Changes</button>
            </div>
        </div>
    );
};

export default TokenomicsDashboard;

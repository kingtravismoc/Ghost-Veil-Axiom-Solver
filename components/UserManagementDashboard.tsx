import React from 'react';
import { UsersIcon, BrainCircuitIcon } from './icons';
import type { UserProfile, Friend, UserContribution } from '../types';

const ContributionItem: React.FC<{ contribution: UserContribution}> = ({ contribution }) => (
    <div className="bg-slate-800/50 p-2 rounded-md flex justify-between items-center text-sm">
        <div>
            <p className="font-semibold text-slate-200">{contribution.type.replace(/_/g, ' ')}</p>
            <p className="text-xs text-slate-400 italic">"{contribution.description}"</p>
        </div>
        <div className="text-right">
            <p className="font-mono font-bold text-purple-300">+{contribution.agtAwarded} AGT</p>
            <p className="text-xs text-slate-500">{new Date(contribution.timestamp).toLocaleDateString()}</p>
        </div>
    </div>
);

interface UserManagementDashboardProps {
    currentUser: UserProfile;
    friends: Friend[];
}

const UserManagementDashboard: React.FC<UserManagementDashboardProps> = ({ currentUser, friends }) => {
    return (
        <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    Operator Profile
                </h2>
                <div className="mt-4 space-y-3 bg-slate-900/50 p-4 rounded-lg">
                    <div>
                        <label className="text-xs text-slate-400">Operator ID</label>
                        <p className="font-mono text-cyan-300">{currentUser.operatorId}</p>
                    </div>
                     <div>
                        <label className="text-xs text-slate-400">Role</label>
                        <p className="font-semibold text-green-300">{currentUser.role.replace('_', ' ')}</p>
                    </div>
                     <div>
                        <label className="text-xs text-slate-400">Private Key (Simulated)</label>
                        <p className="font-mono text-sm text-slate-500 break-all">{currentUser.privateKey}</p>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                   <BrainCircuitIcon className="w-6 h-6 text-purple-400" />
                   Contributions & Rewards
                </h2>
                <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-2">
                    {currentUser.contributions.length === 0 && <p className="text-slate-400 text-center py-4">No contributions recorded yet. Classify signals or review extensions to earn AGT.</p>}
                    {currentUser.contributions.slice().reverse().map(c => <ContributionItem key={c.id} contribution={c} />)}
                </div>
            </div>


             <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <UsersIcon className="w-6 h-6 text-purple-400" />
                    Trusted Friends Network ({friends.length})
                </h2>
                <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-2">
                    {friends.length === 0 && <p className="text-slate-400">No friends added. Use the header button to add an operator.</p>}
                    {friends.map(friend => (
                        <div key={friend.id} className="bg-slate-900/50 p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-slate-200">{friend.alias}</h3>
                                <p className="text-xs text-slate-500 font-mono">{friend.operatorId}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${friend.status === 'ONLINE' ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                                <span className="text-sm font-semibold">{friend.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserManagementDashboard;
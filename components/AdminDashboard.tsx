import React from 'react';
import type { GovApplication } from '../types';
import { BriefcaseIcon } from './icons';

interface AdminDashboardProps {
    applications: GovApplication[];
    onApprove: (appId: string) => void;
    onReject: (appId: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ applications, onApprove, onReject }) => {
    const pendingApps = applications.filter(app => app.status === 'PENDING');

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
                <BriefcaseIcon className="w-6 h-6 text-yellow-400" />
                Admin Dashboard - Agency Applications
            </h2>

            {pendingApps.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No pending applications.</p>
            ) : (
                <div className="space-y-4">
                    {pendingApps.map(app => (
                        <div key={app.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-100">{app.agencyName}</h3>
                                    <p className="text-sm text-slate-400">{app.jurisdiction}</p>
                                    <p className="text-sm text-cyan-400 font-mono">{app.contactEmail}</p>
                                </div>
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-600">PENDING</span>
                            </div>
                            <div className="mt-3 p-3 bg-slate-800 rounded-md">
                                <p className="text-xs text-slate-300 font-semibold">Justification:</p>
                                <p className="text-sm text-slate-200 italic">"{app.justification}"</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button onClick={() => onApprove(app.id)} className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded-md font-semibold">Approve</button>
                                <button onClick={() => onReject(app.id)} className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded-md font-semibold">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;

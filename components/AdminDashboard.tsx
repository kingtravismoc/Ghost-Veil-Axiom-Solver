import React, { useState } from 'react';
import type { GovApplication, FunctionProtocol, Feedback } from '../types';
import { BriefcaseIcon, CodeBracketIcon, ChartBarIcon, BrainCircuitIcon } from './icons';
import TokenomicsDashboard from './TokenomicsDashboard'; 

interface ApplicationsViewProps {
    applications: GovApplication[];
    onApprove: (appId: string) => void;
    onReject: (appId: string) => void;
}

const ApplicationsView: React.FC<ApplicationsViewProps> = ({ applications, onApprove, onReject }) => {
    const pendingApps = applications.filter(app => app.status === 'PENDING');
    return (
         <div className="space-y-4">
            {pendingApps.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No pending applications.</p>
            ) : (
                pendingApps.map(app => (
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
                ))
            )}
        </div>
    );
}

interface FunctionsViewProps {
    protocols: FunctionProtocol[];
    onApprove: (protocolId: string) => void;
    onReject: (protocolId: string) => void;
}

const FunctionsView: React.FC<FunctionsViewProps> = ({ protocols, onApprove, onReject }) => {
    const pendingProtocols = protocols.filter(p => p.reviewStatus === 'PENDING');
    return (
         <div className="space-y-4">
             {pendingProtocols.length === 0 ? (
                <p className="text-slate-400 text-center py-8">No pending function protocols for review.</p>
            ) : (
                pendingProtocols.map(proto => (
                    <div key={proto.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                         <h3 className="font-bold text-lg text-slate-100">{proto.name}</h3>
                         <p className="text-xs text-slate-500">by {proto.authorId}</p>
                         <p className="text-sm text-slate-300 my-2 italic">"{proto.description}"</p>
                         <div className="flex gap-2 mt-4">
                            <button onClick={() => onApprove(proto.id)} className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded-md font-semibold">Approve</button>
                            <button onClick={() => onReject(proto.id)} className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded-md font-semibold">Reject</button>
                        </div>
                    </div>
                ))
             )}
         </div>
    );
};

interface FeedbackViewProps {
    feedback: Feedback[];
    onReward: (feedbackId: string) => void;
    aiSummary: string;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ feedback, onReward, aiSummary }) => (
    <div className="space-y-4">
        <div className="bg-slate-900/50 p-4 rounded-lg border border-purple-700">
            <h4 className="font-semibold text-purple-300 flex items-center gap-2"><BrainCircuitIcon className="w-5 h-5" /> AI-Generated Summary</h4>
            <p className="text-sm text-slate-300 italic mt-1">{aiSummary || "Awaiting sufficient feedback for analysis..."}</p>
        </div>
        {feedback.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No user feedback submitted yet.</p>
        ) : (
            feedback.map(item => (
                <div key={item.id} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-slate-500">From: {item.authorId}</p>
                            <p className="text-xs text-slate-500">Regarding: {item.extensionId}</p>
                        </div>
                         <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-600">{item.status}</span>
                    </div>
                    <p className="text-sm text-slate-200 my-2 p-2 bg-slate-800 rounded-md italic">"{item.text}"</p>
                    <button onClick={() => onReward(item.id)} className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded-md font-semibold text-sm">Award 10 AGT for Feedback</button>
                </div>
            ))
        )}
    </div>
);


interface AdminDashboardProps {
    applications: GovApplication[];
    onApproveApplication: (appId: string) => void;
    onRejectApplication: (appId: string) => void;
    functionProtocols: FunctionProtocol[];
    onApproveFunction: (funcId: string) => void;
    onRejectFunction: (funcId: string) => void;
    treasuryState: any; 
    onUpdateRewards: (allocations: any) => void;
    feedback: Feedback[];
    onRewardFeedback: (feedbackId: string) => void;
    aiFeedbackSummary: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = (props) => {
    const [activeTab, setActiveTab] = useState('applications');
    
    const tabs = [
        { id: 'applications', label: 'Gov Applications', icon: BriefcaseIcon },
        { id: 'functions', label: 'Function Protocols', icon: CodeBracketIcon },
        { id: 'tokenomics', label: 'Tokenomics & Treasury', icon: ChartBarIcon },
        { id: 'feedback', label: 'Feedback Queue', icon: BrainCircuitIcon },
    ];

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 space-y-4">
            <h2 className="text-2xl font-semibold">Super Admin Dashboard</h2>
            <div className="border-b border-slate-700">
                <nav className="-mb-px flex space-x-4 overflow-x-auto">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                            <tab.icon className="w-5 h-5"/> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            {activeTab === 'applications' && <ApplicationsView applications={props.applications} onApprove={props.onApproveApplication} onReject={props.onRejectApplication} />}
            {activeTab === 'functions' && <FunctionsView protocols={props.functionProtocols} onApprove={props.onApproveFunction} onReject={props.onRejectFunction} />}
            {activeTab === 'tokenomics' && <TokenomicsDashboard treasury={props.treasuryState} onUpdateRewards={props.onUpdateRewards} />}
            {activeTab === 'feedback' && <FeedbackView feedback={props.feedback} onReward={props.onRewardFeedback} aiSummary={props.aiFeedbackSummary} />}

        </div>
    );
};

export default AdminDashboard;

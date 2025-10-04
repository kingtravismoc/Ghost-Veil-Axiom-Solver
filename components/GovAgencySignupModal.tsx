import React, { useState } from 'react';
import { XIcon, BriefcaseIcon } from './icons';
import type { GovApplication } from '../types';

interface GovAgencySignupModalProps {
    onClose: () => void;
    onSubmit: (application: Omit<GovApplication, 'id' | 'status'>) => void;
}

const GovAgencySignupModal: React.FC<GovAgencySignupModalProps> = ({ onClose, onSubmit }) => {
    const [agencyName, setAgencyName] = useState('');
    const [jurisdiction, setJurisdiction] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [justification, setJustification] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ agencyName, jurisdiction, contactEmail, justification });
        setIsSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl shadow-yellow-900/20"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BriefcaseIcon className="w-6 h-6 text-yellow-400" />
                        Governmental Agency Portal
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                {isSubmitted ? (
                    <div className="p-8 text-center">
                        <h3 className="text-2xl font-bold text-green-400">Application Submitted</h3>
                        <p className="text-slate-300 mt-2">Your application has been sent to the system administrator for review. You will be notified via the provided contact email upon approval.</p>
                        <button onClick={onClose} className="mt-6 bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg font-semibold">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <p className="text-sm text-slate-400">Official government agencies may apply for enhanced access and regional moderation capabilities. All applications are subject to manual review and verification by the super administrator.</p>
                        
                        <div>
                            <label htmlFor="agency-name" className="block text-xs font-medium text-slate-300 mb-1">Agency Name</label>
                            <input id="agency-name" type="text" value={agencyName} onChange={e => setAgencyName(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100" required />
                        </div>
                        <div>
                            <label htmlFor="jurisdiction" className="block text-xs font-medium text-slate-300 mb-1">Jurisdiction / Region of Operation</label>
                            <input id="jurisdiction" type="text" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100" required />
                        </div>
                         <div>
                            <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1">Official Contact Email</label>
                            <input id="contact-email" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100" required />
                        </div>
                        <div>
                            <label htmlFor="justification" className="block text-xs font-medium text-slate-300 mb-1">Justification for Access</label>
                            <textarea id="justification" value={justification} onChange={e => setJustification(e.target.value)} rows={3} className="w-full bg-slate-800 border border-slate-600 rounded-md p-2 text-slate-100" required />
                        </div>

                        <button type="submit" className="w-full bg-gradient-to-r from-yellow-600 to-orange-700 hover:from-yellow-700 hover:to-orange-800 px-4 py-3 rounded-lg font-semibold">Submit Application for Review</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default GovAgencySignupModal;

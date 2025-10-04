import React, { useState } from 'react';
import type { Extension } from '../types';
import { XIcon, CodeBracketIcon } from './icons';

interface ExtensionDetailModalProps {
    extension: Extension | null;
    onClose: () => void;
    onSubmitFeedback: (extensionId: string, feedback: string) => void;
}

const ExtensionDetailModal: React.FC<ExtensionDetailModalProps> = ({ extension, onClose, onSubmitFeedback }) => {
    const [activeTab, setActiveTab] = useState('details');
    const [feedback, setFeedback] = useState('');
    const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

    if (!extension) return null;

    const handleFeedbackSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitFeedback(extension.id, feedback);
        setFeedback('');
        setIsFeedbackSubmitted(true);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-900/20"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <h2 className="text-xl font-bold">{extension.name} <span className="text-base font-normal text-slate-400">v{extension.version}</span></h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700">
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto space-y-4">
                    <p className="text-slate-300">{extension.description}</p>
                    <p className="text-sm text-slate-400">by {extension.authorName}</p>
                    
                    <div className="w-full aspect-video bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                        <p className="text-slate-500">Screenshot Placeholder</p>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <h3 className="font-semibold mb-2">README.md</h3>
                        <div className="text-sm text-slate-300 max-h-48 overflow-y-auto prose prose-invert">
                           <pre className="whitespace-pre-wrap font-sans">{extension.readme || 'No README provided.'}</pre>
                        </div>
                    </div>

                    <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                         <h3 className="font-semibold mb-2">Submit Feedback</h3>
                         {isFeedbackSubmitted ? (
                            <p className="text-green-400 text-center">Thank you! Your feedback has been submitted for review.</p>
                         ) : (
                             <form onSubmit={handleFeedbackSubmit} className="space-y-2">
                                <textarea 
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                    placeholder={`Have a suggestion or found a bug in ${extension.name}?`}
                                    className="w-full bg-slate-800 p-2 rounded border border-slate-600"
                                    rows={3}
                                    required
                                />
                                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 p-2 rounded font-semibold">Submit to Admin</button>
                            </form>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtensionDetailModal;

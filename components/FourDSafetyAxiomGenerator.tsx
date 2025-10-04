import React from 'react';
import { CubeIcon, BlueprintIcon, ShieldCheckIcon, ZapIcon } from './icons';
import type { FourDSafetyState, FourDSafetyData } from '../types';

interface FourDSafetyAxiomGeneratorProps {
    onGenerate: () => void;
    processState: FourDSafetyState;
    data: FourDSafetyData | null;
}

const processSteps = [
    { state: 'GENERATING', label: '1D: Generating Axioms', description: 'Establishing foundational, non-negotiable safety principles based on the system\'s core purpose.' },
    { state: 'VALIDATING', label: '2D: Validating Axioms', description: 'Ensuring the core principles are logically sound and non-contradictory.' },
    { state: 'THREAT_ANALYSIS', label: '3D: Dynamic Threat Anticipation', description: 'Comprehensive analysis of all potential failures across software, hardware, human, and environmental domains.' },
    { state: 'OPTIMIZING', label: '4D: Optimizing Resolving Logic', description: 'Generating the most efficient, multi-purpose solutions to address a wide range of identified threats.' },
    { state: 'COMPLETE', label: 'Blueprint Complete', description: 'The dynamic safety blueprint is ready for implementation.' },
];

const StepIndicator: React.FC<{ label: string, description: string, isActive: boolean, isComplete: boolean }> = ({ label, description, isActive, isComplete }) => {
    const baseClasses = "transition-all duration-500";
    let stateClasses = "bg-slate-800 border-slate-700";
    if (isActive) stateClasses = "bg-slate-700 border-cyan-500 scale-105 shadow-lg shadow-cyan-900/50";
    if (isComplete) stateClasses = "bg-slate-900 border-green-500";
    
    return (
        <div className={`p-4 rounded-lg border-l-4 ${baseClasses} ${stateClasses}`}>
            <h3 className={`font-semibold ${isComplete ? 'text-green-300' : isActive ? 'text-cyan-300 animate-pulse' : 'text-slate-300'}`}>{label}</h3>
            <p className="text-xs text-slate-400 mt-1">{description}</p>
        </div>
    );
};

const FourDSafetyAxiomGenerator: React.FC<FourDSafetyAxiomGeneratorProps> = ({ onGenerate, processState, data }) => {
    const isLoading = processState !== 'IDLE' && processState !== 'COMPLETE' && processState !== 'ERROR';
    const currentStateIndex = processSteps.findIndex(step => step.state === processState);

    const getButtonText = () => {
        if (processState === 'ERROR') return 'Generation Failed - Retry';
        if (isLoading) return 'Generating Blueprint...';
        if (processState === 'COMPLETE') return 'Re-generate Blueprint';
        return 'Generate Dynamic Safety Blueprint';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
                    <h2 className="text-2xl font-semibold flex items-center gap-3">
                        <CubeIcon className="w-8 h-8 text-cyan-400" />
                        4D Safety Axiom Generator
                    </h2>
                    <p className="text-sm text-slate-300">
                        A dynamic, proactive AI process that anticipates every possible failure mode and generates optimized, multi-purpose solutions.
                    </p>
                    <button
                        onClick={onGenerate}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-wait px-6 py-4 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-blue-900/50"
                    >
                        <BlueprintIcon className="w-6 h-6" />
                        {getButtonText()}
                    </button>
                    {processState === 'ERROR' && <p className="text-xs text-red-400 text-center">An error occurred during generation. Please check the logs and try again.</p>}
                </div>
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-3">
                    <h3 className="text-lg font-semibold text-slate-200">Generation Process</h3>
                    {processSteps.map((step, index) => (
                         <StepIndicator 
                            key={step.state}
                            label={step.label}
                            description={step.description}
                            isActive={currentStateIndex === index}
                            isComplete={currentStateIndex > index || processState === 'COMPLETE'}
                         />
                    ))}
                </div>
            </div>

            <div className="lg:col-span-3">
                {data && processState === 'COMPLETE' ? (
                     <div className="bg-slate-800/50 rounded-lg p-6 border border-green-500/50 space-y-6 max-h-[80vh] overflow-y-auto">
                        <div>
                            <h3 className="text-xl font-bold text-green-300 mb-2">System Goal & Purpose</h3>
                            <p className="text-slate-300 p-3 bg-slate-900/50 rounded-md border border-slate-700 italic">"{data.goal}"</p>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-bold text-green-300 mb-2 flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5" /> Foundational Axioms</h3>
                            <div className="space-y-3">
                                {data.axioms.map((axiom, i) => (
                                    <div key={i} className="p-3 bg-slate-900/50 rounded-md border border-slate-700">
                                        <h4 className="font-semibold text-cyan-300">{axiom.name}</h4>
                                        <p className="text-sm text-slate-300">{axiom.description}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 p-2 bg-green-900/30 text-green-300 text-sm rounded-md border border-green-700/50">
                                <strong>Validation:</strong> {data.validationResult}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-green-300 mb-2">Anticipated Threat Matrix</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.threatMatrix.map((matrix, i) => (
                                    <div key={i} className="p-3 bg-slate-900/50 rounded-md border border-slate-700">
                                        <h4 className="font-semibold text-orange-300">{matrix.domain} Domain</h4>
                                        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1 mt-1">
                                            {matrix.threats.map((threat, ti) => <li key={ti}>{threat}</li>)}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-green-300 mb-2 flex items-center gap-2"><ZapIcon className="w-5 h-5"/> Optimized Resolving Logic</h3>
                             <div className="space-y-3">
                                {data.resolvingLogic.map((logic, i) => (
                                    <div key={i} className="p-3 bg-slate-900/50 rounded-md border border-purple-500/50">
                                        <h4 className="font-semibold text-purple-300">{logic.name}</h4>
                                        <p className="text-sm text-slate-300 my-1">{logic.solution}</p>
                                        <p className="text-xs text-slate-400"><strong>Targets:</strong> {logic.targets.join(', ')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                ) : (
                    <div className="flex items-center justify-center h-full bg-slate-800/50 rounded-lg p-6 border border-slate-700 border-dashed">
                        <div className="text-center text-slate-400">
                            <BlueprintIcon className="w-16 h-16 mx-auto text-slate-600 mb-4" />
                            <h3 className="text-lg font-semibold">Awaiting Blueprint Generation</h3>
                            <p>The AI-generated safety blueprint will be displayed here.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FourDSafetyAxiomGenerator;
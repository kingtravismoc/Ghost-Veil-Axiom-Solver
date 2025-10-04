import React from 'react';
import { MapPinIcon } from './icons';
import type { Traceback } from '../types';

interface AxiomTracebackMapProps {
    tracebackData: Traceback | null;
    isTracing: boolean;
}

const AxiomTracebackMap: React.FC<AxiomTracebackMapProps> = ({ tracebackData, isTracing }) => {
    const defaultView = { lat: 34.0522, lon: -118.2437, zoom: 4 }; // Los Angeles
    const sourceView = tracebackData ? { ...tracebackData.source, zoom: 14 } : defaultView;

    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${sourceView.lon - 0.01}%2C${sourceView.lat - 0.01}%2C${sourceView.lon + 0.01}%2C${sourceView.lat + 0.01}&layer=mapnik&marker=${sourceView.lat}%2C${sourceView.lon}`;
    
    return (
        <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 quantum-shield space-y-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
                <MapPinIcon className="w-6 h-6 text-indigo-400" />
                Axiomatic Traceback Map
            </h2>

            <div className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
                {isTracing && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/80">
                        <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-indigo-300 font-semibold">Engaging Axiomatic Solver...</p>
                        <p className="text-xs text-slate-400">Tracing signal across domains...</p>
                    </div>
                )}
                {!tracebackData && !isTracing && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/80">
                        <p className="text-slate-400 text-center">Initiate traceback on a high-risk threat to view source.</p>
                    </div>
                )}
                <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    src={mapUrl}
                    className="filter brightness-75 contrast-125"
                    title="Traceback Map"
                ></iframe>
                 {tracebackData && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                         <MapPinIcon className="w-8 h-8 text-red-500 drop-shadow-lg animate-pulse" />
                    </div>
                )}
            </div>
            
            {tracebackData && (
                <div className="space-y-3 text-xs max-h-48 overflow-y-auto pr-2">
                     <div>
                        <h3 className="font-bold text-slate-200 mb-1">Traceback Narrative:</h3>
                        <p className="text-slate-300">{tracebackData.narrative}</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-slate-200 mb-1">Signal Path:</h3>
                        <ul className="list-disc list-inside space-y-1 font-mono">
                            {tracebackData.path.map((step, index) => (
                                <li key={index} className="text-cyan-300">
                                    <span className="text-purple-400 mr-2">{step.medium}:</span>
                                    <span className="text-slate-300">{step.step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AxiomTracebackMap;

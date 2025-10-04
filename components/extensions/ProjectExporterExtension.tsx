import React from 'react';
import type { GhostVeilSdk } from '../ExtensionHost';
import { ArrowUpTrayIcon } from '../icons';

interface ProjectExporterExtensionProps {
  sdk: GhostVeilSdk;
}

const ProjectExporterExtension: React.FC<ProjectExporterExtensionProps> = ({ sdk }) => {

    const handleExport = () => {
        const state = sdk.getSystemState();
        const exportData = {
            timestamp: new Date().toISOString(),
            protocolVersion: '2.0-Axiom',
            data: {
                signals: state.signals,
                threats: state.threats,
                p2pNodes: state.p2pNodes,
            }
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `ghost_veil_export_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        sdk.addLog('Project state exported successfully.', 'INFO');
    };

    return (
        <div className="p-6 bg-slate-900 text-white h-full flex flex-col items-center justify-center text-center space-y-6">
             <ArrowUpTrayIcon className="w-24 h-24 text-cyan-500" />
            <h2 className="text-2xl font-bold">Project State Exporter</h2>
            <p className="max-w-md text-slate-400">
                Export the current state of the Ghost Veil Protocol, including all detected signals, active threats, and P2P network nodes, into a single JSON file for archival or external analysis.
            </p>
            <button
                onClick={handleExport}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-lg flex items-center gap-2"
            >
                <ArrowUpTrayIcon className="w-5 h-5" />
                Export System State (.json)
            </button>
        </div>
    );
};

export default ProjectExporterExtension;
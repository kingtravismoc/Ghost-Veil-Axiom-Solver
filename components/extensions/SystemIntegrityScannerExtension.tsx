import React, { useState } from 'react';
import type { GhostVeilSdk } from '../ExtensionHost';
import { ShieldCheckIcon } from '../icons';

interface SystemIntegrityScannerProps {
  sdk: GhostVeilSdk;
}

const coreFiles = [
    { name: 'sdrDevilService.js', hash: 'a1b2c3d4...' },
    { name: 'p2pNetworkService.js', hash: 'e5f6g7h8...' },
    { name: 'axiomKernel.dll', hash: 'i9j0k1l2...' },
    { name: 'wavemask.so', hash: 'm3n4o5p6...' },
];

const SystemIntegrityScannerExtension: React.FC<SystemIntegrityScannerProps> = ({ sdk }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanLog, setScanLog] = useState<string[]>([]);
    const [isOk, setIsOk] = useState(true);

    const runScan = () => {
        setIsScanning(true);
        setScanLog([]);
        setIsOk(true);
        sdk.addLog('System Integrity: Scan initiated.', 'INFO');

        let currentLog: string[] = [];
        const updateLog = (msg: string) => {
            currentLog = [...currentLog, msg];
            setScanLog(currentLog);
        };

        let fileIndex = 0;
        const interval = setInterval(() => {
            if (fileIndex < coreFiles.length) {
                updateLog(`[CHECKING] ${coreFiles[fileIndex].name}...`);
                // Simulate a small chance of corruption
                if (Math.random() > 0.95) {
                    updateLog(`[ FAILED ] Hash mismatch for ${coreFiles[fileIndex].name}!`);
                    setIsOk(false);
                } else {
                     updateLog(`[  OK  ] Hash matches master record.`);
                }
                fileIndex++;
            } else {
                clearInterval(interval);
                setIsScanning(false);
                 if (isOk) {
                    updateLog(`\nScan complete. All core files are secure.`);
                    sdk.addLog('System Integrity: Scan complete. All files OK.', 'SYSTEM');
                 } else {
                    updateLog(`\nSCAN FAILED! System integrity compromised!`);
                    sdk.addLog('System Integrity: CORRUPTION DETECTED!', 'ERROR');
                 }
            }
        }, 500);
    };


    return (
        <div className="p-6 bg-slate-900 text-white h-full flex flex-col">
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="w-7 h-7" /> System Integrity Scanner
            </h2>
            <div className="flex-grow bg-black/50 p-4 rounded-lg border border-slate-700 font-mono text-sm text-green-400 overflow-y-auto space-y-1">
                {scanLog.length > 0 ? scanLog.map((line, i) => (
                    <p key={i} className={line.includes('FAILED') ? 'text-red-500' : ''}>{line}</p>
                )) : <p className="text-slate-500">Awaiting scan initiation...</p>}
            </div>
            <button
                onClick={runScan}
                disabled={isScanning}
                className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg text-lg disabled:bg-slate-600 disabled:cursor-wait"
            >
                {isScanning ? 'Scanning...' : 'Run Integrity Scan'}
            </button>
        </div>
    );
};

export default SystemIntegrityScannerExtension;
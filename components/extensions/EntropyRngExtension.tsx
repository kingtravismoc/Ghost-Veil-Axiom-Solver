
import React, { useState, useEffect, useCallback } from 'react';
import type { GhostVeilSdk } from '../ExtensionHost';
import { CubeAltIcon } from '../icons';
import { sha256 } from 'js-sha256';

interface EntropyRngExtensionProps {
  sdk: GhostVeilSdk;
}

const EntropyRngExtension: React.FC<EntropyRngExtensionProps> = ({ sdk }) => {
    const [entropyPool, setEntropyPool] = useState('');
    const [generatedNumber, setGeneratedNumber] = useState('');
    const [format, setFormat] = useState('hex');

    const updateEntropyPool = useCallback(() => {
        const { signals } = sdk.getSystemState();
        if (signals.length === 0) return;
        
        const latestSignal = signals[signals.length - 1];
        const rawString = `${latestSignal.id}${latestSignal.snr}${latestSignal.amplitude}${Date.now()}`;
        const hash = sha256(entropyPool + rawString);
        
        setEntropyPool(hash);
    }, [sdk, entropyPool]);

    useEffect(() => {
        const interval = setInterval(updateEntropyPool, 100);
        return () => clearInterval(interval);
    }, [updateEntropyPool]);

    useEffect(() => {
        // Setup the API hook for external apps
        const apiCallback = (data: any) => {
            if (data.type === 'GET_ENTROPY') {
                const numBytes = data.bytes || 16;
                const newEntropy = sha256(entropyPool + Math.random());
                const result = newEntropy.substring(0, numBytes * 2); // 2 hex chars per byte
                sdk.addLog(`Entropy RNG: Served ${numBytes} bytes to an external app.`, 'INFO');
                return { success: true, entropy: result };
            }
            return { success: false, error: 'Invalid request type' };
        };

        const closeHook = sdk.createApiHook('ghostveil_entropy_rng', apiCallback);
        
        // Cleanup on unmount
        return () => closeHook();
    }, [sdk, entropyPool]);
    

    const handleGenerate = () => {
        const hash = sha256(entropyPool + Math.random());
        switch (format) {
            case 'hex':
                setGeneratedNumber(hash);
                break;
            case 'integer':
                setGeneratedNumber(parseInt(hash.substring(0, 15), 16).toString());
                break;
            case 'base64':
                setGeneratedNumber(btoa(hash));
                break;
        }
    };

    const entropyProgress = (entropyPool.length / 64) * 100;

    return (
        <div className="p-6 bg-slate-900 text-white h-full space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
                <CubeAltIcon className="w-7 h-7" /> Signal Entropy Random Number Generator
            </h2>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h3 className="font-semibold">Live Entropy Pool</h3>
                <p className="text-xs text-slate-400 mb-2">Continuously stirred with noise from live signal data (SNR, amplitude, timestamps).</p>
                <div className="w-full bg-slate-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-4 rounded-full" style={{ width: `${entropyProgress}%` }}></div>
                </div>
                <p className="font-mono text-xs break-all text-slate-500 mt-2">{entropyPool}</p>
            </div>
            
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                 <div className="flex items-center gap-4 mb-4">
                    <select value={format} onChange={e => setFormat(e.target.value)} className="bg-slate-700 p-2 rounded border border-slate-600">
                        <option value="hex">Hexadecimal</option>
                        <option value="integer">Integer</option>
                        <option value="base64">Base64</option>
                    </select>
                    <button onClick={handleGenerate} className="flex-grow bg-cyan-600 hover:bg-cyan-700 p-2 rounded-md font-semibold">Generate Number</button>
                 </div>
                 {generatedNumber && (
                    <div className="p-3 bg-slate-900 rounded">
                        <h4 className="text-sm text-slate-300">Generated Output:</h4>
                        <p className="font-mono text-lg text-green-300 break-all">{generatedNumber}</p>
                    </div>
                 )}
            </div>

             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <h3 className="font-semibold">External API Hook</h3>
                <p className="text-xs text-slate-400 mb-2">Use the following Javascript in another web application to securely request entropy from this extension.</p>
                <pre className="text-xs bg-slate-900 p-2 rounded-md font-mono text-cyan-300 overflow-x-auto">
                    {`const channel = new BroadcastChannel('ghostveil_entropy_rng');

channel.onmessage = (event) => {
  if (event.data.type === 'response') {
    console.log('Received entropy:', event.data.payload.entropy);
  }
};

// Request 16 bytes of entropy in hex format
channel.postMessage({ 
  type: 'request', 
  payload: { type: 'GET_ENTROPY', bytes: 16 } 
});`}
                </pre>
            </div>

        </div>
    );
};

export default EntropyRngExtension;


import React, { useState, useEffect } from 'react';
import type { GhostVeilSdk } from '../ExtensionHost';
import { UsersIcon, ChipIcon } from '../icons';

interface BleMeshExtensionProps {
  sdk: GhostVeilSdk;
}

// Simulated Data
const simulatedDevices = [
    { id: 'ble_01', name: 'CardioMonitor_7B', rssi: -55 },
    { id: 'ble_02', name: 'NeuroLink-9', rssi: -68 },
    { id: 'ble_03', name: 'FitnessBand Pro', rssi: -82 },
    { id: 'ble_04', name: 'Unknown Device', rssi: -75 },
];

const simulatedGatt = {
    'ble_01': [
        { uuid: '180D', name: 'Heart Rate', characteristics: [{ uuid: '2A37', name: 'Heart Rate Measurement', props: ['NOTIFY'] }] },
        { uuid: '180F', name: 'Battery Service', characteristics: [{ uuid: '2A19', name: 'Battery Level', props: ['READ'] }] },
    ],
    'ble_02': [
        { uuid: 'A001', name: 'Neural Interface', characteristics: [{ uuid: 'B002', name: 'EEG Stream', props: ['NOTIFY'] }, { uuid: 'B003', name: 'Cognitive Score', props: ['READ', 'WRITE'] }] },
    ],
    'ble_03': [
        { uuid: '181A', name: 'Environmental Sensing', characteristics: [{ uuid: '2A6E', name: 'Temperature', props: ['READ'] }] },
    ],
    'ble_04': [],
};


const BleMeshExtension: React.FC<BleMeshExtensionProps> = ({ sdk }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [discovered, setDiscovered] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);

    const handleScan = () => {
        setIsScanning(true);
        setDiscovered([]);
        setSelected(null);
        sdk.addLog('BLE Mesh: Starting scan for nearby devices...', 'INFO');
        setTimeout(() => {
            setDiscovered(simulatedDevices);
            setIsScanning(false);
            sdk.addLog(`BLE Mesh: Scan complete. Found ${simulatedDevices.length} devices.`, 'INFO');
        }, 3000);
    };

    const handleRead = (char: any) => {
        const val = Math.floor(Math.random() * 100);
        sdk.addLog(`BLE Mesh: READ from ${char.name}: value = ${val}`, 'INFO');
        alert(`Simulated READ from ${char.name}: ${val}`);
    };
    
    const handleWrite = (char: any) => {
        const val = prompt(`Enter value to write to ${char.name}:`);
        if (val) {
            sdk.addLog(`BLE Mesh: WRITE to ${char.name}: value = ${val}`, 'INFO');
            alert(`Simulated WRITE "${val}" to ${char.name}.`);
        }
    };

    return (
        <div className="h-full flex flex-col md:flex-row bg-slate-900 text-white p-4 gap-4">
            {/* Left Panel: Devices */}
            <div className="md:w-1/3 flex flex-col gap-4">
                <button onClick={handleScan} disabled={isScanning} className="w-full bg-cyan-600 p-2 rounded-md font-semibold disabled:bg-slate-600">
                    {isScanning ? 'Scanning...' : 'Scan for BLE Devices'}
                </button>
                <div className="flex-grow bg-slate-800/50 p-2 rounded-lg border border-slate-700 overflow-y-auto">
                    {discovered.map(dev => (
                        <div key={dev.id} onClick={() => setSelected(dev)} className={`p-2 rounded-md cursor-pointer mb-2 ${selected?.id === dev.id ? 'bg-cyan-800' : 'bg-slate-700/50 hover:bg-slate-600'}`}>
                            <p className="font-semibold">{dev.name}</p>
                            <p className="text-xs text-slate-400">RSSI: {dev.rssi} dBm</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: GATT Attributes */}
            <div className="md:w-2/3 bg-slate-800/50 p-4 rounded-lg border border-slate-700 overflow-y-auto">
                <h3 className="text-lg font-bold flex items-center gap-2"><ChipIcon className="w-5 h-5" /> GATT Profile</h3>
                {!selected ? (
                    <p className="text-slate-400 text-center mt-8">Select a device to view its services.</p>
                ) : (
                    <div className="mt-4 space-y-3">
                        {simulatedGatt[selected.id].map((service: any) => (
                            <div key={service.uuid} className="bg-slate-900/50 p-3 rounded-lg">
                                <p className="font-semibold text-purple-300">{service.name} <span className="text-xs text-slate-500">(UUID: {service.uuid})</span></p>
                                <div className="pl-4 mt-2 space-y-2">
                                    {service.characteristics.map((char: any) => (
                                        <div key={char.uuid} className="bg-slate-800 p-2 rounded">
                                            <p className="text-cyan-300">{char.name} <span className="text-xs text-slate-500">({char.uuid})</span></p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-xs text-slate-400">Properties: {char.props.join(', ')}</p>
                                                <div className="flex gap-2">
                                                    {char.props.includes('READ') && <button onClick={() => handleRead(char)} className="text-xs bg-green-600 px-2 py-1 rounded">Read</button>}
                                                    {char.props.includes('WRITE') && <button onClick={() => handleWrite(char)} className="text-xs bg-blue-600 px-2 py-1 rounded">Write</button>}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                         {simulatedGatt[selected.id].length === 0 && <p className="text-slate-500 mt-4">No services discovered for this device.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BleMeshExtension;

# Ghost Veil Protocol: System Design & Extension SDK

**Version: 2.0 "Axiom"**

This document provides a comprehensive overview of the Ghost Veil Protocol's architecture, its Software Development Kit (SDK) for extensions, and a guide for developers looking to build on the platform.

---

## 1. Core Philosophy

Ghost Veil is designed as a modular, extensible framework for conceptual signal intelligence and cognitive security. The core application provides the foundational services for signal processing, threat analysis, and network communication. **Extensions** are the primary mechanism through which developers can add new capabilities, UIs, and integrations.

-   **Sandboxed Execution:** All extensions run in a sandboxed environment with a clearly defined set of permissions and API endpoints. They cannot access system resources or network functions outside of the provided SDK.
-   **Verifiable Ownership via NFTs:** Every extension submitted to the store is provisioned as an NFT on the Ghost Veil private ledger. This is handled by a smart contract written in **AxiomScript**, our proprietary scripting language. This guarantees verifiable ownership, transparent versioning, and enables a secure secondary market (future feature).
-   **Decentralized Economy:** The dual-token system (VLT for utility, AGT for governance) empowers a self-sustaining ecosystem where developers are rewarded for creating valuable tools and users are rewarded for contributing to the network's intelligence.

---

## 2. Extension Development Guide

Creating an extension for Ghost Veil is a straightforward process designed to let you focus on functionality.

### Step 1: Conceptualize Your Extension

What new capability will your extension bring to the protocol?
-   A new way to visualize signals?
-   A tool for analyzing a specific type of data?
-   Integration with an external (simulated) service?
-   A new countermeasure technique?

### Step 2: Build the UI

Extensions are React components. You have access to TailwindCSS and the icon library provided by the core application. Your component will receive a set of SDK functions and system state as props.

**Example `MyFirstExtension.tsx`:**
```tsx
import React from 'react';
// SDK props are passed by the Extension Host
import type { GhostVeilSdk } from '../sdk'; 
import { RadarIcon } from '../../components/icons';

// All extensions receive the SDK as props.
interface MyExtensionProps {
  sdk: GhostVeilSdk;
}

const MyFirstExtension: React.FC<MyExtensionProps> = ({ sdk }) => {
  const latestThreats = sdk.getThreats().slice(-5);

  const handleScan = () => {
    // Use the SDK to interact with the core system
    sdk.addLog("MyFirstExtension initiated a scan.", "INFO");
    sdk.startScan('ANOMALY_SCAN');
  };

  return (
    <div className="p-4 text-white">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <RadarIcon className="w-6 h-6" />
        My First Extension
      </h2>
      <p className="text-sm text-slate-400 my-2">
        This is a simple extension that uses the SDK to display threats and start scans.
      </p>
      <button 
        onClick={handleScan} 
        className="bg-cyan-600 p-2 rounded-md"
      >
        Start Anomaly Scan
      </button>

      <h3 className="font-bold mt-4">Latest Threats:</h3>
      <div className="font-mono text-xs space-y-1 mt-2">
        {latestThreats.length > 0 ? latestThreats.map(t => (
          <p key={t.id}>{t.type}</p>
        )) : <p>No threats detected.</p>}
      </div>
    </div>
  );
};

export default MyFirstExtension;
```

### Step 3: Submission via Developer Portal

1.  Navigate to the **System** view and open the **Developer** tab.
2.  Go to the **Submit Extension** section.
3.  Fill in the details: Name, Version, Description, Pricing Model, and Icon. The icon must be a valid component name from `components/icons.tsx`.
4.  Click "Submit for Validation".

The system will simulate code analysis, parse required SDK endpoints, and if it passes, deploy the AxiomScript contract and list your extension in the store.

### Step 4: Monetization

-   **Free:** Offer your extension for free to build reputation and contribute to the community.
-   **Fixed Price (VLT):** Set a one-time purchase price in Veil Tokens (VLT). When a user buys your extension, you receive 60% of the sale price directly in your developer wallet. The remaining 40% is split between the system treasury (10%) and network rewards (30%).

---

## 3. Ghost Veil SDK Reference

The SDK is passed as a single `sdk` prop to your extension component.

### `sdk.getSystemState()`
Returns a snapshot of the current system state.
-   **Returns:** `object`
-   **Properties:**
    -   `signals: Signal[]`
    -   `threats: Threat[]`
    -   `isMonitoring: boolean`
    -   `isProtected: boolean`
    -   `p2pNodes: P2PNode[]`
    -   `wallet: Wallet | null`
-   **Usage:** `const { threats } = sdk.getSystemState();`

### `sdk.startScan()`
Initiates a signal scan.
-   **Parameters:** `mode: ScanMode`
-   **Returns:** `void`
-   **Usage:** `sdk.startScan('WIDEBAND_SWEEP');`

### `sdk.stopScan()`
Stops the current signal scan.
-   **Returns:** `void`
-   **Usage:** `sdk.stopScan();`

### `sdk.activateVeil()`
Activates Ghost Veil protection.
-   **Parameters:** `strategy: ProtectionStrategy`
-   **Returns:** `void`
-   **Usage:** `sdk.activateVeil('QUANTUM_NOISE');`

### `sdk.deactivateVeil()`
Deactivates Ghost Veil protection.
-   **Returns:** `void`
-   **Usage:** `sdk.deactivateVeil();`

### `sdk.addLog()`
Adds a message to the main system console.
-   **Parameters:**
    -   `message: string`: The log message.
    -   `type: LogType`: ('SYSTEM', 'AI', 'NETWORK', 'WARN', 'ERROR', 'INFO')
-   **Returns:** `void`
-   **Usage:** `sdk.addLog('Extension started successfully.', 'INFO');`

### `sdk.createApiHook()`
Exposes a secure, dynamic API for external web applications. This allows your extension to provide services to other browser tabs or applications.
-   **How it works:** It creates a `BroadcastChannel`. Your extension listens for `request` messages on this channel and can post `response` messages back. The user must grant permission for each external origin that attempts to connect.
-   **Parameters:** `channelName: string, callback: (data: any) => any`
-   **Returns:** `() => void` (a function to close the channel)
-   **Usage (in extension):**
    ```javascript
    useEffect(() => {
      const entropyProvider = (data) => {
        if (data.type === 'GET_ENTROPY') {
          // Your logic to generate a random number
          const randomNumber = Math.random();
          return { entropy: randomNumber };
        }
      };
      
      const closeHook = sdk.createApiHook('entropy_rng_channel', entropyProvider);
      
      // Cleanup on component unmount
      return () => closeHook();
    }, []);
    ```
-   **Usage (in external app):**
    ```javascript
    const channel = new BroadcastChannel('entropy_rng_channel');

    function getEntropy() {
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject('Timeout'), 2000);
        
        channel.onmessage = (event) => {
          if (event.data.type === 'response') {
            clearTimeout(timeout);
            resolve(event.data.payload);
            channel.onmessage = null; // Clean up listener
          }
        };

        channel.postMessage({ type: 'request', payload: { type: 'GET_ENTROPY' } });
      });
    }

    // Later...
    const data = await getEntropy();
    console.log('Received entropy:', data.entropy);
    ```

---

## 4. Default Extensions

Ghost Veil comes with three powerful default extensions.

### A. SDR++ Advanced
A professional-grade interface for deep spectrum analysis, providing more granular control and visualization than the main dashboard widget.
-   **Features:**
    -   Detailed waterfall with zoom and pan.
    -   Simulated demodulation controls (NFM, AM, USB, LSB).
    -   Bandwidth adjustment.
    -   Simulated I/Q recording.

### B. BLE Mesh Manager
A tool for discovering and interacting with local (simulated) Bluetooth Low Energy devices.
-   **Features:**
    -   Scan for nearby BLE devices.
    -   View device details, including signal strength (RSSI).
    -   Inspect the GATT (Generic Attribute Profile) table.
    -   Browse Services and Characteristics.
    -   Simulate Read/Write operations on characteristics.

### C. Signal Entropy RNG
A utility that leverages the inherent randomness of the electromagnetic spectrum to provide a high-quality source of entropy for cryptographic purposes.
-   **Features:**
    -   Visualizes the entropy pool being filled by signal noise.
    -   Generates random numbers in various formats (Hex, Integer, Base64).
    -   Exposes its random number generation capability as a secure API hook for external applications using `sdk.createApiHook()`.

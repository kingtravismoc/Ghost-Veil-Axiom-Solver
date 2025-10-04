import type { Signal, ScanMode } from '../types';

const MODULATION_TYPES = ['AM', 'FM', 'PULSE', 'FSK', 'QAM'] as const;

export const sdrDevilService = {
  connect: async (): Promise<boolean> => {
    // Simulate connection to a backend node
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.1; // 90% chance of success
  },

  generateSignals: (scanMode: ScanMode): Signal[] => {
    let signalCount = 3 + Math.random() * 4;
    let amplitudeRange = { min: 20, max: 80 };
    let snrRange = { min: 5, max: 45 };
    let freqRange = { min: 20e3, max: 5.8e9 };
    // FIX: Add exotic modulations for more interesting scans.
    const exoticModulations = ['MAGNETIC_PULSE', 'BIO_OPTICAL', 'SONAR_PING', 'UV_BEAM', 'PLASMA_WAVE'];


    switch (scanMode) {
      case 'ANOMALY_SCAN':
        // Fewer signals, but higher chance of being "significant" and unusual modulation
        signalCount = 1 + Math.random() * 2;
        amplitudeRange = { min: 65, max: 95 };
        snrRange = { min: 25, max: 50 };
        break;
      case 'PASSIVE_INTERCEPT':
        // Lower amplitude, more noise, potentially more signals
        signalCount = 5 + Math.random() * 10;
        amplitudeRange = { min: 10, max: 50 };
        snrRange = { min: 2, max: 20 };
        break;
      case 'WIDEBAND_SWEEP':
      default:
        // Default behavior, wide range of frequencies
        break;
    }

    return Array.from({ length: Math.floor(signalCount) }, () => {
        const freq = freqRange.min + Math.random() * (freqRange.max - freqRange.min);
        // FIX: Introduce a chance for exotic modulation types, especially in anomaly scans.
        const modulation = (scanMode === 'ANOMALY_SCAN' && Math.random() > 0.6) || (Math.random() > 0.9)
            ? exoticModulations[Math.floor(Math.random() * exoticModulations.length)]
            : MODULATION_TYPES[Math.floor(Math.random() * MODULATION_TYPES.length)];

        return {
            timestamp: Date.now(),
            frequency: freq,
            amplitude: amplitudeRange.min + Math.random() * (amplitudeRange.max - amplitudeRange.min),
            modulation: modulation,
            phase: Math.random() * 360,
            snr: snrRange.min + Math.random() * (snrRange.max - snrRange.min),
            bandwidth: 1e3 + Math.random() * 50e3,
            id: `sig_${Date.now()}_${Math.random()}`
        };
    });
  },
};

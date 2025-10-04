
import type { Signal } from '../types';

const randomEnum = <T,>(anEnum: T): T[keyof T] => {
  const enumValues = Object.keys(anEnum as object)
    .map(n => parseInt(n, 10))
    .filter(n => !isNaN(n)) as unknown as T[keyof T][];
  const randomIndex = Math.floor(Math.random() * enumValues.length);
  return enumValues[randomIndex];
};

const MODULATION_TYPES = ['AM', 'FM', 'PULSE', 'FSK', 'QAM'] as const;

export const generateSignals = (): Signal[] => {
    return Array.from({ length: Math.floor(2 + Math.random() * 5) }, () => {
        const isHighFreq = Math.random() > 0.7;
        const baseFreq = isHighFreq ? 800e6 + Math.random() * 5e9 : 20e3 + Math.random() * 100e3;
        
        return {
            timestamp: Date.now(),
            frequency: baseFreq + (Math.random() - 0.5) * 1e3,
            amplitude: 20 + Math.random() * 80,
            modulation: MODULATION_TYPES[Math.floor(Math.random() * MODULATION_TYPES.length)],
            phase: Math.random() * 360,
            snr: 5 + Math.random() * 45,
            bandwidth: 1e3 + Math.random() * 50e3,
            id: `sig_${Date.now()}_${Math.random()}`
        };
    });
};

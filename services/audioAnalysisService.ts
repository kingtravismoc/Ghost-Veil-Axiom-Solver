import type { AudioThreat } from '../types';

interface AudioAnalysis {
    ambientNoiseLevel: number;
    newThreats: Omit<AudioThreat, 'id' | 'timestamp'>[];
}

class AudioAnalysisService {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private stream: MediaStream | null = null;
    private dataArray: Uint8Array | null = null;
    private lastThreatTime: number = 0;
    private threatCooldown: number = 5000; // 5 seconds

    public async start(): Promise<boolean> {
        if (this.audioContext) return true;
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaStreamSource(this.stream);
            
            source.connect(this.analyser);
            this.analyser.fftSize = 256;
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            return true;
        } catch (err) {
            console.error("Error accessing microphone:", err);
            return false;
        }
    }

    public stop() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        this.audioContext = null;
        this.stream = null;
        this.analyser = null;
    }

    public getAnalysis(): AudioAnalysis | null {
        if (!this.analyser || !this.dataArray) return null;

        this.analyser.getByteFrequencyData(this.dataArray);

        const total = this.dataArray.reduce((sum, value) => sum + value, 0);
        const average = total / this.dataArray.length;
        
        const ambientNoiseLevel = (average / 255) * 100;

        const newThreats: Omit<AudioThreat, 'id' | 'timestamp'>[] = [];

        // Simple threat simulation based on volume spikes
        const currentTime = Date.now();
        if (ambientNoiseLevel > 40 && (currentTime - this.lastThreatTime > this.threatCooldown)) {
            const random = Math.random();
            if (random < 0.6) {
                newThreats.push({
                    type: 'SPEECH_PATTERN',
                    description: 'Unidentified vocal signature detected.',
                    confidence: 0.8 + Math.random() * 0.15
                });
            } else {
                 newThreats.push({
                    type: 'ACOUSTIC_LEAKAGE',
                    description: 'High-frequency resonance indicative of device leakage.',
                    confidence: 0.75 + Math.random() * 0.2
                });
            }
            this.lastThreatTime = currentTime;
        } else if (ambientNoiseLevel > 65 && (currentTime - this.lastThreatTime > this.threatCooldown * 1.5)) {
             newThreats.push({
                type: 'NEURAL_RESONANCE',
                description: 'Sub-harmonic VLF wave consistent with cognitive interface.',
                confidence: 0.9 + Math.random() * 0.09
            });
            this.lastThreatTime = currentTime;
        }


        return { ambientNoiseLevel, newThreats };
    }
}

export const audioAnalysisService = new AudioAnalysisService();

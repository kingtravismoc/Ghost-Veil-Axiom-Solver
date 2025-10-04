

import React, { useRef, useEffect } from 'react';
import type { Signal as AppSignal, ScanMode } from '../types';

interface SpectrumAnalyzerProps {
  signals: AppSignal[];
  scanMode: ScanMode | 'off';
  className?: string;
  activePeers: number;
  isSummaryView?: boolean;
}

// Internal display-focused signal type
type DisplaySignal = {
  id: string;
  frequency: string;
  type: string;
  threat: 'low' | 'medium' | 'high' | 'extreme';
  description: string;
  timestamp: number;
};

// Mapper function to convert application signal to display signal
const mapSignalToDisplaySignal = (signal: AppSignal): DisplaySignal => {
    let threat: DisplaySignal['threat'] = 'low';
    if (signal.amplitude > 75) threat = 'medium';
    if (signal.amplitude > 88 && signal.snr > 38) threat = 'high';
    // FIX: Add optional chaining to .includes() to prevent runtime error if classification is undefined.
    if (signal.classification?.toLowerCase()?.includes('resonance') || signal.classification?.toLowerCase()?.includes('cognitive')) threat = 'extreme';

    return {
        id: signal.id,
        frequency: `${(signal.frequency / 1e6).toFixed(2)} MHz`,
        type: signal.classification || signal.modulation,
        threat: threat,
        description: signal.summary || `SNR: ${signal.snr.toFixed(1)} dB | Amp: ${signal.amplitude.toFixed(1)}`,
        timestamp: signal.timestamp,
    };
};


export const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  signals,
  scanMode = 'off',
  className = '',
  activePeers = 0,
  isSummaryView = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>();

  // FIX: Reordered chained methods to call reverse() before map(), resolving an argument error. This pattern is consistent with other working components.
  const detectedSignals = signals.slice(-10).reverse().map(mapSignalToDisplaySignal);
  const isScanning = scanMode !== 'off';
  const canvasHeight = isSummaryView ? 120 : 300;


  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const updateCanvasSize = () => {
      if (canvas.parentElement) {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = canvasHeight;
      }
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    const colorMap = Array.from({ length: 256 }, (_, i) => {
        const intensity = i / 255;
        if (intensity < 0.05) return [0, 0, 0, 0];
        const hue = 250 - intensity * 80;
        const saturation = 90 + intensity * 10;
        const lightness = 15 + intensity * 50;
        
        const s = saturation / 100, l = lightness / 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
        const m = l - c / 2;
        let r=0, g=0, b=0;
        if (hue >= 0 && hue < 60) { [r,g,b] = [c,x,0]; }
        else if (hue >= 60 && hue < 120) { [r,g,b] = [x,c,0]; }
        else if (hue >= 120 && hue < 180) { [r,g,b] = [0,c,x]; }
        else if (hue >= 180 && hue < 240) { [r,g,b] = [0,x,c]; }
        else if (hue >= 240 && hue < 300) { [r,g,b] = [x,0,c]; }
        else { [r,g,b] = [c,0,x]; }
        return [(r+m)*255, (g+m)*255, (b+m)*255, 255];
    });


    const drawSpectrum = () => {
      // Scroll the existing canvas image down by one pixel
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height - 1, 0, 1, canvas.width, canvas.height - 1);

      const topRowImageData = ctx.createImageData(canvas.width, 1);
      const data = topRowImageData.data;

      for (let x = 0; x < canvas.width; x++) {
        const frequency = (x / canvas.width) * 6000;
        let intensity = Math.random() * 0.25;

        if (scanMode === 'WIDEBAND_SWEEP' && Math.random() > 0.995) intensity = 0.5 + Math.random() * 0.5;
        if (scanMode === 'ANOMALY_SCAN' && Math.random() > 0.998) intensity = 0.8 + Math.random() * 0.2;
        
        if ((frequency > 2400 && frequency < 2500) || (frequency > 5100 && frequency < 5800)) {
          intensity += 0.3 + Math.sin(Date.now() / 400 + x / 20) * 0.15;
        }

        const colorIndex = Math.min(255, Math.floor(intensity * 255));
        const color = colorMap[colorIndex];
        const pixelIndex = x * 4;
        data[pixelIndex] = color[0]; data[pixelIndex + 1] = color[1]; data[pixelIndex + 2] = color[2]; data[pixelIndex + 3] = color[3];
      }
      ctx.putImageData(topRowImageData, 0, 0);

      // --- K-TMOC Tag Rendering ---
      if (activePeers > 0) {
          const tagFrequency = 4500; // in MHz
          const tagX = (tagFrequency / 6000) * canvas.width;
          ctx.fillStyle = 'rgba(0, 255, 255, 0.08)';
          ctx.font = 'bold 10px monospace';
          ctx.save();
          ctx.translate(tagX, 0);
          for (let i = 0; i < activePeers; i++) {
              const yPos = ( (Date.now() / 20 + i * 50) % canvasHeight );
              ctx.fillText('K-TMOC', 0, yPos);
          }
          ctx.restore();
      }

      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.lineWidth = 0.5;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';

      for (let i = 0; i <= 6; i++) {
        const x = (i / 6) * canvas.width;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvasHeight); ctx.stroke();
        if(!isSummaryView) {
            ctx.fillText(`${i}GHz`, x + 5, canvasHeight - 5);
        }
      }

      if (isScanning) {
        const scanLineY = (Date.now() % 4000) / 4000 * canvasHeight;
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(0, scanLineY); ctx.lineTo(canvas.width, scanLineY);
        ctx.shadowBlur = 8; ctx.shadowColor = '#06b6d4';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(drawSpectrum);
    };

    drawSpectrum();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [scanMode, isScanning, activePeers, canvasHeight, isSummaryView]);

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'extreme': return '#be185d';
      default: return '#22c55e';
    }
  };

  return (
    <div className={`spectrum-analyzer ${className} ${isSummaryView ? 'summary' : ''}`}>
      <style>{`
        .spectrum-analyzer { background: rgba(15, 23, 42, 0.3); border-bottom: 1px solid #334155; padding: 20px; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; display: flex; gap: 20px; height: 100%; }
        .spectrum-analyzer.summary { padding: 0; border-bottom: none; }
        .analyzer-main { flex: 3; display: flex; flex-direction: column; min-width: 0; }
        .spectrum-analyzer.summary .analyzer-main { flex: 1; }
        .analyzer-sidebar { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .analyzer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .spectrum-analyzer.summary .analyzer-header { display: none; }
        .analyzer-title { font-size: 18px; color: #67e8f9; text-transform: uppercase; letter-spacing: 2px; font-weight: 600; }
        .scan-status { display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 12px; }
        .status-indicator { width: 10px; height: 10px; border-radius: 50%; animation: pulse 1.5s infinite ease-in-out; }
        .status-indicator.active { background: #22d3ee; box-shadow: 0 0 10px #22d3ee; }
        .status-indicator.inactive { background: #334155; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.9); } }
        .spectrum-canvas { width: 100%; height: ${canvasHeight}px; border: 1px solid #334155; background: #020617; border-radius: 4px; }
        .spectrum-analyzer.summary .spectrum-canvas { border: none; border-radius: 0; }
        .signal-list { flex-grow: 1; overflow-y: auto; background: rgba(30, 41, 59, 0.5); padding: 10px; border-radius: 4px; border: 1px solid #334155; }
        .signal-list-title { color: #cbd5e1; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; font-weight: 600; }
        .signal-item { padding: 8px; margin-bottom: 5px; background: rgba(51, 65, 85, 0.3); border-left: 3px solid; transition: all 0.2s; cursor: pointer; display: flex; justify-content: space-between; align-items: center; border-radius: 2px; }
        .signal-item:hover { background: rgba(51, 65, 85, 0.7); transform: translateX(5px); }
        .signal-info { flex: 1; min-width: 0; }
        .signal-freq { color: #e2e8f0; font-weight: bold; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .signal-desc { font-size: 11px; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .threat-indicator { width: 12px; height: 12px; border-radius: 50%; animation: blink 1.2s infinite ease-in-out; flex-shrink: 0; margin-left: 10px; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
        .no-signals { color: #94a3b8; text-align: center; padding: 20px; font-style: italic; }
        .signal-list::-webkit-scrollbar { width: 8px; }
        .signal-list::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.5); }
        .signal-list::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        .signal-list::-webkit-scrollbar-thumb:hover { background: #64748b; }
      `}</style>
      <div className="analyzer-main">
        <div className="analyzer-header">
            <div className="analyzer-title">Live Spectrum</div>
            <div className="scan-status">
            <div className={`status-indicator ${isScanning ? 'active' : 'inactive'}`}></div>
            <span>{isScanning ? `${scanMode.toUpperCase().replace('_', ' ')} SCAN` : 'IDLE'}</span>
            </div>
        </div>
        <canvas ref={canvasRef} className="spectrum-canvas" />
      </div>
      {!isSummaryView && (
      <div className="analyzer-sidebar">
        <div className="signal-list">
            <div className="signal-list-title">Recent Signals</div>
            {detectedSignals.length > 0 ? (
            detectedSignals.map((signal) => (
                <div
                key={signal.id}
                className="signal-item"
                style={{ borderLeftColor: getThreatColor(signal.threat) }}
                >
                <div className="signal-info">
                    <div className="signal-freq" title={`${signal.frequency} - ${signal.type}`}>{signal.frequency} - {signal.type}</div>
                    <div className="signal-desc" title={signal.description}>{signal.description}</div>
                </div>
                <div
                    className="threat-indicator"
                    style={{ backgroundColor: getThreatColor(signal.threat) }}
                    title={`Threat level: ${signal.threat}`}
                ></div>
                </div>
            ))
            ) : (
            <div className="no-signals">No significant signals detected.</div>
            )}
        </div>
      </div>
      )}
    </div>
  );
};

export default SpectrumAnalyzer;
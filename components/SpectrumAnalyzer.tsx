
import React, { useRef, useEffect } from 'react';
import type { Signal as AppSignal, ScanMode } from '../types';

interface SpectrumAnalyzerProps {
  signals: AppSignal[];
  scanMode: ScanMode | 'off';
  className?: string;
  activePeers: number;
  isSummaryView?: boolean;
  onSignalSelect: (signal: AppSignal) => void;
  selectedSignal: AppSignal | null;
}

const MAX_FREQ = 6e9; // 6 GHz

export const SpectrumAnalyzer: React.FC<SpectrumAnalyzerProps> = ({
  signals,
  scanMode = 'off',
  className = '',
  activePeers = 0,
  isSummaryView = false,
  onSignalSelect,
  selectedSignal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>();

  const isScanning = scanMode !== 'off';
  const canvasHeight = isSummaryView ? 120 : 300;

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isSummaryView || signals.length === 0) return;
    
    const canvas = event.currentTarget;
    // FIX: Using getBoundingClientRect for robust click coordinate calculation.
    // The previous implementation with event.nativeEvent.offsetX may have caused issues.
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickedFreq = (x / canvas.width) * MAX_FREQ;

    // Find the closest signal to the click
    let closestSignal: AppSignal | null = null;
    let minDistance = Infinity;

    signals.forEach(signal => {
        const distance = Math.abs(signal.frequency - clickedFreq);
        if (distance < minDistance) {
            minDistance = distance;
            closestSignal = signal;
        }
    });
    
    // Select if it's reasonably close
    if (closestSignal && minDistance < (MAX_FREQ / canvas.width) * 10) { // Within 10 pixels
        onSignalSelect(closestSignal);
    }
  };


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
      ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height - 1, 0, 1, canvas.width, canvas.height - 1);

      const topRowImageData = ctx.createImageData(canvas.width, 1);
      const data = topRowImageData.data;

      for (let x = 0; x < canvas.width; x++) {
        const frequency = (x / canvas.width) * MAX_FREQ;
        let intensity = Math.random() * 0.25;

        if (scanMode === 'WIDEBAND_SWEEP' && Math.random() > 0.995) intensity = 0.5 + Math.random() * 0.5;
        if (scanMode === 'ANOMALY_SCAN' && Math.random() > 0.998) intensity = 0.8 + Math.random() * 0.2;
        
        if ((frequency > 2.4e9 && frequency < 2.5e9) || (frequency > 5.1e9 && frequency < 5.8e9)) {
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
          const tagFrequency = 4.5e9;
          const tagX = (tagFrequency / MAX_FREQ) * canvas.width;
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
      
      // Draw selected signal tuner line
      if (selectedSignal && !isSummaryView) {
        const x = (selectedSignal.frequency / MAX_FREQ) * canvas.width;
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x - 40, 0, 80, 18);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${(selectedSignal.frequency / 1e6).toFixed(2)} MHz`, x, 13);
        ctx.textAlign = 'start';
      }

      animationRef.current = requestAnimationFrame(drawSpectrum);
    };

    drawSpectrum();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [scanMode, isScanning, activePeers, canvasHeight, isSummaryView, selectedSignal]);

  const containerClass = `h-full flex flex-col ${className}`;
  const canvasClass = `w-full h-full border border-slate-700 bg-slate-900 ${!isSummaryView ? 'rounded-lg cursor-pointer' : ''}`;

  return (
    <div className={containerClass}>
      <canvas ref={canvasRef} className={canvasClass} onClick={handleCanvasClick} />
    </div>
  );
};

export default SpectrumAnalyzer;

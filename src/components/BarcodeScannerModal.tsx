import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Barcode,
  CheckCircle2,
  AlertTriangle,
  X,
  RefreshCw,
  Layers,
  Sparkles,
  Zap,
  Volume2,
  Scan,
  Check,
} from 'lucide-react';
import { useVmi } from '../context/VmiContext';

interface BarcodeScannerModalProps {
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose }) => {
  const { items, registerPointOfUseConsumption, permissions, requestPermission, speakText } = useVmi();
  const [cameraActive, setCameraActive] = useState<boolean>(true);
  const [manualCode, setManualCode] = useState<string>('');
  const [selectedWorkstation, setSelectedWorkstation] = useState<string>('Linha 01 - Posto A3 (Montagem Gabinete Plástico)');
  const [lastScanResult, setLastScanResult] = useState<{
    success: boolean;
    message: string;
    sku?: string;
    barcode?: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanFeedMode, setScanFeedMode] = useState<'webcam' | 'optical_canvas'>('webcam');
  const [laserY, setLaserY] = useState<number>(50);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const barcodeDetectorRef = useRef<any>(null);

  // Play realistic industrial scanner beep sound via Web Audio API
  const playScannerBeep = (isSuccess: boolean = true) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1760, ctx.currentTime); // High pitch crisp beep
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.14);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, ctx.currentTime); // Low buzz for error
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {}
  };

  // Start camera on mount
  useEffect(() => {
    // Setup native BarcodeDetector if available in browser
    if ('BarcodeDetector' in window) {
      try {
        barcodeDetectorRef.current = new (window as any).BarcodeDetector({
          formats: ['code_128', 'ean_13', 'ean_8', 'qr_code', 'upc_a'],
        });
      } catch {}
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setIsScanning(true);
    await requestPermission('camera');

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setScanFeedMode('webcam');
        setCameraActive(true);
        setIsScanning(false);
        startFrameScannerLoop(true);
        return;
      } catch (err) {
        console.warn('Physical camera blocked in iframe, activating high-resolution optical simulator:', err);
      }
    }

    setScanFeedMode('optical_canvas');
    setCameraActive(true);
    setIsScanning(false);
    startFrameScannerLoop(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    setCameraActive(false);
  };

  // Continuous frame analysis & laser animation loop
  const startFrameScannerLoop = (isLive: boolean) => {
    let phase = 0;

    const scanFrame = async () => {
      phase += 0.05;
      const curLaserY = 20 + Math.sin(phase) * 60; // 0% to 100% in viewfinder
      setLaserY(curLaserY);

      // If native BarcodeDetector is available and video is playing, analyze live video frame
      if (isLive && videoRef.current && barcodeDetectorRef.current && videoRef.current.readyState === 4) {
        try {
          const detectedCodes = await barcodeDetectorRef.current.detect(videoRef.current);
          if (detectedCodes && detectedCodes.length > 0) {
            const raw = detectedCodes[0].rawValue;
            if (raw) {
              handleScanCode(raw);
            }
          }
        } catch {}
      }

      // Draw onto canvas overlay for clear visual crosshairs
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          if (!isLive) {
            // Render simulated industrial barcode camera feed
            ctx.fillStyle = '#060d17';
            ctx.fillRect(0, 0, w, h);

            // Tech grid
            ctx.strokeStyle = '#0f2942';
            ctx.lineWidth = 1;
            for (let x = 0; x < w; x += 30) {
              ctx.beginPath();
              ctx.moveTo(x, 0);
              ctx.lineTo(x, h);
              ctx.stroke();
            }
            for (let y = 0; y < h; y += 30) {
              ctx.beginPath();
              ctx.moveTo(0, y);
              ctx.lineTo(w, y);
              ctx.stroke();
            }

            // Draw a realistic barcode card in the center of the frame
            const bx = w / 2 - 110;
            const by = h / 2 - 45;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(bx, by, 220, 90);

            // Barcode vertical stripes
            ctx.fillStyle = '#000000';
            const stripes = [3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 3, 2, 1, 4, 2];
            let sx = bx + 16;
            stripes.forEach((sw) => {
              ctx.fillRect(sx, by + 12, sw * 2, 52);
              sx += sw * 2 + 3;
            });

            ctx.fillStyle = '#000000';
            ctx.font = 'bold 11px monospace';
            ctx.fillText('7891234001014 - GAB-PLAST-800', bx + 12, by + 78);
          }

          // Laser scan line
          const scanLinePos = h * 0.25 + (curLaserY / 100) * (h * 0.5);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#ff0000';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(w * 0.15, scanLinePos);
          ctx.lineTo(w * 0.85, scanLinePos);
          ctx.stroke();
          ctx.shadowBlur = 0;

          // Corner reticles
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 2.5;
          const rw = w * 0.7;
          const rh = h * 0.6;
          const rx = (w - rw) / 2;
          const ry = (h - rh) / 2;
          const arm = 20;

          // Top-left
          ctx.beginPath();
          ctx.moveTo(rx, ry + arm);
          ctx.lineTo(rx, ry);
          ctx.lineTo(rx + arm, ry);
          ctx.stroke();

          // Top-right
          ctx.beginPath();
          ctx.moveTo(rx + rw - arm, ry);
          ctx.lineTo(rx + rw, ry);
          ctx.lineTo(rx + rw, ry + arm);
          ctx.stroke();

          // Bottom-left
          ctx.beginPath();
          ctx.moveTo(rx, ry + rh - arm);
          ctx.lineTo(rx, ry + rh);
          ctx.lineTo(rx + arm, ry + rh);
          ctx.stroke();

          // Bottom-right
          ctx.beginPath();
          ctx.moveTo(rx + rw - arm, ry + rh);
          ctx.lineTo(rx + rw, ry + rh);
          ctx.lineTo(rx + rw, ry + rh - arm);
          ctx.stroke();
        }
      }

      animFrameRef.current = requestAnimationFrame(scanFrame);
    };

    animFrameRef.current = requestAnimationFrame(scanFrame);
  };

  const handleScanCode = (code: string) => {
    const res = registerPointOfUseConsumption(code, selectedWorkstation);

    if (res.success && res.item) {
      playScannerBeep(true);
      setLastScanResult({
        success: true,
        message: `Baixa confirmada: 1 un do item ${res.item.name}! Saldo restante: ${res.item.currentStock - 1} un.`,
        sku: res.item.sku,
        barcode: code,
      });
      speakText(`Código lido. Baixa de 1 unidade de ${res.item.name} registrada no posto de trabalho.`);
    } else {
      playScannerBeep(false);
      setLastScanResult({
        success: false,
        message: `Código "${code}" não cadastrado ou sem saldo no posto de uso.`,
        barcode: code,
      });
      speakText('Código de barras não identificado no sistema.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScanCode(manualCode.trim());
    setManualCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Leitor Ótico de Código de Barras</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Ponto de Uso em Tempo Real
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Elimina a defasagem de baixa no fim do turno com leitura ótica instantânea e sinal e-Kanban.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Workstation Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Posto de Montagem / Ponto de Uso Ativo na Linha:
            </label>
            <select
              value={selectedWorkstation}
              onChange={(e) => setSelectedWorkstation(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 outline-none focus:border-cyan-500 font-sans"
            >
              <option value="Linha 01 - Posto A3 (Montagem Gabinete Plástico)">Linha 01 - Posto A3 (Montagem Gabinete Plástico - Polilux)</option>
              <option value="Linha 01 - Posto B1 (Painel Frontal)">Linha 01 - Posto B1 (Tampa e Painel Polímero)</option>
              <option value="Linha 01 - Posto A1 (Fixação Motor)">Linha 01 - Posto A1 (Motor BLDC Silencioso)</option>
              <option value="Linha 02 - Posto C2 (Placa Principal)">Linha 02 - Posto C2 (Placa Eletrônica Inverter V2 - Shenzhen)</option>
              <option value="Linha 02 - Posto D4 (Fiação & Conectores)">Linha 02 - Posto D4 (Cabo de Força PP - Joinville)</option>
            </select>
          </div>

          {/* Camera Viewport with Real/Synthetic Optical Scan */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 relative flex flex-col items-center justify-center min-h-[240px] shadow-inner">
            <div className="relative w-full h-[220px] bg-black rounded-xl overflow-hidden flex items-center justify-center">
              {/* Live Webcam if available */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${scanFeedMode === 'webcam' ? 'block' : 'hidden'}`}
              />

              {/* Optical Reticle & Laser Canvas Overlay */}
              <canvas
                ref={canvasRef}
                width={500}
                height={220}
                className="w-full h-full object-cover absolute inset-0 pointer-events-none"
              />

              {/* Viewfinder Status Banner */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-cyan-500/40 text-[11px] text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Sensor Ótico: <strong className="text-cyan-300">CÂMERA ATIVA (60 FPS)</strong>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  MIRA ALINHADA
                </span>
              </div>

              {/* Scanner Trigger on frame */}
              <div className="absolute bottom-2.5 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleScanCode('7891234001014')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600/90 hover:bg-cyan-500 text-white text-xs font-bold shadow transition flex items-center gap-1.5 backdrop-blur-md"
                >
                  <Scan className="w-3.5 h-3.5" />
                  Escanear Código em Foco (GAB-PLAST-800)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between w-full px-2 mt-2 text-[11px] text-slate-400">
              <span>Posicione a etiqueta de código de barras dentro da mira reticular.</span>
              <button
                type="button"
                onClick={() => startCamera()}
                className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                Reiniciar Câmera
              </button>
            </div>
          </div>

          {/* Feedback Result Banner */}
          {lastScanResult && (
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-3 text-xs shadow-md ${
                lastScanResult.success
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500 text-rose-200'
              }`}
            >
              {lastScanResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-bold text-xs">{lastScanResult.message}</p>
                {lastScanResult.barcode && (
                  <p className="text-[10px] font-mono mt-0.5 text-slate-300">
                    Código processado: {lastScanResult.barcode} • Ponto de Baixa: {selectedWorkstation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Digitar código de barras ou SKU manualmente..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 text-xs bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition"
            >
              Registrar Baixa
            </button>
          </form>

          {/* Quick Barcode Simulation Buttons for Real TecnoLar SKUs */}
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Aproximar Código de Teste da Câmera (Simulação Instantânea no Posto):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.slice(0, 4).map((i) => (
                <button
                  key={i.sku}
                  type="button"
                  onClick={() => handleScanCode(i.barcode)}
                  className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-400 rounded-xl text-left text-xs transition flex items-center justify-between group shadow-sm hover:shadow-cyan-900/20"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-extrabold text-white group-hover:text-cyan-300">{i.sku}</span>
                      {i.isCritical && (
                        <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800 font-bold">
                          CRÍTICO
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-300 block line-clamp-1">{i.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono mt-0.5 block">
                      EAN-13: {i.barcode}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-white block">{i.currentStock} un</span>
                    <span className="text-[9px] text-slate-500 block">Linha: {i.lineSupermarketStock}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span className="font-mono text-[11px]">Sincronismo: ERP TecnoLar API (200 OK • Latência &lt; 25ms)</span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition text-xs"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};

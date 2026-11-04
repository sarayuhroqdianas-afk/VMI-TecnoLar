import React, { useState, useRef } from 'react';
import { Camera, Barcode, CheckCircle2, AlertTriangle, X, RefreshCw, Layers } from 'lucide-react';
import { useVmi } from '../context/VmiContext';

interface BarcodeScannerModalProps {
  onClose: () => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({ onClose }) => {
  const { items, registerPointOfUseConsumption, permissions, requestPermission, speakText } = useVmi();
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const [selectedWorkstation, setSelectedWorkstation] = useState<string>('Linha 01 - Posto A3 (Montagem Estrutural)');
  const [lastScanResult, setLastScanResult] = useState<{ success: boolean; message: string; sku?: string } | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startCamera = async () => {
    setIsScanning(true);
    await requestPermission('camera');
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } catch {
        setCameraActive(true);
      }
    } else {
      setCameraActive(true);
    }
    setIsScanning(false);
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleScanCode = (code: string) => {
    const res = registerPointOfUseConsumption(code, selectedWorkstation);
    if (res.success && res.item) {
      setLastScanResult({
        success: true,
        message: `Baixa instantânea de 1 un confirmada! Saldo atualizado para ${res.item.currentStock - 1} un.`,
        sku: res.item.sku,
      });
      speakText(`Baixa de 1 unidade do item ${res.item.name} registrada no posto de trabalho.`);
    } else {
      setLastScanResult({
        success: false,
        message: res.message,
      });
      speakText('Código não identificado no estoque.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleScanCode(manualCode.trim());
    setManualCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Leitor Ótico & Baixa no Ponto de Uso</h3>
              <p className="text-xs text-slate-400">
                Elimina a defasagem de baixa no fim do turno registrando o consumo em tempo real.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Workstation Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Posto de Montagem / Ponto de Uso Ativo:
            </label>
            <select
              value={selectedWorkstation}
              onChange={(e) => setSelectedWorkstation(e.target.value)}
              className="w-full text-xs bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:border-cyan-500 outline-none"
            >
              <option value="Linha 01 - Posto A3 (Montagem Estrutural)">Linha 01 - Posto A3 (Montagem Gabinete Plástico)</option>
              <option value="Linha 01 - Posto B1 (Painel Frontal)">Linha 01 - Posto B1 (Tampa de Polímero)</option>
              <option value="Linha 01 - Posto A1 (Fixação Motor)">Linha 01 - Posto A1 (Motor BLDC Silencioso)</option>
              <option value="Linha 02 - Posto C2 (Placa Principal)">Linha 02 - Posto C2 (Microcontrolador Inverter)</option>
              <option value="Linha 02 - Posto D4 (Circuito Térmico)">Linha 02 - Posto D4 (Condensador Térmico)</option>
            </select>
          </div>

          {/* Camera Viewport or Mock Scanner */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 relative flex flex-col items-center justify-center min-h-[220px]">
            {cameraActive ? (
              <div className="relative w-full h-[220px] bg-black rounded-lg overflow-hidden flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                {/* Laser scan line overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="w-3/4 h-28 border-2 border-dashed border-red-500/70 rounded-lg relative flex items-center">
                    <div className="w-full h-0.5 bg-red-500 animate-pulse shadow-[0_0_10px_red]" />
                  </div>
                  <span className="text-[11px] font-mono text-red-400 mt-2 bg-black/70 px-2 py-0.5 rounded">
                    MIRA DO LEITOR ATIVA
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Barcode className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                <p className="text-xs text-slate-400 mb-3">
                  Aponte a câmera para a etiqueta de código de barras ou use o leitor USB/Bluetooth.
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  disabled={isScanning}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-2 mx-auto"
                >
                  <Camera className="w-4 h-4" />
                  {isScanning ? 'Abrindo Câmera...' : 'Iniciar Câmera de Leitura'}
                </button>
              </div>
            )}

            {cameraActive && (
              <button
                type="button"
                onClick={stopCamera}
                className="mt-2 text-xs text-rose-400 hover:underline"
              >
                Parar Câmera
              </button>
            )}
          </div>

          {/* Feedback banner */}
          {lastScanResult && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-3 text-xs ${
                lastScanResult.success
                  ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
              }`}
            >
              {lastScanResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold">{lastScanResult.message}</p>
                {lastScanResult.sku && (
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">
                    Atualização sincronizada instantaneamente com o ERP TecnoLar e sinal e-Kanban.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Manual Input or Quick Barcode Simulation Buttons */}
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Digitar código de barras ou SKU..."
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 text-xs bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2.5 focus:border-cyan-500 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition"
            >
              Registrar
            </button>
          </form>

          {/* Fast Simulation Cards */}
          <div>
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Itens Frequentes da Linha (Simular Leitura Ótica no Ponto de Uso):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {items.slice(0, 4).map((i) => (
                <button
                  key={i.sku}
                  type="button"
                  onClick={() => handleScanCode(i.barcode)}
                  className="p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-xl text-left text-xs transition flex items-center justify-between group"
                >
                  <div>
                    <span className="font-bold text-slate-200 group-hover:text-cyan-400 block">{i.sku}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{i.name}</span>
                    <span className="text-[10px] text-cyan-400 font-mono">Cód: {i.barcode}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-white block">{i.currentStock} un</span>
                    <span className="text-[10px] text-slate-400">L. Supermercado: {i.lineSupermarketStock}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Sincronismo: API RESTful ERP TecnoLar (200 OK)</span>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};

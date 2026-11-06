import React from 'react';
import { Eye, Type, Contrast, Volume2, Mic, Hand, X, Check, RotateCcw } from 'lucide-react';
import { useVmi } from '../context/VmiContext';
import { DaltonismMode } from '../types';

interface AccessibilityModalProps {
  onClose: () => void;
  onOpenLibras: () => void;
  onOpenVoice: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  onClose,
  onOpenLibras,
  onOpenVoice,
}) => {
  const { accessibility, updateAccessibility, speakText } = useVmi();

  const handleReset = () => {
    updateAccessibility({
      highContrast: false,
      fontSize: 'normal',
      daltonism: 'none',
      screenReaderEnabled: false,
      librasActive: false,
      voiceCommandActive: false,
    });
    speakText('Preferências de acessibilidade restauradas para o padrão.');
  };

  const handleTestSpeech = () => {
    speakText(
      'Teste do sintetizador de voz do sistema TecnoLar VMI. Diretrizes de acessibilidade WCAG nível triplo A ativas.'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Central de Acessibilidade Universal</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                  WCAG 2.1 AAA
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ajustes visuais, sonoros e motores para inclusão total dos colaboradores.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Fechar Central de Acessibilidade"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* 1. Quick Access to Libras and Voice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenLibras();
              }}
              className="p-3.5 bg-gradient-to-br from-cyan-950/70 to-slate-900 border border-cyan-700/60 hover:border-cyan-400 rounded-xl text-left transition flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-cyan-600/30 flex items-center justify-center text-cyan-300 shrink-0">
                <Hand className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Abrir Central Libras</span>
                <span className="text-xs text-slate-400">Câmera e intérprete de sinais</span>
              </div>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenVoice();
              }}
              className="p-3.5 bg-gradient-to-br from-blue-950/70 to-slate-900 border border-blue-700/60 hover:border-blue-400 rounded-xl text-left transition flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-600/30 flex items-center justify-center text-blue-300 shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm text-white block">Comandos de Voz</span>
                <span className="text-xs text-slate-400">Navegação para baixa visão</span>
              </div>
            </button>
          </div>

          {/* 2. Contrast */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Contrast className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-sm font-semibold text-white block">Modo de Alto Contraste</span>
                <span className="text-xs text-slate-400">
                  Compatível com Modo Claro (fundo branco e texto preto) e Modo Escuro (fundo preto e amarelo) com bordas sólidas (WCAG AAA).
                </span>
              </div>
            </div>
            <button
              onClick={() => updateAccessibility({ highContrast: !accessibility.highContrast })}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                accessibility.highContrast ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
              aria-label="Alternar Alto Contraste"
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  accessibility.highContrast ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 3. Font Size */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-semibold text-white">Tamanho da Fonte / Escala Tipográfica</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(
                [
                  { id: 'normal', label: 'Normal (100%)' },
                  { id: 'large', label: 'Grande (110%)' },
                  { id: 'xlarge', label: 'Extra Grande (120%)' },
                ] as const
              ).map((fs) => (
                <button
                  key={fs.id}
                  onClick={() => updateAccessibility({ fontSize: fs.id })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    accessibility.fontSize === fs.id
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {fs.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Daltonism Simulation / Filter */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Filtros de Cores para Daltonismo
              </span>
              <span className="text-[11px] text-slate-400">Compensação cromática</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              {(
                [
                  { id: 'none', label: 'Padrão (Sem filtro)' },
                  { id: 'deuteranopia', label: 'Deuteranopia (Verde)' },
                  { id: 'protanopia', label: 'Protanopia (Vermelho)' },
                  { id: 'tritanopia', label: 'Tritanopia (Azul)' },
                  { id: 'achromatopsia', label: 'Acromatopsia (Mono)' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  onClick={() => updateAccessibility({ daltonism: d.id as DaltonismMode })}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-semibold border transition text-center ${
                    accessibility.daltonism === d.id
                      ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Screen Reader Speech Synthesis */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-cyan-400" />
              <div>
                <span className="text-sm font-semibold text-white block">Leitor de Tela Narrado</span>
                <span className="text-xs text-slate-400">
                  Narração em voz alta ao alternar abas, passar o cursor ou receber alertas.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTestSpeech}
                className="text-[11px] px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700"
              >
                Testar Voz
              </button>
              <button
                onClick={() =>
                  updateAccessibility({ screenReaderEnabled: !accessibility.screenReaderEnabled })
                }
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  accessibility.screenReaderEnabled ? 'bg-cyan-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    accessibility.screenReaderEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restaurar Padrões
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs transition"
          >
            Salvar e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

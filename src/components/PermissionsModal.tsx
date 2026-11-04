import React from 'react';
import { Camera, Mic, Users, CheckCircle2, Shield, X, AlertCircle } from 'lucide-react';
import { useVmi } from '../context/VmiContext';

interface PermissionsModalProps {
  onClose: () => void;
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({ onClose }) => {
  const { permissions, requestPermission } = useVmi();

  const handleToggle = async (perm: 'camera' | 'microphone' | 'contacts') => {
    await requestPermission(perm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Permissões do Sistema VMI</h3>
              <p className="text-xs text-slate-400">
                Gerencie as permissões de hardware e dispositivos solicitadas pelo aplicativo.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              O aplicativo TecnoLar VMI utiliza sensores para agilizar a operação industrial: leitura de códigos de barras, tradução de Libras por visão, diálogo por voz e contato direto entre fornecedores e compradores.
            </span>
          </div>

          {/* Camera Permission Card */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Câmera</h4>
                <p className="text-xs text-slate-400">
                  Escaneamento de códigos de barras no ponto de uso, diálogo com a IA por imagens e detecção de Libras.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('camera')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                permissions.camera
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
              }`}
            >
              {permissions.camera ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Autorizado
                </>
              ) : (
                'Permitir'
              )}
            </button>
          </div>

          {/* Microphone Permission Card */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Microfone</h4>
                <p className="text-xs text-slate-400">
                  Conversação por comandos de voz com a IA do VMI e ligações diretas entre fornecedores e TecnoLar.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('microphone')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                permissions.microphone
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
              }`}
            >
              {permissions.microphone ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Autorizado
                </>
              ) : (
                'Permitir'
              )}
            </button>
          </div>

          {/* Contacts Permission Card */}
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Lista de Contatos</h4>
                <p className="text-xs text-slate-400">
                  Comunicação ágil com compradores, planejadores de suprimentos, supervisores de linha e contatos técnicos do fornecedor.
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('contacts')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${
                permissions.contacts
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow'
              }`}
            >
              {permissions.contacts ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Autorizado
                </>
              ) : (
                'Permitir'
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Trash2,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { useVmi } from '../context/VmiContext';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ onClose, onNavigate }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    addNotification,
  } = useVmi();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  const handleTestDispatch = () => {
    addNotification({
      title: '🚨 Simulação de Ruptura Crítica Disparada',
      message: 'Estoque do item GAB-PLAST-800 atingiu o nível de segurança! Notificação enviada ao fornecedor Polilux.',
      type: 'danger',
      actionView: 'inventory',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Central de Avisos & Notificações VMI</h3>
              <p className="text-xs text-slate-400">
                Alertas em tempo real sobre rupturas, OTIF de fornecedores e rotas Milk Run.
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

        {/* Action Bar */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filter === 'all' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todas ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                filter === 'unread' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Não lidas ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestDispatch}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              Testar Alerta
            </button>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-slate-400 hover:text-white flex items-center gap-1 ml-2"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar lidas
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 text-xs">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Nenhuma notificação encontrada no momento.</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  markNotificationAsRead(item.id);
                  if (item.actionView) {
                    onClose();
                    onNavigate(item.actionView);
                  }
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition flex items-start justify-between gap-3 ${
                  item.read
                    ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                    : 'bg-slate-950 border-cyan-800 text-slate-200 shadow-sm'
                } hover:border-cyan-500/60`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {item.type === 'danger' && <AlertOctagon className="w-4 h-4 text-rose-400" />}
                    {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                    {item.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
                    {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-xs ${item.read ? 'text-slate-300' : 'text-white'}`}>
                        {item.title}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{item.message}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">{item.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.actionView && (
                    <button
                      className="p-1 rounded text-cyan-400 hover:text-cyan-300"
                      title="Ir para a tela relacionada"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(item.id);
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                    title="Excluir notificação"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Notificações sincronizadas com o canal do ERP TecnoLar</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

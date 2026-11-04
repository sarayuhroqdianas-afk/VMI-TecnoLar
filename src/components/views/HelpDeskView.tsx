import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  ChevronRight,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useVmi } from '../../context/VmiContext';
import { SupportTicket } from '../../types';

export const HelpDeskView: React.FC = () => {
  const { supportTickets, currentUser, suppliers } = useVmi();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket>(supportTickets[0]);
  const [replyText, setReplyText] = useState<string>('');
  const [showNewModal, setShowNewModal] = useState<boolean>(false);

  // New ticket state
  const [newSubject, setNewSubject] = useState<string>('');
  const [newCategory, setNewCategory] = useState<SupportTicket['category']>('divergencia_estoque');
  const [newPriority, setNewPriority] = useState<SupportTicket['priority']>('media');
  const [newMessage, setNewMessage] = useState<string>('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: `${currentUser.name} (${currentUser.companyName})`,
      role: currentUser.role.startsWith('fornecedor') ? 'Fornecedor' : 'TecnoLar',
      content: replyText.trim(),
      timestamp: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
    };

    selectedTicket.messages.push(newMsg);
    setReplyText('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      protocolNumber: `SAC-VMI-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierId: currentUser.supplierId || 'sup-polilux-franca',
      supplierName: currentUser.companyName,
      authorName: currentUser.name,
      subject: newSubject.trim(),
      category: newCategory,
      priority: newPriority,
      status: 'aberto',
      createdAt: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: `${currentUser.name} (${currentUser.companyName})`,
          role: currentUser.role.startsWith('fornecedor') ? 'Fornecedor' : 'TecnoLar',
          content: newMessage.trim(),
          timestamp: `${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
        },
      ],
    };

    supportTickets.unshift(newTicket);
    setSelectedTicket(newTicket);
    setShowNewModal(false);
    setNewSubject('');
    setNewMessage('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              Central de Ajuda, Suporte & Resolução de Disputas
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              CANAL DIRETO FORNECEDOR-INDÚSTRIA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Registro formal de divergências de estoque, solicitações de janelas de entrega e dúvidas sobre SLAs.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center gap-2 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          Abrir Novo Chamado / Protocolo
        </button>
      </div>

      {/* Grid: Tickets List (Left) vs Selected Ticket Conversation (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Chamados Abertos & Histórico ({supportTickets.length})
          </span>

          <div className="space-y-2.5">
            {supportTickets.map((tkt) => {
              const isSelected = selectedTicket.id === tkt.id;
              return (
                <div
                  key={tkt.id}
                  onClick={() => setSelectedTicket(tkt)}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500 shadow-lg'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-cyan-400">{tkt.protocolNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        tkt.status === 'aberto'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : tkt.status === 'em_analise'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}
                    >
                      {tkt.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-xs line-clamp-1">{tkt.subject}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{tkt.supplierName}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-900">
                    <span>{tkt.category.replace('_', ' ').toUpperCase()}</span>
                    <span>{tkt.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick FAQ Card */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              Perguntas Frequentes (FAQ Operacional)
            </span>
            <div className="space-y-1.5 text-[11px] text-slate-400">
              <details className="cursor-pointer">
                <summary className="font-semibold text-slate-300 hover:text-white">
                  Como funciona o faturamento no ponto de uso?
                </summary>
                <p className="mt-1 pl-2 text-slate-400">
                  O insumo permanece sob guarda consignada. A NF-e de venda só é emitida automaticamente quando o operador faz a leitura ótica no posto de trabalho da linha.
                </p>
              </details>
              <details className="cursor-pointer">
                <summary className="font-semibold text-slate-300 hover:text-white">
                  Qual a tolerância de atraso no OTIF sem penalidade?
                </summary>
                <p className="mt-1 pl-2 text-slate-400">
                  O contrato estabelece meta mínima de 96% de pontualidade e quantidade para itens A-críticos. Atrasos que gerem ociosidade de linha incorrem em R$ 22.000/h.
                </p>
              </details>
            </div>
          </div>
        </div>

        {/* Selected Ticket Conversation */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between min-h-[480px]">
          <div>
            {/* Ticket Header */}
            <div className="pb-3 border-b border-slate-800 flex justify-between items-start">
              <div>
                <span className="font-mono text-cyan-400 font-bold text-xs">{selectedTicket.protocolNumber}</span>
                <h3 className="font-bold text-base text-white mt-0.5">{selectedTicket.subject}</h3>
                <p className="text-xs text-slate-400">
                  Aberto por: {selectedTicket.authorName} ({selectedTicket.supplierName})
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Prioridade:</span>
                <span className="text-xs font-bold text-amber-400 uppercase">{selectedTicket.priority}</span>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="space-y-4 py-4 max-h-[350px] overflow-y-auto">
              {selectedTicket.messages.map((m) => (
                <div key={m.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      {m.sender}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">{m.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Escreva uma resposta oficial ao protocolo..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Send className="w-4 h-4" />
              Responder
            </button>
          </form>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Abrir Novo Chamado de Suporte / Disputa</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assunto do Chamado:</label>
                <input
                  type="text"
                  placeholder="Ex: Ajuste de horário de entrega Milk Run / Divergência de saldo"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoria:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="divergencia_estoque">Divergência de Estoque</option>
                    <option value="atraso_entrega">Atraso de Entrega</option>
                    <option value="qualidade">Problema de Qualidade</option>
                    <option value="sistema_erp">Integração ERP / Sistema</option>
                    <option value="duvida_sla">Dúvida de Contrato / SLA</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Prioridade:</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta (Risco de Parada)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Descrição Detalhada:</label>
                <textarea
                  rows={4}
                  placeholder="Descreva o ocorrido, lote, número de NF-e ou posto de trabalho envolvido..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow"
                >
                  Registrar Protocolo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

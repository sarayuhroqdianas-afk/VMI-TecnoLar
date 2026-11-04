import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Truck,
  ShoppingBag,
  Barcode,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Plus,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { useVmi } from '../../context/VmiContext';
import { Item } from '../../types';

interface InventoryViewProps {
  onOpenScanner: () => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onOpenScanner }) => {
  const { items, currentUser, formatMoney, createReplenishmentOrder, setSelectedContractForModal, contracts } = useVmi();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [orderingItem, setOrderingItem] = useState<Item | null>(null);
  const [orderQty, setOrderQty] = useState<number>(9354);

  // RBAC Filter: If user is a supplier, filter ONLY to their contracted items
  const visibleItems = items.filter((item) => {
    if (currentUser.role.startsWith('fornecedor_') && currentUser.supplierId) {
      if (item.supplierId !== currentUser.supplierId) return false;
    }
    if (selectedClass !== 'all' && item.abcClassification !== selectedClass) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.sku.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.supplierName.toLowerCase().includes(q) ||
        item.barcode.includes(q)
      );
    }
    return true;
  });

  const handleStartOrder = (item: Item) => {
    setOrderingItem(item);
    setOrderQty(item.economicOrderQty || 9354);
  };

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingItem) return;
    createReplenishmentOrder(orderingItem.sku, orderQty);
    setOrderingItem(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              Gestão de Estoques em Tempo Real & Sell-Through
            </h2>
            {currentUser.role.startsWith('fornecedor_') && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                VISÃO RESTRITA DO FORNECEDOR (SLA)
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">
            Acompanhamento de saldos na fábrica, mini-estoques de linha, estoque em trânsito e vendas no PDV.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenScanner}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
          >
            <Barcode className="w-4 h-4" />
            Leitor de Código de Barras (Ponto de Uso)
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Total de SKUs Monitorados</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{visibleItems.length}</span>
            <span className="text-[10px] text-slate-500">de 400+ componentes</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Itens em Alerta de Ruptura</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-rose-400">
              {visibleItems.filter((i) => i.status === 'critical' || i.status === 'warning').length}
            </span>
            <span className="text-[10px] text-rose-400 font-medium">Abaixo do Ponto Pedido</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Sell-Through Semanal (Varejo)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-400">
              {visibleItems.reduce((acc, i) => acc + i.sellThroughWeekly, 0).toLocaleString('pt-BR')} un
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Consumo real no PDV</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-[11px] font-medium text-slate-400 block mb-1">Em Trânsito (VMI Reabastecimento)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-cyan-400">
              {visibleItems.reduce((acc, i) => acc + i.inTransitStock, 0).toLocaleString('pt-BR')} un
            </span>
            <span className="text-[10px] text-cyan-400 font-medium">Lotes a caminho</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por SKU, nome, código de barras..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2 rounded-xl focus:border-cyan-500 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Classificação ABC:</span>
          </div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 text-white px-2.5 py-1.5 rounded-xl outline-none focus:border-cyan-500"
          >
            <option value="all">Todas (A, B, C)</option>
            <option value="A">Classe A (Críticos)</option>
            <option value="B">Classe B (Intermediários)</option>
            <option value="C">Classe C (Alta rotatividade)</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-700 text-white px-2.5 py-1.5 rounded-xl outline-none focus:border-cyan-500"
          >
            <option value="all">Todos os Status</option>
            <option value="critical">Ruptura Iminente</option>
            <option value="warning">Abaixo do Ponto Pedido</option>
            <option value="normal">Estoque Normal</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Componente / SKU</th>
                <th className="py-3 px-3">Classif.</th>
                <th className="py-3 px-3 text-right">Estoque Fábrica</th>
                <th className="py-3 px-3 text-right">Supermercado Linha</th>
                <th className="py-3 px-3 text-right">Em Trânsito</th>
                <th className="py-3 px-3 text-right">Ponto Pedido</th>
                <th className="py-3 px-3 text-right">Sell-Through Sem.</th>
                <th className="py-3 px-3">Cobertura</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-center">Ações VMI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {visibleItems.map((item) => {
                const coverage = Number((item.currentStock / item.dailyDemand).toFixed(1));
                const isUnderPP = item.currentStock <= item.reorderPoint;
                return (
                  <tr key={item.sku} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs">{item.sku}</span>
                        {item.isCritical && (
                          <span className="text-[9px] bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-800 font-bold">
                            CRÍTICO
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5 line-clamp-1">{item.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                        <span>Fornecedor: {item.supplierName}</span>
                        <span>• Cód: {item.barcode}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-200 bg-slate-800 px-2 py-0.5 rounded">
                        {item.abcClassification}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className={`font-bold ${isUnderPP ? 'text-amber-400' : 'text-white'}`}>
                        {item.currentStock.toLocaleString('pt-BR')} un
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-slate-300">
                      {item.lineSupermarketStock.toLocaleString('pt-BR')} un
                    </td>

                    <td className="py-3 px-3 text-right text-cyan-400 font-semibold">
                      {item.inTransitStock > 0 ? `${item.inTransitStock.toLocaleString('pt-BR')} un` : '—'}
                    </td>

                    <td className="py-3 px-3 text-right text-slate-400">
                      <span className="font-bold text-slate-300">{item.reorderPoint.toLocaleString('pt-BR')}</span>
                      <span className="text-[9px] text-slate-500 block">SS: {item.safetyStock}</span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="text-emerald-400 font-bold">
                        {item.sellThroughWeekly.toLocaleString('pt-BR')} un
                      </span>
                      <span className="text-[9px] text-slate-500 block">Varejo PDV</span>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`text-[11px] font-bold ${
                          coverage < 5 ? 'text-rose-400' : coverage < 12 ? 'text-amber-400' : 'text-emerald-400'
                        }`}
                      >
                        {coverage} dias
                      </span>
                    </td>

                    <td className="py-3 px-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                          item.status === 'critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : item.status === 'warning'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {item.status === 'critical'
                          ? 'RUPTURA'
                          : item.status === 'warning'
                          ? 'ALERTA PP'
                          : 'NORMAL'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center font-sans">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleStartOrder(item)}
                          className="px-2.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg shadow transition inline-flex items-center gap-1"
                          title="Disparar Ordem de Reposição pelo Lote Econômico"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Repor
                        </button>
                        <button
                          onClick={() => {
                            const c = contracts.find((ct) => ct.supplierId === item.supplierId) || contracts[0];
                            setSelectedContractForModal(c);
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition"
                          title="Visualizar Contrato & SLA deste componente"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Replenishment Order Modal Drawer */}
      {orderingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">Disparar Reposição VMI (Ordem de Compra)</h3>
              <button
                onClick={() => setOrderingItem(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">Item Selecionado:</span>
                <span className="font-bold text-white text-sm">{orderingItem.name}</span>
                <span className="text-[11px] text-cyan-400 font-mono block">SKU: {orderingItem.sku}</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Estoque Atual:</span>
                  <span className="font-bold text-white font-mono">{orderingItem.currentStock} un</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ponto de Pedido (PP):</span>
                  <span className="font-bold text-amber-400 font-mono">{orderingItem.reorderPoint} un</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lote Econômico Recomendado (LEC):</span>
                  <span className="font-bold text-emerald-400 font-mono">{orderingItem.economicOrderQty} un</span>
                </div>
              </div>

              <form onSubmit={handleConfirmOrder} className="space-y-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Quantidade do Lote a Emitir:</label>
                  <input
                    type="number"
                    value={orderQty}
                    onChange={(e) => setOrderQty(Number(e.target.value))}
                    min={100}
                    step={100}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono font-bold text-sm focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="text-[11px] text-slate-400">
                  Valor Total Estimado: <strong className="text-white">{formatMoney(orderQty * orderingItem.unitCost)}</strong>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderingItem(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold shadow-lg"
                  >
                    Confirmar Envio VMI
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

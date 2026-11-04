import React from 'react';
import {
  Truck,
  RotateCw,
  Clock,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Package,
  Boxes,
  Leaf,
  DollarSign,
} from 'lucide-react';
import { useVmi } from '../../context/VmiContext';

export const MilkRunView: React.FC = () => {
  const { milkRuns, kanbanCards, formatMoney } = useVmi();

  const investmentItems = [
    { item: 'Carrinho plataforma industrial 500 kg', qtd: '2 un', unit: 2000, total: 4000 },
    { item: 'Paleteira manual 2.500 kg', qtd: '1 un', unit: 1985, total: 1985 },
    { item: 'Caixas plásticas retornáveis ecológicas', qtd: '30 un', unit: 80, total: 2400 },
    { item: 'Estrutura metálica para supermercado de materiais', qtd: '1 conjunto', unit: 4000, total: 4000 },
    { item: 'Identificação visual de materiais, endereçamento e Kanban', qtd: '1 conjunto', unit: 1000, total: 1000 },
    { item: 'Coletores e contentores para retorno e separação de resíduos', qtd: '6 un', unit: 150, total: 900 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              Abastecimento Interno, Milk Run & e-Kanban
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              CIRCUITO DE 30 MIN • LAYOUT 400M
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Resolução do gargalo de deslocamento entre almoxarifado e montagem com rotas fixas e supermercados de linha.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 animate-spin" />
            Trem Logístico em Operação
          </span>
        </div>
      </div>

      {/* Visual Layout Map of the 400 Meters Route */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Trajeto Padronizado do Trem Logístico Milk Run (400 Metros)
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">Frequência: A cada 30 minutos</span>
        </div>

        {/* Step-by-Step Route Visualization */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-950 border border-cyan-800/60 rounded-xl relative overflow-hidden">
            <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-3 right-3 animate-ping" />
            <span className="text-[10px] font-mono text-cyan-400 font-bold block mb-1">ESTAÇÃO 01 • 0m</span>
            <h4 className="font-bold text-xs text-white">Almoxarifado Central & Staging</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Separação prévia dos lotes em caixas plásticas retornáveis conforme demanda puxada.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 font-bold block mb-1">ESTAÇÃO 02 • 120m</span>
            <h4 className="font-bold text-xs text-white">Supermercado Linha 01</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Abastecimento de Gabinetes Plásticos e Tampas de Polímero (Postos A1 a A4).
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 font-bold block mb-1">ESTAÇÃO 03 • 280m</span>
            <h4 className="font-bold text-xs text-white">Supermercado Linha 02</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Entrega de microcontroladores sensíveis (ESD) e fixação de motores BLDC.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 border border-emerald-800/60 rounded-xl">
            <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">ESTAÇÃO 04 • 400m</span>
            <h4 className="font-bold text-xs text-white">Retorno de Contentores</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Coleta de caixas vazias e cartões de sinalização e-Kanban para o próximo ciclo.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Milk Run Trips Table & e-Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Milk Run Trips */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Programação Diária de Viagens do Milk Run (2 por hora)
            </h3>
            <span className="text-[11px] text-slate-400">Meta no horário: &ge; 95%</span>
          </div>

          <div className="space-y-2.5">
            {milkRuns.map((mr) => (
              <div
                key={mr.id}
                className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{mr.tripNumber}</span>
                    <span className="text-[11px] text-cyan-400 font-semibold font-mono">{mr.timeSlot}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        mr.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : mr.status === 'in_progress'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {mr.status === 'completed'
                        ? 'CONCLUÍDO'
                        : mr.status === 'in_progress'
                        ? 'EM TRÂNSITO'
                        : 'PROGRAMADO'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-1">{mr.carrierType} • Operador: {mr.driverName}</p>
                </div>

                <div className="text-right">
                  <span className="text-slate-200 font-bold block">{mr.capacityUsedPercent}% Ocupação</span>
                  <span className="text-[10px] text-emerald-400">{mr.returnableBoxesCollected} caixas coletadas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* e-Kanban Board */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Quadro Visual de Cartões e-Kanban da Linha
            </h3>
            <span className="text-[11px] text-slate-400">Sinalização de Reposição Puxada</span>
          </div>

          <div className="space-y-3">
            {kanbanCards.map((card) => (
              <div
                key={card.id}
                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between transition ${
                  card.status === 'red'
                    ? 'bg-rose-950/40 border-rose-600/70'
                    : card.status === 'yellow'
                    ? 'bg-amber-950/40 border-amber-600/70'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        card.status === 'red'
                          ? 'bg-rose-500 animate-ping'
                          : card.status === 'yellow'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="font-bold text-white text-xs font-mono">{card.sku}</span>
                    <span className="text-slate-300 font-medium">{card.itemName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{card.supermarketLocation}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Disparo: {card.lastTriggered}</p>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white font-mono text-sm">
                    {card.currentBins} / {card.maxBins} Bins
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase ${
                      card.status === 'red'
                        ? 'text-rose-400'
                        : card.status === 'yellow'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {card.status === 'red' ? 'REPOR URGENTE' : card.status === 'yellow' ? 'ATENÇÃO' : 'ABASTECIDO'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sustainable Logistics & Investment Table (Quadro 11 do Artigo) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Sustentabilidade & Investimento na Nova Implantação do Milk Run (Quadro 11)
              </h3>
              <p className="text-[11px] text-slate-400">
                Eliminação de embalagens descartáveis de papelão/madeira e retorno de contentores padronizados.
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Investimento Total Estimado:</span>
            <span className="text-base font-extrabold text-emerald-400 font-mono">R$ 14.285,00</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-2.5 px-3">Recurso / Equipamento Logístico</th>
                <th className="py-2.5 px-3">Quantidade</th>
                <th className="py-2.5 px-3 text-right">Valor Unitário de Referência</th>
                <th className="py-2.5 px-3 text-right">Total Estimado</th>
                <th className="py-2.5 px-3 text-right">Impacto Ambiental</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {investmentItems.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-sans text-slate-200">{inv.item}</td>
                  <td className="py-2.5 px-3 text-cyan-400">{inv.qtd}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{formatMoney(inv.unit)}</td>
                  <td className="py-2.5 px-3 text-right text-white font-bold">{formatMoney(inv.total)}</td>
                  <td className="py-2.5 px-3 text-right font-sans text-emerald-400 text-[11px]">
                    Reutilizável / Sem resíduos
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

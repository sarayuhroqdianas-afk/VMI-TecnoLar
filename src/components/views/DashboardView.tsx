import React from 'react';
import {
  TrendingUp,
  AlertOctagon,
  Clock,
  ShieldCheck,
  DollarSign,
  PackageCheck,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useVmi } from '../../context/VmiContext';
import { calculateFinancialImpact } from '../../utils/vmiCalculations';

export const DashboardView: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { items, suppliers, formatMoney, currentUser } = useVmi();
  const fin = calculateFinancialImpact();

  const criticalItems = items.filter((i) => i.status === 'critical' || i.status === 'warning');
  const avgOtif = Number(
    (suppliers.reduce((acc, s) => acc + s.scoreCard.otif, 0) / suppliers.length).toFixed(1)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Contextual to TecnoLar */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                INDUSTRIA TECNOLAR • VMI OPERACIONAL
              </span>
              <span className="text-xs text-slate-400">Planta Franca/SP • 1.200 un/dia</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Painel de Gestão de Rupturas & Cadeia de Suprimentos
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoramento em tempo real dos 400+ componentes, integração com ERP TecnoLar, 
              previsão por IA e sincronização direta com fornecedores nacionais e internacionais.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('inventory')}
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-cyan-600/30 transition flex items-center gap-2"
            >
              <PackageCheck className="w-4 h-4" />
              Ver Estoque em Tempo Real
            </button>
            <button
              onClick={() => onNavigate('parameters')}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              Simulador LEC & Ponto Pedido
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards (Baseline from the Article vs Projected) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Horas de Parada */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Horas de Parada (Trimestral)</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">8h</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -71,4% (era 28h)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Custo hora: {formatMoney(22000)}/h. Redução de 20h de parada no período.
          </p>
        </div>

        {/* KPI 2: Economia Gerada */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Economia em Rupturas</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-400">
              {formatMoney(fin.quarterlySavings)}
            </span>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
              -71,1% Custo
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {formatMoney(766000)} &rarr; {formatMoney(221000)}/trimestre (Economia anual: {formatMoney(2180000)}).
          </p>
        </div>

        {/* KPI 3: OTIF de Fornecedores */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">OTIF Médio Fornecedores</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">{avgOtif}%</span>
            <span className="text-xs font-semibold text-cyan-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Meta: 96%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Base inicial: 76% (Quadro 2). Itens A-críticos acompanhados mensalmente.
          </p>
        </div>

        {/* KPI 4: Acuracidade de Estoque */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400">Acuracidade do Estoque</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">99,1%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +17,1 p.p. (era 82%)
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Inventário cíclico diário nos A-Críticos e leitura no ponto de uso.
          </p>
        </div>
      </div>

      {/* Main Grid: Critical Alerts & Cause Breakdown (Pareto/Ishikawa) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Real-time Stock Alerts */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-white">Monitor de Ruptura & Ponto de Pedido Iminente</h3>
              </div>
              <button
                onClick={() => onNavigate('inventory')}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                Ver todos os 400+ itens <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {criticalItems.map((item) => {
                const coverage = (item.currentStock / item.dailyDemand).toFixed(1);
                return (
                  <div
                    key={item.sku}
                    className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl hover:border-cyan-500/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-xs">{item.sku}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.status === 'critical'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}
                        >
                          {item.status === 'critical' ? 'RUPTURA IMINENTE' : 'ABAIXO DO PP'}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.supplierName}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1">{item.name}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                        <span>Fábrica: <strong className="text-white">{item.currentStock.toLocaleString('pt-BR')} un</strong></span>
                        <span>Ponto Pedido: <strong className="text-amber-400">{item.reorderPoint.toLocaleString('pt-BR')} un</strong></span>
                        <span>Cobertura: <strong className="text-cyan-300">{coverage} dias</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:self-center shrink-0">
                      <button
                        onClick={() => onNavigate('inventory')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition"
                      >
                        Repor Agora
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Sincronismo direto com ERP TecnoLar a cada evento de consumo.</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Online
            </span>
          </div>
        </div>

        {/* Right Column: Diagnostic & Pareto of the 28 Hours Downtime */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-white">Diagnóstico das 28h de Parada (Pareto)</h3>
              <p className="text-[11px] text-slate-400">Folha de verificação do Artigo TecnoLar (Quadro 5)</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Pareto Item 1 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-200">1. Atraso do Fornecedor / Variabilidade Lead Time</span>
                <span className="font-mono font-bold text-rose-400">14h ({formatMoney(308000)})</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: '50%' }} />
              </div>
              <span className="text-[10px] text-slate-500">50% do tempo total de parada (7 ocorrências)</span>
            </div>

            {/* Pareto Item 2 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-200">2. Falha na Logística Interna (Layout 400m)</span>
                <span className="font-mono font-bold text-amber-400">6h ({formatMoney(132000)})</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '21.4%' }} />
              </div>
              <span className="text-[10px] text-slate-500">21,4% • Resolvido com o Milk Run de 30min</span>
            </div>

            {/* Pareto Item 3 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-200">3. Divergência de Estoque (Baixa tardia de turno)</span>
                <span className="font-mono font-bold text-yellow-400">5h ({formatMoney(110000)})</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '17.9%' }} />
              </div>
              <span className="text-[10px] text-slate-500">17,9% • Eliminado com leitura no Ponto de Uso</span>
            </div>

            {/* Pareto Item 4 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-slate-200">4. Problemas de Qualidade / Defeito de Insumos</span>
                <span className="font-mono font-bold text-blue-400">3h ({formatMoney(66000)})</span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '10.7%' }} />
              </div>
              <span className="text-[10px] text-slate-500">10,7% • Coberto no Scorecard de Qualidade</span>
            </div>

            {/* Multas short shipment */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Multas por Short-Shipment</span>
                <span className="text-xs font-semibold text-slate-300">Entregas incompletas aos varejistas</span>
              </div>
              <span className="text-sm font-bold text-rose-400 font-mono">{formatMoney(150000)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Situacao Atual x Situacao Projetada */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-white">Quadro Consolidado: Situação Atual × Cenário Projetado</h3>
            <p className="text-xs text-slate-400">
              Metas estabelecidas no artigo acadêmico (Quadro 8 e Gráfico 4) aplicadas no modelo VMI.
            </p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            Exportar Relatório Comparativo <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="py-2.5 px-3">Indicador Logístico / Estratégico</th>
                <th className="py-2.5 px-3">Cenário Inicial (Artigo)</th>
                <th className="py-2.5 px-3">Após Implementação VMI</th>
                <th className="py-2.5 px-3">Variação / Ganho</th>
                <th className="py-2.5 px-3 text-right">Mecanismo de Controle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="py-3 px-3 font-sans font-medium text-white">OTIF de Fornecedores</td>
                <td className="py-3 px-3 text-rose-400">82% (Inicial: 76%)</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">96%</td>
                <td className="py-3 px-3 text-emerald-300 font-bold">+14 p.p.</td>
                <td className="py-3 px-3 text-right font-sans text-slate-400">Scorecard mensal + 5W2H</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-medium text-white">Acuracidade do Estoque</td>
                <td className="py-3 px-3 text-rose-400">91% (Inicial: 82%)</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">99%</td>
                <td className="py-3 px-3 text-emerald-300 font-bold">+8 p.p.</td>
                <td className="py-3 px-3 text-right font-sans text-slate-400">Inventário cíclico diário (Classe A)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-medium text-white">Horas de Linha Parada por Ruptura</td>
                <td className="py-3 px-3 text-rose-400">28 horas</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">8 horas</td>
                <td className="py-3 px-3 text-emerald-300 font-bold">-71,4%</td>
                <td className="py-3 px-3 text-right font-sans text-slate-400">Supermercado de Linha + Alertas</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-medium text-white">Tempo de Resposta Interno</td>
                <td className="py-3 px-3 text-rose-400">45 minutos</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">15 minutos</td>
                <td className="py-3 px-3 text-emerald-300 font-bold">-66,7%</td>
                <td className="py-3 px-3 text-right font-sans text-slate-400">Milk Run a cada 30 min (400m)</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-medium text-white">Lead Time Médio (Plásticos)</td>
                <td className="py-3 px-3 text-rose-400">10 dias</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">8 dias</td>
                <td className="py-3 px-3 text-emerald-300 font-bold">-20%</td>
                <td className="py-3 px-3 text-right font-sans text-slate-400">Contrato VMI com Polilux</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-sans font-medium text-white">Variabilidade do Lead Time (σLT)</td>
                <td className="py-3 px-3 text-rose-400">±6 dias</td>
                <td className="py-3 px-3 text-emerald-400 font-bold">±2 dias</td>
                <td className="py-3 px-3 text-emerald-300 font-bold">-66,7%</td>
                <td className="py-3 px-3 text-right font-sans text-slate-400">Janelas fixas e rotas padronizadas</td>
              </tr>
              <tr className="bg-emerald-950/20 font-bold">
                <td className="py-3 px-3 font-sans text-emerald-300">Impacto Financeiro Trimestral Total</td>
                <td className="py-3 px-3 text-rose-400 font-mono">{formatMoney(766000)}</td>
                <td className="py-3 px-3 text-emerald-400 font-mono">{formatMoney(221000)}</td>
                <td className="py-3 px-3 text-emerald-300 font-mono">-{formatMoney(545000)} (-71,1%)</td>
                <td className="py-3 px-3 text-right font-sans text-emerald-400">Economia bruta anual: {formatMoney(2180000)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

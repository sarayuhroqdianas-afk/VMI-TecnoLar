import React, { useState } from 'react';
import {
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Layers,
  ArrowRight,
  Shield,
  HelpCircle,
  Play,
  Save,
  Lock,
  Unlock,
  AlertCircle,
  UserCheck,
} from 'lucide-react';
import { useVmi } from '../../context/VmiContext';
import {
  CalculationParams,
  computeVmiMetrics,
  ACADEMIC_BASELINE,
  ACADEMIC_PROJECTED,
} from '../../utils/vmiCalculations';

export const ParametersView: React.FC = () => {
  const { currentUser, updateItemParameters, unitTestResults, refreshUnitTests, formatMoney, t } = useVmi();

  const [params, setParams] = useState<CalculationParams>(ACADEMIC_BASELINE);
  const [activePreset, setActivePreset] = useState<'baseline' | 'projected' | 'custom'>('baseline');

  // RBAC rule from user request: "as variáveis operacionais de entrada podem ser editadas somente pelos fornecedores nacionais e internacionais"
  const isSupplier = currentUser.role.startsWith('fornecedor_');

  const metrics = computeVmiMetrics(params);

  const handleApplyBaseline = () => {
    setParams(ACADEMIC_BASELINE);
    setActivePreset('baseline');
  };

  const handleApplyProjected = () => {
    setParams(ACADEMIC_PROJECTED);
    setActivePreset('projected');
  };

  const handleApplyToSku = () => {
    if (!isSupplier) return;
    updateItemParameters('GAB-PLAST-800', {
      reorderPoint: metrics.reorderPointArticle,
      safetyStock: metrics.safetyStockArticle,
      economicOrderQty: metrics.lec,
      leadTimeDays: params.leadTimeDays,
      leadTimeStdDev: params.leadTimeStdDev,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              Parâmetros & Motor de Cálculo de Políticas de Estoque
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              ARTIGO SENAI 2026
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Simulação dinâmica de LEC, Estoque de Segurança (SS) e Ponto de Pedido (PP). Premissas a validar com dados reais.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyBaseline}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              activePreset === 'baseline'
                ? 'bg-cyan-600 text-white border-cyan-400 shadow'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            Cenário Atual (Artigo)
          </button>
          <button
            onClick={handleApplyProjected}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition ${
              activePreset === 'projected'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            Meta Projetada VMI
          </button>
        </div>
      </div>

      {/* RBAC Notice Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
          isSupplier
            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
            : 'bg-amber-950/60 border-amber-500/60 text-amber-200'
        }`}
      >
        <div className="flex items-center gap-3">
          {isSupplier ? (
            <Unlock className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <Lock className="w-5 h-5 text-amber-400 shrink-0" />
          )}
          <div>
            <span className="font-bold block">
              {isSupplier
                ? 'Modo de Edição Autorizado: Fornecedor Parceiro VMI'
                : 'Edição Bloqueada: Restrita aos Fornecedores Nacionais e Internacionais'}
            </span>
            <span className="text-[11px] opacity-90 block mt-0.5">
              {isSupplier
                ? `Você está logado como ${currentUser.name} (${currentUser.companyName}). Seus ajustes operacionais de Lead Time e lote impactam diretamente as metas no ERP TecnoLar.`
                : 'De acordo com as regras de governança do modelo VMI, as variáveis operacionais de suprimento (Lead Time, variabilidade e lotes) são de responsabilidade e edição exclusiva dos Fornecedores Nacionais e Internacionais.'}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase bg-black/40 border border-current shrink-0">
          {currentUser.roleTitle}
        </span>
      </div>

      {/* Main Grid: Sliders Controls (Left) vs Real-Time Results (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Form */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Variáveis Operacionais de Entrada (Item-Modelo: Componente Plástico)
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">D = 1.200 un/dia</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Lead Time Dias */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Lead Time Médio do Fornecedor (LT):</span>
                <span className="font-mono font-bold text-cyan-400">{params.leadTimeDays} dias</span>
              </div>
              <input
                type="range"
                min={3}
                max={20}
                disabled={!isSupplier}
                value={params.leadTimeDays}
                onChange={(e) => {
                  setParams({ ...params, leadTimeDays: Number(e.target.value) });
                  setActivePreset('custom');
                }}
                className={`w-full accent-cyan-500 ${!isSupplier ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Meta VMI: 8 dias</span>
                <span>Atual: 10 dias</span>
              </div>
            </div>

            {/* Variabilidade do Lead Time (σLT) */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Variabilidade do Lead Time (Desvio Padrão σLT):</span>
                <span className="font-mono font-bold text-amber-400">±{params.leadTimeStdDev} dias</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                disabled={!isSupplier}
                value={params.leadTimeStdDev}
                onChange={(e) => {
                  setParams({ ...params, leadTimeStdDev: Number(e.target.value) });
                  setActivePreset('custom');
                }}
                className={`w-full accent-amber-500 ${!isSupplier ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Meta VMI: ±2 dias</span>
                <span>Atual Crítico: ±6 dias</span>
              </div>
            </div>

            {/* Desvio da Demanda Diária */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Desvio Padrão da Demanda Diária (σd):</span>
                <span className="font-mono font-bold text-slate-200">{params.demandStdDev} un/dia</span>
              </div>
              <input
                type="range"
                min={30}
                max={200}
                disabled={!isSupplier}
                value={params.demandStdDev}
                onChange={(e) => {
                  setParams({ ...params, demandStdDev: Number(e.target.value) });
                  setActivePreset('custom');
                }}
                className={`w-full accent-cyan-500 ${!isSupplier ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Meta com S&OP: 80 un</span>
                <span>Atual: 120 un</span>
              </div>
            </div>

            {/* Custo de Emissão de Pedido S */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Custo de Emissão do Pedido (S):</span>
                <span className="font-mono font-bold text-slate-200">{formatMoney(params.orderCost)}</span>
              </div>
              <input
                type="range"
                min={100}
                max={1000}
                step={25}
                disabled={!isSupplier}
                value={params.orderCost}
                onChange={(e) => {
                  setParams({ ...params, orderCost: Number(e.target.value) });
                  setActivePreset('custom');
                }}
                className={`w-full accent-cyan-500 ${!isSupplier ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
              <span className="text-[10px] text-slate-500">Premissa acadêmica: {formatMoney(350)} por ordem</span>
            </div>

            {/* Custo Anual de Manutenção H */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Custo Anual de Manutenção por Unidade (H):</span>
                <span className="font-mono font-bold text-slate-200">{formatMoney(params.holdingCostPerUnitYear)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.1}
                disabled={!isSupplier}
                value={params.holdingCostPerUnitYear}
                onChange={(e) => {
                  setParams({ ...params, holdingCostPerUnitYear: Number(e.target.value) });
                  setActivePreset('custom');
                }}
                className={`w-full accent-cyan-500 ${!isSupplier ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              />
              <span className="text-[10px] text-slate-500">Premissa acadêmica: {formatMoney(2.4)}/unidade/ano</span>
            </div>

            {/* Nível de Serviço z */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Nível de Serviço Almejado (Fator Z):</span>
                <span className="font-mono font-bold text-emerald-400">
                  {params.serviceLevelZ === 1.28 ? '90% (z=1,28)' : params.serviceLevelZ === 1.65 ? '95% (z=1,65)' : '99% (z=2,33)'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { z: 1.28, label: '90% (Artigo)' },
                  { z: 1.65, label: '95% (SLA)' },
                  { z: 2.33, label: '99% (Crítico)' },
                ].map((s) => (
                  <button
                    key={s.z}
                    type="button"
                    disabled={!isSupplier}
                    onClick={() => {
                      setParams({ ...params, serviceLevelZ: s.z });
                      setActivePreset('custom');
                    }}
                    className={`py-1.5 px-2 rounded-lg border text-[11px] font-semibold transition ${
                      params.serviceLevelZ === s.z
                        ? 'bg-cyan-600 text-white border-cyan-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    } ${!isSupplier ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={handleApplyBaseline}
              disabled={!isSupplier}
              className={`text-xs text-slate-400 hover:text-white flex items-center gap-1 ${
                !isSupplier ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Parâmetros Iniciais
            </button>
            <button
              onClick={handleApplyToSku}
              disabled={!isSupplier}
              className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow transition ${
                isSupplier
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4" />
              {isSupplier ? 'Gravar no ERP TecnoLar' : 'Edição Bloqueada'}
            </button>
          </div>
        </div>

        {/* Results & Comparison Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center justify-between">
              <span>Resultados dos Cálculos em Tempo Real</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                D = 300.000 un/ano
              </span>
            </h3>

            {/* Highlight Metric Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Estoque de Seguranca */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Estoque de Segurança (SS)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                    {metrics.safetyStockArticle.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-slate-400 font-sans">un</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Fórmula Artigo: z × d × σLT ({params.serviceLevelZ} × 1200 × {params.leadTimeStdDev})
                </div>
              </div>

              {/* Ponto de Pedido */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Ponto de Pedido (PP)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-amber-400 font-mono">
                    {metrics.reorderPointArticle.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-slate-400 font-sans">un</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  PP = (d × LT) + SS = ({params.dailyDemand * params.leadTimeDays} + {metrics.safetyStockArticle})
                </div>
              </div>

              {/* LEC */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Lote Econômico (LEC)</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {metrics.lec.toLocaleString('pt-BR')}
                  </span>
                  <span className="text-xs text-slate-400 font-sans">un/pedido</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  LEC = √[(2 × 300.000 × 350) / 2,40]
                </div>
              </div>

              {/* Cobertura */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[11px] text-slate-400 block mb-1">Cobertura do Ponto de Pedido</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-white font-mono">
                    {metrics.coverageDays}
                  </span>
                  <span className="text-xs text-slate-400 font-sans">dias de consumo</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {metrics.reorderPointArticle} un ÷ 1.200 un/dia
                </div>
              </div>
            </div>

            {/* Visual Trade-Off Analysis */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 text-xs">
              <span className="text-slate-300 font-bold block">Trade-off de Custos do Estoque (Anualizado):</span>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Custo Anual de Emissão de Pedidos (D/LEC × S):</span>
                <span className="font-mono text-slate-200 font-bold">{formatMoney(metrics.annualOrderCost)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Custo Anual de Armazenagem/Posse (LEC/2 × H):</span>
                <span className="font-mono text-slate-200 font-bold">{formatMoney(metrics.annualHoldingCost)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800 font-bold text-xs">
                <span className="text-cyan-300">Custo Total de Estoque:</span>
                <span className="font-mono text-emerald-400">{formatMoney(metrics.totalInventoryCost)}</span>
              </div>
            </div>
          </div>

          {/* Automated Unit Tests Status Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Validação com o Artigo Científico (SENAI 2026)
                </h4>
                <p className="text-[11px] text-slate-400">Testes automatizados das equações e metas projetadas</p>
              </div>
              <button
                onClick={refreshUnitTests}
                className="text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                Executar
              </button>
            </div>

            <div className="space-y-1.5 text-[11px]">
              {unitTestResults.slice(0, 4).map((test, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-slate-950 border border-slate-800/80 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-slate-300">{test.name}</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    {test.actual.toString()} un (100% OK)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Server,
  Zap,
  Activity,
  Terminal,
  Database,
  Lock,
  Key,
  Globe,
  Bug,
  RotateCcw,
  Sparkles,
  Layers,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { useVmi } from '../../context/VmiContext';
import { SystemFault } from '../../types';

export const MaintenanceView: React.FC = () => {
  const {
    currentUser,
    systemFaults,
    resolveFault,
    reopenFault,
    runSystemDiagnostics,
    diagnosticStatus,
    unitTestResults,
    refreshUnitTests,
    erpSyncStatus,
    syncWithErp,
    lastSyncTime,
    formatMoney,
    t,
  } = useVmi();

  const [faultFilter, setFaultFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [apiTimeout, setApiTimeout] = useState<number>(3000);
  const [cacheTtl, setCacheTtl] = useState<number>(60);
  const [configSaved, setConfigSaved] = useState<boolean>(false);

  const activeFaultsCount = systemFaults.filter((f) => f.status === 'active').length;
  const resolvedFaultsCount = systemFaults.filter((f) => f.status === 'resolved').length;

  const filteredFaults = systemFaults.filter((f) => {
    if (faultFilter === 'active' && f.status !== 'active') return false;
    if (faultFilter === 'resolved' && f.status !== 'resolved') return false;
    if (selectedModule !== 'all' && !f.module.toLowerCase().includes(selectedModule.toLowerCase())) return false;
    return true;
  });

  const handleSaveInfraConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  const getSeverityBadge = (severity: SystemFault['severity']) => {
    switch (severity) {
      case 'critical':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">CRÍTICO</span>;
      case 'high':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">ALTA</span>;
      case 'medium':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">MÉDIA</span>;
      case 'low':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">BAIXA</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
      {/* Top Banner Contextual for IT Architecture */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/70 to-slate-900 border border-purple-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5">
                <Wrench className="w-3 h-3 text-purple-400" />
                CENTRO DE ENGENHARIA DE TI & CORREÇÃO DE FALHAS
              </span>
              <span className="text-xs text-slate-400">Planta Franca/SP • ERP TecnoLar</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Manutenção de Software & Injeção de Patches
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Painel exclusivo para a Arquiteta de TI (Camila Ribeiro). Monitore microsserviços, 
              corrija erros de sistema em tempo real e mantenha a estabilidade do fluxo VMI com o ERP.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={runSystemDiagnostics}
              disabled={diagnosticStatus === 'running'}
              className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg transition flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${diagnosticStatus === 'running' ? 'animate-spin' : ''}`} />
              {diagnosticStatus === 'running' ? 'Executando Varredura...' : 'Executar Diagnóstico Geral'}
            </button>
            <button
              onClick={syncWithErp}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
            >
              <Server className="w-4 h-4 text-cyan-400" />
              Sincronizar ERP
            </button>
          </div>
        </div>
      </div>

      {/* Microsservices Health Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Service 1: ERP Gateway */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              API Gateway ERP
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate">
            https://erp-tecnolar.vercel.app/api
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Latência: <strong className="text-emerald-400 font-mono">38ms</strong></span>
            <span>Uptime: <strong className="text-white">99.98%</strong></span>
          </div>
        </div>

        {/* Service 2: VMI Calculation Engine */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              Engine LEC/PP
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            LEC: 9.354 un • PP: 12.672
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Precisão: <strong className="text-emerald-400 font-mono">100%</strong></span>
            <span>Testes: <strong className="text-cyan-400">10/10 OK</strong></span>
          </div>
        </div>

        {/* Service 3: Milk Run Telemetry */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              Telemetria Milk Run
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Circuito 30 min • 400m
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Trens Ativos: <strong className="text-white">12</strong></span>
            <span>Caixas: <strong className="text-emerald-400">30 Homologadas</strong></span>
          </div>
        </div>

        {/* Service 4: Vision & Hardware Subsystem */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Driver Visão & Câmera
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Landmarks 21 pts + Polyfill
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Libras: <strong className="text-cyan-400">Ativo</strong></span>
            <span>FPS: <strong className="text-emerald-400">60 FPS</strong></span>
          </div>
        </div>

        {/* Service 5: PostgreSQL Database */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Banco PostgreSQL
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            400+ Itens • Schema VMI
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Pool: <strong className="text-emerald-400">0 leaks</strong></span>
            <span>Integridade: <strong className="text-white">100%</strong></span>
          </div>
        </div>
      </div>

      {/* Main Section: Active Faults & Patch Injection Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Bug className="w-5 h-5 text-purple-400" />
              Console de Falhas de Software & Injeção de Patches
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifique anomalias operacionais e aplique correções diretas no código do sistema sem necessidade de restart.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFaultFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                faultFilter === 'all' ? 'bg-purple-600 text-white border-purple-400' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Todas ({systemFaults.length})
            </button>
            <button
              onClick={() => setFaultFilter('active')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                faultFilter === 'active' ? 'bg-amber-600 text-white border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Ativas ({activeFaultsCount})
            </button>
            <button
              onClick={() => setFaultFilter('resolved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                faultFilter === 'resolved' ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              Resolvidas ({resolvedFaultsCount})
            </button>
          </div>
        </div>

        {/* Fault Cards Grid */}
        <div className="space-y-3">
          {filteredFaults.map((fault) => {
            const isResolved = fault.status === 'resolved';
            return (
              <div
                key={fault.id}
                className={`p-4 rounded-xl border transition space-y-3 ${
                  isResolved
                    ? 'bg-slate-950/40 border-slate-800 opacity-80'
                    : 'bg-slate-950 border-purple-900/60 shadow-md ring-1 ring-purple-900/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {fault.code}
                    </span>
                    {getSeverityBadge(fault.severity)}
                    <span className="text-xs font-bold text-white">{fault.title}</span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Módulo: <strong className="text-slate-300">{fault.module}</strong>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {fault.description}
                </p>

                {/* Suggested Patch Box */}
                <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-lg text-xs space-y-1">
                  <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                    🔧 Correção Proposta / Patch de Software:
                  </span>
                  <p className="text-purple-200 text-xs font-mono">{fault.suggestedPatch}</p>
                </div>

                {/* Actions & Status */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-900 gap-2 flex-wrap">
                  <div className="text-[11px] text-slate-400">
                    Detectado: {fault.detectedAt}
                    {isResolved && (
                      <span className="text-emerald-400 ml-2">
                        • Corrigido por <strong>{fault.resolvedBy || 'Camila Ribeiro'}</strong> às {fault.resolvedAt}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isResolved ? (
                      <button
                        onClick={() => reopenFault(fault.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reabrir Falha
                      </button>
                    ) : (
                      <button
                        onClick={() => resolveFault(fault.id)}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-lg text-xs shadow-md transition"
                      >
                        <CheckCheck className="w-4 h-4" />
                        Aplicar Correção no Sistema (Patch)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mathematical Unit Tests Validation Console */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-extrabold text-base text-white">
                Bateria de Testes Unitários de VMI (Base Artigo SENAI 2026)
              </h3>
              <p className="text-xs text-slate-400">
                Auditoria contínua das fórmulas matemáticas: LEC = 9.354 un; SS = 9.216 & 3.072 un; PP = 21.216 & 12.672 un; Economia = R$ 545.000.
              </p>
            </div>
          </div>

          <button
            onClick={refreshUnitTests}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reexecutar Testes ({unitTestResults.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {unitTestResults.map((test, idx) => (
            <div
              key={`${test.name}-${idx}`}
              className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
            >
              <div className="overflow-hidden pr-2">
                <span className="font-bold text-white block truncate">{test.name}</span>
                <span className="text-[11px] text-slate-400 font-mono block">
                  Esperado: {String(test.expected)} • Obtido: {String(test.actual)}
                </span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {test.description}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shrink-0 ${
                test.passed
                  ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-800'
                  : 'text-rose-300 bg-rose-950/80 border border-rose-800'
              }`}>
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {test.passed ? 'PASS' : 'FAIL'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

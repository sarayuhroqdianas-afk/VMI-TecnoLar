import React from 'react';
import { FileCheck, ShieldAlert, DollarSign, Calendar, Scale, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useVmi } from '../../context/VmiContext';

export const ContractsView: React.FC = () => {
  const { contracts, formatMoney, currentUser } = useVmi();

  const isSupplier = currentUser.role.startsWith('fornecedor_');
  const visibleContracts = contracts.filter((c) => {
    if (isSupplier && currentUser.supplierId) {
      return c.supplierId === currentUser.supplierId;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              Contratos VMI, Acordos de Nível de Serviço (SLA) & Governança
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              JURÍDICO & COMPLIANCE
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Regras de propriedade do estoque (consignado vs ponto de uso), metas de disponibilidade e penalidades contratuais.
          </p>
        </div>
      </div>

      {/* Contract Cards */}
      <div className="grid grid-cols-1 gap-6">
        {visibleContracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5"
          >
            {/* Top Bar of Contract */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold text-xs">{contract.id.toUpperCase()}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                    {contract.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">{contract.title}</h3>
                <p className="text-xs text-slate-400">Fornecedor Contratado: {contract.supplierName}</p>
              </div>

              <div className="text-right text-xs">
                <span className="text-slate-400 block">Vigência Contratual:</span>
                <span className="font-mono font-bold text-white text-sm">Até {contract.validUntil}</span>
              </div>
            </div>

            {/* SLA Key Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Meta Disponibilidade</span>
                <span className="text-xl font-extrabold text-emerald-400 font-mono">
                  {contract.availabilityTargetPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Nível de serviço na fábrica</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Ruptura Máx. Aceitável</span>
                <span className="text-xl font-extrabold text-rose-400 font-mono">
                  &le; {contract.maxStockoutPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Tolerância operacional</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Faixa de Cobertura</span>
                <span className="text-xl font-extrabold text-cyan-400 font-mono">
                  {contract.coverageBandDaysMin} a {contract.coverageBandDaysMax} dias
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Buffer de segurança</span>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Propriedade do Estoque</span>
                <span className="text-sm font-extrabold text-white block capitalize mt-1">
                  {contract.inventoryOwnership.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-500 block">Faturamento puxado pelo ERP</span>
              </div>
            </div>

            {/* Penalties & Liability Clauses (Article Context) */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <h4 className="font-bold text-white text-xs">Cláusulas de Responsabilidade Financeira por Ruptura e Excesso</h4>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">{contract.liabilityTerms}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900">
                <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Penalidade por Hora de Linha Parada:</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">{formatMoney(contract.penaltyPerHourDowntime)}/h</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-900/60 rounded-lg border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Multa Short-Shipment (Entregas Incompletas):</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{formatMoney(contract.shortShipmentFine)}</span>
                </div>
              </div>
            </div>

            {/* Legal Status Footer */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800 gap-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Assinado digitalmente via ICP-Brasil • Válido para o exercício 2026/2027
              </span>
              <span className="font-mono text-[11px] text-slate-500">Hash SHA-256: 7f8a9e01...b2c3d4</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

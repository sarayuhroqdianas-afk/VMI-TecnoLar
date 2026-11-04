import React, { useState } from 'react';
import {
  Users,
  Globe,
  MapPin,
  Phone,
  Mail,
  Award,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  TrendingUp,
  Search,
  ExternalLink,
  FileCheck,
} from 'lucide-react';
import { useVmi } from '../../context/VmiContext';
import { Supplier } from '../../types';

export const SuppliersView: React.FC = () => {
  const { suppliers, contracts, setSelectedContractForModal, requestPermission, permissions } = useVmi();
  const [selectedType, setSelectedType] = useState<'all' | 'nacional' | 'internacional'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSupplierForActionPlan, setSelectedSupplierForActionPlan] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter((s) => {
    if (selectedType !== 'all' && s.type !== selectedType) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(term) ||
        s.tradeName.toLowerCase().includes(term) ||
        s.city.toLowerCase().includes(term) ||
        s.country.toLowerCase().includes(term) ||
        s.contactName.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const handleCallContact = async (phone: string) => {
    await requestPermission('contacts');
    window.open(`tel:${phone.replace(/\D/g, '')}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              Gestão de Fornecedores & Scorecard OTIF Mensal
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
              PESOS OFICIAIS DO ARTIGO (IMAGEM 5)
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Avaliação de fornecedores nacionais e internacionais baseada em desempenho logístico, qualidade e lead time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar fornecedor, cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs text-white pl-8 pr-3 py-1.5 rounded-xl outline-none focus:border-cyan-500 placeholder:text-slate-500 w-48 sm:w-56"
            />
          </div>
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              selectedType === 'all'
                ? 'bg-cyan-600 text-white border-cyan-400'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Todos ({suppliers.length})
          </button>
          <button
            onClick={() => setSelectedType('nacional')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              selectedType === 'nacional'
                ? 'bg-cyan-600 text-white border-cyan-400'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Nacionais ({suppliers.filter((s) => s.type === 'nacional').length})
          </button>
          <button
            onClick={() => setSelectedType('internacional')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              selectedType === 'internacional'
                ? 'bg-cyan-600 text-white border-cyan-400'
                : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            Internacionais ({suppliers.filter((s) => s.type === 'internacional').length})
          </button>
        </div>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSuppliers.map((sup) => {
          const isUnderTarget = sup.scoreCard.otif < sup.scoreCard.targetOtif;
          return (
            <div
              key={sup.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition"
            >
              {/* Header Card */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">{sup.tradeName}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        sup.type === 'nacional'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}
                    >
                      {sup.type}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-300 bg-slate-800 px-2 py-0.5 rounded">
                      Classe {sup.scoreCard.classification}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{sup.name}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">ID Fiscal: {sup.taxId}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Score Global:</span>
                  <span className="text-xl font-extrabold text-cyan-400 font-mono">
                    {sup.scoreCard.totalScore}
                  </span>
                  <span className="text-[10px] text-slate-500 block">/ 100</span>
                </div>
              </div>

              {/* Location & Contact Info */}
              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="line-clamp-1">{sup.address} ({sup.city} - {sup.state}, {sup.country})</span>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-900">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Contato: <strong>{sup.contactName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCallContact(sup.contactPhone)}
                      className="flex items-center gap-1 text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg transition"
                      title="Ligar para o fornecedor"
                    >
                      <Phone className="w-3 h-3" />
                      {sup.contactPhone}
                    </button>
                    <a
                      href={`mailto:${sup.contactEmail}`}
                      className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                      title="Enviar email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 6 Criteria Scorecard from the Academic Article */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-300">Scorecard Mensal de Desempenho (6 Critérios):</span>
                  <span className="text-[10px] text-slate-500">Ponderação Oficial</span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Criterion 1: OTIF (35%) */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-300 font-medium">1. OTIF On-Time In-Full (Peso 35%):</span>
                      <span
                        className={`font-mono font-bold ${
                          isUnderTarget ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {sup.scoreCard.otif}% (Meta: {sup.scoreCard.targetOtif}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isUnderTarget ? 'bg-rose-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${sup.scoreCard.otif}%` }}
                      />
                    </div>
                  </div>

                  {/* Criterion 2: Qualidade (20%) */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-300 font-medium">2. Qualidade / Conformidade (Peso 20%):</span>
                      <span className="font-mono font-bold text-cyan-400">{sup.scoreCard.quality}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${sup.scoreCard.quality}%` }} />
                    </div>
                  </div>

                  {/* Criterion 3: Lead Time (15%) */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-300 font-medium">3. Lead Time & Cumprimento de Prazo (Peso 15%):</span>
                      <span className="font-mono font-bold text-slate-200">{sup.scoreCard.leadTimeScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${sup.scoreCard.leadTimeScore}%` }} />
                    </div>
                  </div>

                  {/* Criterion 4: Custo Total (15%) */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-300 font-medium">4. Preço & Custo Total Operacional (Peso 15%):</span>
                      <span className="font-mono font-bold text-slate-200">{sup.scoreCard.totalCostScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${sup.scoreCard.totalCostScore}%` }} />
                    </div>
                  </div>

                  {/* Criterion 5: Flexibilidade (10%) & Doc (5%) */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                    <span>Flexibilidade (10%): <strong className="text-white">{sup.scoreCard.flexibility}%</strong></span>
                    <span>Documentação/Atend. (5%): <strong className="text-white">{sup.scoreCard.docScore}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Plan Trigger if OTIF < 96% */}
              {isUnderTarget && (
                <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold text-rose-300 block">
                        OTIF abaixo da meta de 96% para A-Críticos
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Obrigatório plano de ação 5W2H conforme seção 3.1.4 do artigo.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSupplierForActionPlan(sup)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    Ver 5W2H
                  </button>
                </div>
              )}

              {/* Legal VMI Contract Trigger */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-2 flex-wrap">
                <div className="text-[11px] text-slate-400">
                  Instrumento: <strong className="text-white font-mono">{contracts.find((c) => c.supplierId === sup.id)?.id || 'VMI-PADRAO-2026'}</strong>
                </div>
                <button
                  onClick={() => {
                    const contract = contracts.find((c) => c.supplierId === sup.id) || contracts[0];
                    setSelectedContractForModal(contract);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 border border-emerald-700/80 hover:bg-emerald-900 text-emerald-300 hover:text-white rounded-xl text-xs font-semibold transition"
                  title="Visualizar Contrato Jurídico VMI & SLA"
                >
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Visualizar Contrato VMI
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5W2H Action Plan Modal */}
      {selectedSupplierForActionPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-base text-white">
                    Plano de Ação 5W2H • Reestruturação de Fornecedor
                  </h3>
                  <p className="text-xs text-slate-400">
                    Fornecedor: {selectedSupplierForActionPlan.name} • OTIF Atual: {selectedSupplierForActionPlan.scoreCard.otif}% (Meta: 96%)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupplierForActionPlan(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* 5W2H Table from the Article (Imagem 8) */}
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border border-slate-800">
                <thead>
                  <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-bold">
                    <th className="p-2">O quê? (What)</th>
                    <th className="p-2">Por quê? (Why)</th>
                    <th className="p-2">Onde? (Where)</th>
                    <th className="p-2">Quando? (When)</th>
                    <th className="p-2">Quem? (Who)</th>
                    <th className="p-2">Como? (How)</th>
                    <th className="p-2 text-right">Quanto? (Cost)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px] text-slate-300">
                  <tr>
                    <td className="p-2 font-semibold text-white">Revisar as políticas de estoque</td>
                    <td className="p-2">Evitar a falta de matérias-primas plásticas</td>
                    <td className="p-2">Almoxarifado & Compras</td>
                    <td className="p-2">1º mês</td>
                    <td className="p-2 text-cyan-400">Mariana Costa</td>
                    <td className="p-2">Recalcular ponto de pedido, estoque de segurança e LEC</td>
                    <td className="p-2 text-right font-mono text-emerald-400">R$ 8.000</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-white">Implantar avaliação de fornecedores por OTIF</td>
                    <td className="p-2">Reduzir atrasos e entregas incompletas</td>
                    <td className="p-2">Departamento de Compras</td>
                    <td className="p-2">2º mês</td>
                    <td className="p-2 text-cyan-400">Rafael Oliveira</td>
                    <td className="p-2">Monitorar mensalmente entregas no prazo e classificar fornecedores</td>
                    <td className="p-2 text-right font-mono text-emerald-400">R$ 3.000</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-white">Implantar Milk Run interno</td>
                    <td className="p-2">Agilizar o abastecimento da linha de montagem</td>
                    <td className="p-2">Almoxarifado e Produção</td>
                    <td className="p-2">2º mês</td>
                    <td className="p-2 text-cyan-400">Lucas Ferreira</td>
                    <td className="p-2">Estabelecer rotas e horários fixos de abastecimento a cada 30 min</td>
                    <td className="p-2 text-right font-mono text-emerald-400">R$ 12.000</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-white">Integrar informações pelo S&OP</td>
                    <td className="p-2">Alinhar vendas, produção, compras e logística</td>
                    <td className="p-2">Todos os setores</td>
                    <td className="p-2">3º mês</td>
                    <td className="p-2 text-cyan-400">Fernanda Almeida</td>
                    <td className="p-2">Realizar reuniões mensais e revisões semanais de itens críticos</td>
                    <td className="p-2 text-right font-mono text-emerald-400">R$ 5.000</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-white">Implantar controle digital de estoque</td>
                    <td className="p-2">Evitar divergências entre físico e sistema</td>
                    <td className="p-2">Almoxarifado e Produção</td>
                    <td className="p-2">2º ao 3º mês</td>
                    <td className="p-2 text-cyan-400">Gabriel Santos</td>
                    <td className="p-2">Registrar movimentações em tempo real por leitor de código de barras</td>
                    <td className="p-2 text-right font-mono text-emerald-400">R$ 10.000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-400">
                Total estimado do plano: <strong className="text-white font-mono">R$ 38.000,00</strong> • Retorno estimado: R$ 545.000/trimestre
              </span>
              <button
                onClick={() => setSelectedSupplierForActionPlan(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

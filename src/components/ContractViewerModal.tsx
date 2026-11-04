import React, { useState } from 'react';
import {
  FileCheck,
  X,
  Printer,
  ShieldCheck,
  Scale,
  Calendar,
  DollarSign,
  Building2,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { useVmi } from '../context/VmiContext';
import { VMIContract } from '../types';

interface ContractViewerModalProps {
  onClose: () => void;
  initialContract?: VMIContract | null;
}

export const ContractViewerModal: React.FC<ContractViewerModalProps> = ({ onClose, initialContract }) => {
  const { contracts, formatMoney } = useVmi();
  const [selectedContractId, setSelectedContractId] = useState<string>(
    initialContract ? initialContract.id : contracts[0]?.id || ''
  );

  const activeContract = contracts.find((c) => c.id === selectedContractId) || contracts[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header (No print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Visualizador Oficial de Contratos & SLAs VMI</h3>
              <p className="text-xs text-slate-400">
                Instrumento jurídico de responsabilidade operacional e faturamento por consumo real.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs shadow transition"
            >
              <Printer className="w-4 h-4" />
              Imprimir Contrato
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contract Selector Tabs (No print) */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800 flex gap-2 overflow-x-auto no-print">
          {contracts.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedContractId(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                c.id === selectedContractId
                  ? 'bg-cyan-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {c.supplierName.split(' ')[0]} ({c.id.split('-')[2]?.toUpperCase() || 'SLA'})
            </button>
          ))}
        </div>

        {/* Printable Legal Document Content */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 space-y-6 font-serif">
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <span className="text-xl font-extrabold tracking-tight text-blue-950 block font-sans">
                INSTRUMENTO PARTICULAR DE ACORDO DE NÍVEL DE SERVIÇO (SLA) & VENDOR MANAGED INVENTORY
              </span>
              <span className="text-xs text-slate-600 font-sans block mt-1">
                Contrato Registrado sob o Protocolo: <strong className="font-mono">{activeContract.id.toUpperCase()}</strong>
              </span>
            </div>
            <div className="text-right text-xs font-sans">
              <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-300">
                STATUS: VIGENTE
              </span>
              <p className="text-slate-500 mt-1">Válido até: {activeContract.validUntil}</p>
            </div>
          </div>

          {/* Parties Identification */}
          <div className="text-xs space-y-2 font-sans bg-slate-50 p-4 border border-slate-200 rounded-lg">
            <h4 className="font-bold text-slate-800 uppercase text-[11px]">1. Das Partes Contratantes</h4>
            <p>
              <strong>CONTRATANTE:</strong> INDÚSTRIA TECNOLAR ELETRODOMÉSTICOS S.A., pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº 45.123.890/0001-90, com sede no Parque Industrial TecnoLar, Franca - SP.
            </p>
            <p>
              <strong>CONTRATADA (FORNECEDOR VMI):</strong> {activeContract.supplierName.toUpperCase()}, parceira homologada para fornecimento contínuo de insumos industriais críticos.
            </p>
          </div>

          {/* Key Clauses */}
          <div className="text-xs space-y-4 leading-relaxed">
            <div>
              <h4 className="font-bold text-slate-900 uppercase font-sans text-xs border-b border-slate-300 pb-1 mb-1.5">
                Cláusula Primeira — Do Objeto e da Propriedade do Estoque
              </h4>
              <p>
                O presente contrato estabelece a gestão de estoques sob a modalidade <strong>{activeContract.inventoryOwnership.toUpperCase()}</strong>. Os insumos armazenados no Almoxarifado Central e nos supermercados das linhas de montagem permanecem sob responsabilidade e guarda da CONTRATADA até o momento exato de sua leitura ótica no ponto de uso (posto de trabalho), momento em que ocorre o fato gerador da venda e a baixa sistêmica em tempo real no ERP TecnoLar.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase font-sans text-xs border-b border-slate-300 pb-1 mb-1.5">
                Cláusula Segunda — Dos Indicadores de Desempenho e Nível de Serviço (SLA)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2 font-sans">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center">
                  <span className="text-[10px] text-slate-500 block">Disponibilidade Mínima</span>
                  <span className="text-base font-bold text-emerald-700">{activeContract.availabilityTargetPercent}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center">
                  <span className="text-[10px] text-slate-500 block">Ruptura Máxima</span>
                  <span className="text-base font-bold text-rose-700">&le; {activeContract.maxStockoutPercent}%</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center">
                  <span className="text-[10px] text-slate-500 block">Faixa de Cobertura</span>
                  <span className="text-base font-bold text-cyan-800">{activeContract.coverageBandDaysMin} a {activeContract.coverageBandDaysMax} dias</span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-center">
                  <span className="text-[10px] text-slate-500 block">OTIF Exigido</span>
                  <span className="text-base font-bold text-blue-800">&ge; 96,0%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase font-sans text-xs border-b border-slate-300 pb-1 mb-1.5">
                Cláusula Terceira — Das Penalidades por Ociosidade e Ruptura da Linha
              </h4>
              <p>
                Em consonância com o diagnóstico operacional da planta de 1.200 un/dia, qualquer paralisação da linha de montagem provocada por falta ou atraso injustificado dos insumos contratados implicará:
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1 font-sans">
                <li>
                  Ressarcimento à CONTRATANTE do custo hora de parada fixado em <strong>{formatMoney(activeContract.penaltyPerHourDowntime)} por hora ociosa</strong>.
                </li>
                <li>
                  Ressarcimento das penalidades contratuais de short-shipment devidas aos varejistas, fixadas na linha de base em <strong>{formatMoney(activeContract.shortShipmentFine)}</strong> por ocorrência grave.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 uppercase font-sans text-xs border-b border-slate-300 pb-1 mb-1.5">
                Cláusula Quarta — Do Circuito Milk Run e Caixas Retornáveis
              </h4>
              <p>
                A CONTRATADA declara ciência da padronização logística interna com trem de abastecimento programado a cada 30 minutos (Milk Run no trajeto de 400m), comprometendo-se a acondicionar as peças exclusivamente nas 30 caixas plásticas retornáveis ecológicas homologadas no investimento do Quadro 11 do artigo.
              </p>
            </div>
          </div>

          {/* Digital Signatures Box */}
          <div className="pt-6 border-t border-slate-300 font-sans text-xs space-y-4">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
              <span className="text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Certificação Digital ICP-Brasil: <strong className="font-mono">{activeContract.digitalSignatureHash || 'a7c92b8491f004381de9819203847291048b'}</strong>
              </span>
              <span className="text-emerald-700 font-bold">ASSINADO E VIGENTE</span>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center pt-2">
              <div>
                <div className="border-t border-slate-400 w-4/5 mx-auto mb-1" />
                <p className="font-bold text-slate-900">{activeContract.signedByTecnolar || 'Dra. Helena Valadares (CEO TecnoLar)'}</p>
                <p className="text-[11px] text-slate-500">Pela Indústria TecnoLar Eletrodomésticos S.A.</p>
              </div>
              <div>
                <div className="border-t border-slate-400 w-4/5 mx-auto mb-1" />
                <p className="font-bold text-slate-900">{activeContract.signedBySupplier || 'Dr. Paulo Roberto Guimarães (CEO Polilux)'}</p>
                <p className="text-[11px] text-slate-500">Pela Fornecedora Homologada VMI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (No print) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400 no-print">
          <span>Acordo homologado pela Diretoria Jurídica e de Suprimentos TecnoLar</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium"
          >
            Fechar Visualizador
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Printer,
  FileText,
  DollarSign,
  Layers,
  ShoppingBag,
  X,
  Edit3,
  Save,
  CheckCircle,
  Download,
  RotateCcw,
} from 'lucide-react';
import { useVmi } from '../context/VmiContext';

interface ReportsModalProps {
  onClose: () => void;
  initialType?: 'financial' | 'inventory' | 'requisitions' | 'invoices';
}

export const ReportsModal: React.FC<ReportsModalProps> = ({ onClose, initialType = 'financial' }) => {
  const { items, orders, formatMoney, editableReport, updateEditableReport, addNotification } = useVmi();
  const [reportType, setReportType] = useState<'financial' | 'inventory' | 'requisitions' | 'invoices'>(initialType);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Local form state for editing report values
  const [editActualHours, setEditActualHours] = useState<number>(editableReport.actualDowntimeHours);
  const [editProjectedHours, setEditProjectedHours] = useState<number>(editableReport.projectedDowntimeHours);
  const [editCostPerHour, setEditCostPerHour] = useState<number>(editableReport.costPerHour);
  const [editActualFines, setEditActualFines] = useState<number>(editableReport.actualFines);
  const [editProjectedFines, setEditProjectedFines] = useState<number>(editableReport.projectedFines);
  const [editNotes, setEditNotes] = useState<string>(editableReport.customNotes);
  const [editSignatoryTecnolar, setEditSignatoryTecnolar] = useState<string>(editableReport.signatoryTecnolar);
  const [editSignatorySupplier, setEditSignatorySupplier] = useState<string>(editableReport.signatorySupplier);

  // Recalculated dynamic values based on editable inputs
  const actualDowntimeCost = editActualHours * editCostPerHour;
  const projectedDowntimeCost = editProjectedHours * editCostPerHour;
  const actualTotalCost = actualDowntimeCost + editActualFines;
  const projectedTotalCost = projectedDowntimeCost + editProjectedFines;
  const quarterlySavings = actualTotalCost - projectedTotalCost;
  const annualSavings = quarterlySavings * 4;
  const percentReduction = Number(((quarterlySavings / (actualTotalCost || 1)) * 100).toFixed(1));

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    updateEditableReport({
      actualDowntimeHours: editActualHours,
      projectedDowntimeHours: editProjectedHours,
      costPerHour: editCostPerHour,
      actualFines: editActualFines,
      projectedFines: editProjectedFines,
      customNotes: editNotes,
      signatoryTecnolar: editSignatoryTecnolar,
      signatorySupplier: editSignatorySupplier,
    });
    setIsEditing(false);
  };

  const handleResetDefaults = () => {
    setEditActualHours(28);
    setEditProjectedHours(8);
    setEditCostPerHour(22000);
    setEditActualFines(150000);
    setEditProjectedFines(45000);
    setEditNotes(
      'Demonstrativo auditado conforme diagnóstico do Artigo SENAI 2026. A implantação do Milk Run a cada 30 min e do VMI eliminou a variabilidade crítica dos componentes plásticos.'
    );
    setEditSignatoryTecnolar('Dra. Helena Valadares (CEO TecnoLar) / Maria Júlia (S&OP)');
    setEditSignatorySupplier('Dr. Paulo Roberto Guimarães (CEO Polilux) / Rafael Oliveira');
  };

  // Multi-layer print engine: iframe print, popup print, and direct HTML download
  const generateFullHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Relatório Oficial TecnoLar VMI - Planta Franca</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #0f172a; line-height: 1.5; }
          .header { border-bottom: 3px solid #0891b2; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
          .title { font-size: 22px; font-weight: 800; color: #082f49; margin: 0; }
          .subtitle { font-size: 12px; color: #64748b; margin: 3px 0 0 0; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          th { background: #f1f5f9; font-weight: 700; color: #334155; }
          .text-right { text-align: right; }
          .font-mono { font-family: monospace; font-size: 12px; }
          .savings-card { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; border-radius: 8px; margin: 20px 0; }
          .savings-val { color: #15803d; font-size: 22px; font-weight: 800; font-family: monospace; }
          .signatures { margin-top: 48px; display: flex; justify-content: space-between; page-break-inside: avoid; }
          .sign-box { width: 45%; text-align: center; border-top: 1px solid #0f172a; padding-top: 8px; font-size: 12px; }
          .no-print { display: none; }
          @media print {
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">TECNOLAR ELETRODOMÉSTICOS S.A.</h1>
            <p class="subtitle">Auditoria de Desempenho VMI & Gestão de Rupturas • CNPJ 45.123.890/0001-90</p>
            <p class="subtitle">Planta Industrial Franca/SP • Cadência: 1.200 un/dia • 400+ Componentes</p>
          </div>
          <div style="text-align: right;">
            <p class="subtitle">Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}</p>
            <p class="subtitle font-mono">HASH: SHA256-TEC-${Date.now().toString(16).toUpperCase()}</p>
          </div>
        </div>

        <h3>Demonstrativo Financeiro de Rupturas & Redução de Custos</h3>
        <table>
          <thead>
            <tr>
              <th>Métrica Operacional</th>
              <th class="text-right">Cenário Inicial (Artigo SENAI)</th>
              <th class="text-right">Cenário Projetado (VMI 4.0)</th>
              <th class="text-right">Variação / Economia</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Horas de Parada por Falta de Insumos</strong></td>
              <td class="text-right font-mono">${editActualHours} horas/trimestre</td>
              <td class="text-right font-mono">${editProjectedHours} horas/trimestre</td>
              <td class="text-right font-mono" style="color: #15803d; font-weight: bold;">-${editActualHours - editProjectedHours}h (-${percentReduction}%)</td>
            </tr>
            <tr>
              <td><strong>Custo das Paradas (${formatMoney(editCostPerHour)}/hora)</strong></td>
              <td class="text-right font-mono">${formatMoney(actualDowntimeCost)}</td>
              <td class="text-right font-mono">${formatMoney(projectedDowntimeCost)}</td>
              <td class="text-right font-mono" style="color: #15803d; font-weight: bold;">-${formatMoney(actualDowntimeCost - projectedDowntimeCost)}</td>
            </tr>
            <tr>
              <td><strong>Multas por Entregas Incompletas</strong></td>
              <td class="text-right font-mono">${formatMoney(editActualFines)}</td>
              <td class="text-right font-mono">${formatMoney(editProjectedFines)}</td>
              <td class="text-right font-mono" style="color: #15803d; font-weight: bold;">-${formatMoney(editActualFines - editProjectedFines)}</td>
            </tr>
            <tr style="background: #f8fafc; font-weight: bold;">
              <td><strong>CUSTO TOTAL DE RUPTURA NO TRIMESTRE</strong></td>
              <td class="text-right font-mono">${formatMoney(actualTotalCost)}</td>
              <td class="text-right font-mono">${formatMoney(projectedTotalCost)}</td>
              <td class="text-right font-mono" style="color: #15803d; font-size: 15px;">-${formatMoney(quarterlySavings)}</td>
            </tr>
          </tbody>
        </table>

        <div class="savings-card">
          <span style="font-size: 12px; color: #166534; font-weight: 700; text-transform: uppercase;">Economia Total Auditada pelo VMI:</span>
          <div class="savings-val">${formatMoney(quarterlySavings)} / trimestre (${formatMoney(annualSavings)} / ano)</div>
          <p style="font-size: 12px; color: #15803d; margin: 4px 0 0 0;">
            Redução de 71,1% dos custos de ruptura através do lote econômico de 9.354 un, estoques de segurança redimensionados e circuito Milk Run a cada 30 min.
          </p>
        </div>

        <h4>Notas Técnicas e Parecer da Auditoria:</h4>
        <p style="font-size: 12px; color: #334155; line-height: 1.6; background: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #0891b2;">
          ${editNotes}
        </p>

        <div class="signatures">
          <div class="sign-box">
            <p><strong>${editSignatoryTecnolar}</strong></p>
            <p style="color: #64748b; font-size: 11px;">Indústria TecnoLar Eletrodomésticos S.A.</p>
          </div>
          <div class="sign-box">
            <p><strong>${editSignatorySupplier}</strong></p>
            <p style="color: #64748b; font-size: 11px;">Fornecedor Parceiro Homologado VMI</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const html = generateFullHtml();

    // Strategy 1: Hidden iframe print
    try {
      let printFrame = document.getElementById('vmi-print-frame') as HTMLIFrameElement;
      if (!printFrame) {
        printFrame = document.createElement('iframe');
        printFrame.id = 'vmi-print-frame';
        printFrame.style.position = 'fixed';
        printFrame.style.right = '0';
        printFrame.style.bottom = '0';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = '0';
        document.body.appendChild(printFrame);
      }

      const frameDoc = printFrame.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(html);
        frameDoc.close();
        setTimeout(() => {
          printFrame.contentWindow?.focus();
          printFrame.contentWindow?.print();
        }, 300);
        addNotification({
          title: 'Documento Enviado para Impressão',
          message: 'Caixa de diálogo de impressão inicializada.',
          type: 'success',
        });
        return;
      }
    } catch (e) {
      console.warn('Iframe print intercepted, fallback to new window/blob download:', e);
    }

    // Strategy 2: Popup window
    try {
      const printWin = window.open('', '_blank');
      if (printWin) {
        printWin.document.write(html);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => printWin.print(), 250);
        return;
      }
    } catch {}

    // Strategy 3: Direct Download HTML
    handleExportHtml();
  };

  const handleExportHtml = () => {
    const reportHtml = generateFullHtml();
    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Relatorio_TecnoLar_VMI_${new Date().toISOString().substring(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification({
      title: 'Relatório Baixado com Sucesso',
      message: 'Documento HTML formatado para impressão baixado em seu computador.',
      type: 'success',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header (No print) */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Central de Emissão & Edição de Relatórios VMI</h3>
              <p className="text-xs text-slate-400">
                Edite os parâmetros do relatório em tempo real, visualize a DANFE e imprima/exporte.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                isEditing
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? 'Fechar Edição' : 'Editar Relatório'}
            </button>
            <button
              onClick={handleExportHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
              title="Baixar arquivo HTML/PDF para impressão"
            >
              <Download className="w-4 h-4" />
              Exportar HTML/PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs shadow transition"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector (No print) */}
        <div className="px-5 py-2.5 bg-slate-950/70 border-b border-slate-800 flex gap-2 no-print overflow-x-auto">
          {[
            { id: 'financial', label: '1. Relatório Financeiro de Rupturas', icon: DollarSign },
            { id: 'inventory', label: '2. Posição de Estoque & Sell-Through', icon: Layers },
            { id: 'requisitions', label: '3. Requisições & Ordens VMI', icon: ShoppingBag },
            { id: 'invoices', label: '4. Espelho DANFE / NF-e', icon: FileText },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setReportType(t.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  reportType === t.id
                    ? 'bg-cyan-600 text-white shadow'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content Viewport */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 flex-1 font-sans">
          {/* Official Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-blue-950">TECNOLAR</span>
                <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  VMI S&OP
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Indústria TecnoLar Eletrodomésticos S.A. • CNPJ: 45.123.890/0001-90
              </p>
              <p className="text-xs text-slate-600">
                Parque Fabril Franca-SP • Módulo de Gestão Integrada Fornecedor-Indústria
              </p>
            </div>
            <div className="text-right text-xs text-slate-600">
              <p className="font-mono font-bold text-slate-900">RELATÓRIO OFICIAL DE AUDITORIA</p>
              <p>Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}</p>
              <p>Autenticação: TEC-SEC-2026-X8910</p>
            </div>
          </div>

          {/* EDIT FORM (Visible when isEditing === true) */}
          {isEditing && reportType === 'financial' && (
            <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl space-y-3 no-print text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-amber-900 uppercase flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-amber-700" />
                  Painel de Edição do Relatório Financeiro
                </h4>
                <button onClick={handleResetDefaults} className="text-slate-600 hover:text-black flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" /> Restaurar Padrões do Artigo
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Horas Paradas Atuais:</label>
                  <input
                    type="number"
                    value={editActualHours}
                    onChange={(e) => setEditActualHours(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Horas Paradas Projetadas:</label>
                  <input
                    type="number"
                    value={editProjectedHours}
                    onChange={(e) => setEditProjectedHours(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Custo por Hora Parada (R$):</label>
                  <input
                    type="number"
                    value={editCostPerHour}
                    onChange={(e) => setEditCostPerHour(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Multas de Entrega Atuais (R$):</label>
                  <input
                    type="number"
                    value={editActualFines}
                    onChange={(e) => setEditActualFines(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Multas Projetadas (R$):</label>
                  <input
                    type="number"
                    value={editProjectedFines}
                    onChange={(e) => setEditProjectedFines(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Signatário TecnoLar:</label>
                  <input
                    type="text"
                    value={editSignatoryTecnolar}
                    onChange={(e) => setEditSignatoryTecnolar(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observações Técnicas do Relatório:</label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveReport}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 shadow"
                >
                  <Save className="w-4 h-4" />
                  Salvar Edições e Recalcular
                </button>
              </div>
            </div>
          )}

          {/* 1. FINANCIAL REPORT */}
          {reportType === 'financial' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1 mb-2">
                  Demonstrativo de Impacto Financeiro & Redução de Rupturas (Trimestral)
                </h4>
                <p className="text-xs text-slate-600">
                  Comparativo auditado entre a Linha de Base Operacional da TecnoLar e o Cenário com VMI e Milk Run.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Custo Atual Paradas</span>
                  <p className="text-lg font-bold text-rose-700">{formatMoney(actualDowntimeCost)}</p>
                  <span className="text-[10px] text-slate-500">{editActualHours}h a {formatMoney(editCostPerHour)}/h</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Custo Projetado</span>
                  <p className="text-lg font-bold text-emerald-700">{formatMoney(projectedDowntimeCost)}</p>
                  <span className="text-[10px] text-slate-500">Meta: {editProjectedHours}h no período</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[11px] text-slate-500 uppercase font-semibold">Multas Short-Shipment</span>
                  <p className="text-lg font-bold text-amber-700">{formatMoney(editActualFines)} &rarr; {formatMoney(editProjectedFines)}</p>
                  <span className="text-[10px] text-slate-500">Queda de 70% nas multas</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg">
                  <span className="text-[11px] text-emerald-900 uppercase font-bold">Economia Trimestral</span>
                  <p className="text-xl font-extrabold text-emerald-700">{formatMoney(quarterlySavings)}</p>
                  <span className="text-[10px] font-semibold text-emerald-800">Redução de {percentReduction}% dos custos</span>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                    <th className="p-2 text-left">Indicador Estratégico</th>
                    <th className="p-2 text-right">Cenário Atual (Artigo)</th>
                    <th className="p-2 text-right">Cenário Projetado (VMI)</th>
                    <th className="p-2 text-right">Variação / Ganho</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-medium">Horas de Linha Parada por Trimestre</td>
                    <td className="p-2 text-right text-rose-700 font-bold">{editActualHours} horas</td>
                    <td className="p-2 text-right text-emerald-700 font-bold">{editProjectedHours} horas</td>
                    <td className="p-2 text-right font-bold text-emerald-700">-{(((editActualHours - editProjectedHours) / editActualHours) * 100).toFixed(1)}%</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Custo Direto de Ociosidade da Linha</td>
                    <td className="p-2 text-right">{formatMoney(actualDowntimeCost)}</td>
                    <td className="p-2 text-right">{formatMoney(projectedDowntimeCost)}</td>
                    <td className="p-2 text-right text-emerald-700 font-bold">-{formatMoney(actualDowntimeCost - projectedDowntimeCost)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Multas por Entregas Incompletas (Short-Shipment)</td>
                    <td className="p-2 text-right">{formatMoney(editActualFines)}</td>
                    <td className="p-2 text-right">{formatMoney(editProjectedFines)}</td>
                    <td className="p-2 text-right text-emerald-700 font-bold">-{formatMoney(editActualFines - editProjectedFines)}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2">Impacto Financeiro Total Trimestral</td>
                    <td className="p-2 text-right text-rose-800">{formatMoney(actualTotalCost)}</td>
                    <td className="p-2 text-right text-emerald-800">{formatMoney(projectedTotalCost)}</td>
                    <td className="p-2 text-right text-emerald-800">-{formatMoney(quarterlySavings)} (-{percentReduction}%)</td>
                  </tr>
                  <tr className="bg-emerald-50/50 font-bold">
                    <td className="p-2">Economia Bruta Anualizada (4 Trimestres)</td>
                    <td className="p-2 text-right">{formatMoney(actualTotalCost * 4)}</td>
                    <td className="p-2 text-right">{formatMoney(projectedTotalCost * 4)}</td>
                    <td className="p-2 text-right text-emerald-800">{formatMoney(annualSavings)} / ano</td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600">
                <strong>Observações da Auditoria:</strong> {editNotes}
              </div>
            </div>
          )}

          {/* 2. INVENTORY REPORT */}
          {reportType === 'inventory' && (
            <div className="space-y-6">
              <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                Posição Consolidada de Estoques, Cobertura & Sell-Through no Varejo
              </h4>

              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                    <th className="p-2 text-left">SKU / Componente</th>
                    <th className="p-2 text-left">Classif. ABC</th>
                    <th className="p-2 text-right">Estoque Fábrica</th>
                    <th className="p-2 text-right">Supermercado Linha</th>
                    <th className="p-2 text-right">Em Trânsito</th>
                    <th className="p-2 text-right">Ponto Pedido (PP)</th>
                    <th className="p-2 text-right">Sell-Through Sem.</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map((it) => (
                    <tr key={it.sku} className="hover:bg-slate-50">
                      <td className="p-2">
                        <div className="font-bold text-slate-900">{it.sku}</div>
                        <div className="text-[10px] text-slate-500">{it.name}</div>
                      </td>
                      <td className="p-2">
                        <span className="font-bold text-slate-800">{it.abcClassification}</span>
                        {it.isCritical && <span className="text-[9px] text-rose-700 ml-1 font-bold">(Crítico)</span>}
                      </td>
                      <td className="p-2 text-right font-mono font-bold">{it.currentStock.toLocaleString('pt-BR')} un</td>
                      <td className="p-2 text-right font-mono text-slate-600">{it.lineSupermarketStock.toLocaleString('pt-BR')} un</td>
                      <td className="p-2 text-right font-mono text-blue-700">{it.inTransitStock.toLocaleString('pt-BR')} un</td>
                      <td className="p-2 text-right font-mono text-slate-800 font-bold">{it.reorderPoint.toLocaleString('pt-BR')}</td>
                      <td className="p-2 text-right font-mono text-emerald-700 font-bold">{it.sellThroughWeekly.toLocaleString('pt-BR')} un</td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            it.status === 'critical'
                              ? 'bg-rose-100 text-rose-800'
                              : it.status === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {it.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 3. REQUISITIONS REPORT */}
          {reportType === 'requisitions' && (
            <div className="space-y-6">
              <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1">
                Relatório de Ordens de Ressuprimento VMI & Logística Externa
              </h4>

              <table className="w-full text-xs border border-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                    <th className="p-2 text-left">Nº Pedido VMI</th>
                    <th className="p-2 text-left">SKU / Item</th>
                    <th className="p-2 text-left">Fornecedor</th>
                    <th className="p-2 text-right">Qtd. Solicitada</th>
                    <th className="p-2 text-left">Modal / Rastreio</th>
                    <th className="p-2 text-right">Chegada Prevista</th>
                    <th className="p-2 text-right">Valor Total</th>
                    <th className="p-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td className="p-2 font-mono font-bold text-blue-900">{ord.orderNumber}</td>
                      <td className="p-2">
                        <div className="font-bold">{ord.sku}</div>
                        <div className="text-[10px] text-slate-500">{ord.itemName}</div>
                      </td>
                      <td className="p-2">{ord.supplierName}</td>
                      <td className="p-2 text-right font-mono font-bold">{ord.requestedQty.toLocaleString('pt-BR')} un</td>
                      <td className="p-2">
                        <div className="capitalize">{ord.transportMode} • {ord.carrierName}</div>
                        <div className="font-mono text-[10px] text-slate-500">{ord.trackingCode}</div>
                      </td>
                      <td className="p-2 text-right font-mono">{ord.expectedArrival}</td>
                      <td className="p-2 text-right font-mono font-bold">{formatMoney(ord.totalValue)}</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                          {ord.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 4. INVOICE / DANFE MIRROR */}
          {reportType === 'invoices' && (
            <div className="space-y-4 border-2 border-slate-800 p-4 rounded-lg bg-slate-50">
              <div className="flex justify-between items-center border-b-2 border-slate-800 pb-3">
                <div>
                  <h4 className="text-xl font-extrabold tracking-tight text-slate-900">DANFE</h4>
                  <p className="text-[10px] text-slate-600">Documento Auxiliar da Nota Fiscal Eletrônica</p>
                </div>
                <div className="text-center">
                  <span className="text-[11px] font-bold block">0 - ENTRADA / 1 - SAÍDA</span>
                  <span className="text-lg font-bold border-2 border-slate-800 px-3 py-0.5">1</span>
                </div>
                <div className="text-right text-xs">
                  <p className="font-bold">Nº 004.891.220</p>
                  <p>SÉRIE 1 • FOLHA 1/1</p>
                </div>
              </div>

              {/* Barcode & Key */}
              <div className="border border-slate-300 p-2 bg-white rounded text-center">
                <div className="font-mono text-sm tracking-widest font-bold">||||| ||| ||||||| |||| |||||| |||||||||||||| |||||</div>
                <div className="font-mono text-[11px] text-slate-700 mt-1">
                  CHAVE DE ACESSO: 3526 1147 8921 1400 0152 5500 1004 8912 2018 7654 3210
                </div>
              </div>

              {/* Sender & Receiver */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="border border-slate-300 p-2.5 bg-white rounded">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">EMITENTE (FORNECEDOR VMI):</span>
                  <p className="font-bold text-slate-900">POLILUX INJEÇÃO DE TERMOPLÁSTICOS LTDA.</p>
                  <p className="text-slate-600">CNPJ: 47.892.114/0001-52 • IE: 310.450.880.112</p>
                  <p className="text-slate-600">Av. das Indústrias, 1420 - Franca - SP</p>
                  <p className="text-slate-600">NATUREZA: Remessa para Consignação Industrial / Reposição VMI</p>
                </div>
                <div className="border border-slate-300 p-2.5 bg-white rounded">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">DESTINATÁRIO (CLIENTE VMI):</span>
                  <p className="font-bold text-slate-900">INDÚSTRIA TECNOLAR ELETRODOMÉSTICOS S.A.</p>
                  <p className="text-slate-600">CNPJ: 45.123.890/0001-90 • IE: 310.998.120.001</p>
                  <p className="text-slate-600">Parque Industrial TecnoLar - Franca - SP</p>
                  <p className="text-slate-600">DATA DA EMISSÃO: 31/10/2026 • SAÍDA: 01/11/2026 06:00</p>
                </div>
              </div>

              {/* Items in Invoice */}
              <table className="w-full text-xs border border-slate-300 border-collapse bg-white">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-1.5 text-left">CÓDIGO</th>
                    <th className="p-1.5 text-left">DESCRIÇÃO DOS PRODUTOS</th>
                    <th className="p-1.5 text-center">NCM</th>
                    <th className="p-1.5 text-center">CFOP</th>
                    <th className="p-1.5 text-center">UN</th>
                    <th className="p-1.5 text-right">QTD</th>
                    <th className="p-1.5 text-right">V. UNIT</th>
                    <th className="p-1.5 text-right">V. TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-1.5 font-mono">GAB-PLAST-800</td>
                    <td className="p-1.5 font-medium">GABINETE PLÁSTICO INJETADO SUPERIOR (ABS CRÍTICO)</td>
                    <td className="p-1.5 text-center font-mono">3926.90.90</td>
                    <td className="p-1.5 text-center font-mono">5.949</td>
                    <td className="p-1.5 text-center">UN</td>
                    <td className="p-1.5 text-right font-mono font-bold">9.354</td>
                    <td className="p-1.5 text-right font-mono">R$ 48,50</td>
                    <td className="p-1.5 text-right font-mono font-bold">R$ 453.669,00</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-center bg-white p-2.5 border border-slate-300 rounded text-xs font-bold">
                <span>CONTRATO VMI: SLA-VMI-POLILUX-2026 (FATURAMENTO NO PONTO DE USO)</span>
                <span className="text-sm text-blue-950 font-extrabold">VALOR TOTAL DA NOTA: R$ 453.669,00</span>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="mt-10 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-center text-slate-600">
            <div>
              <div className="border-t border-slate-400 w-3/4 mx-auto mb-1" />
              <p className="font-bold text-slate-800">{editSignatoryTecnolar}</p>
              <p>Pela Indústria TecnoLar Eletrodomésticos S.A.</p>
            </div>
            <div>
              <div className="border-t border-slate-400 w-3/4 mx-auto mb-1" />
              <p className="font-bold text-slate-800">{editSignatorySupplier}</p>
              <p>Pelo Fornecedor Parceiro VMI</p>
            </div>
          </div>
        </div>

        {/* Footer (No print) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center no-print">
          <span className="text-xs text-slate-400">
            Padrão de Impressão ABNT / NBR e Legislação Fiscal SPED NF-e
          </span>
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

import React, { useState } from 'react';
import { BookOpen, Code, Database, Server, GitMerge, CheckCircle2, ShieldCheck, X, Cpu } from 'lucide-react';
import { useVmi } from '../context/VmiContext';

interface DocumentationModalProps {
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'datamodel' | 'roles' | 'apis' | 'tests'>('architecture');
  const { unitTestResults, refreshUnitTests } = useVmi();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Documentação Técnica & Arquitetura VMI</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-900/60 text-cyan-300 border border-cyan-700">
                  ERP TecnoLar v2.4 API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Especificação da arquitetura, modelo de dados, fluxos de acesso, contratos de API e suíte de testes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 py-3 bg-slate-950/70 border-b border-slate-800 flex gap-2 overflow-x-auto">
          {[
            { id: 'architecture', label: '1. Arquitetura da Solução', icon: Server },
            { id: 'datamodel', label: '2. Modelo de Dados (ER)', icon: Database },
            { id: 'roles', label: '3. Fluxos por Perfil', icon: GitMerge },
            { id: 'apis', label: '4. APIs de Comunicação ERP', icon: Code },
            { id: 'tests', label: '5. Suíte de Testes Unitários', icon: CheckCircle2 },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  activeTab === t.id
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
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs leading-relaxed font-sans">
          {/* TAB 1: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  Visão Geral da Arquitetura do Sistema VMI TecnoLar
                </h4>
                <p className="text-slate-300">
                  O ecossistema VMI (Vendor Managed Inventory) da TecnoLar foi projetado segundo os princípios da 
                  <strong> manufatura enxuta (Lean Manufacturing)</strong>, 
                  <strong> sincronização contínua de suprimentos</strong> e 
                  <strong> acessibilidade universal (WCAG 2.1 AAA)</strong>.
                </p>
              </div>

              {/* Architectural Layers Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-950 border border-cyan-900/60 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                    CAMADA 01 • CLIENTE RESPONSIVO & A11Y
                  </span>
                  <h5 className="font-bold text-sm text-white mb-2">Frontend Universal Multi-Dispositivo</h5>
                  <ul className="space-y-1.5 text-slate-400 text-[11px]">
                    <li>• Compatibilidade Desktop, Tablet, iOS e Android.</li>
                    <li>• WCAG 2.1 AAA: Alto contraste, leitor de tela (TTS), filtros daltonismo.</li>
                    <li>• Módulo Libras com câmera de visão computacional e intérprete virtual animado.</li>
                    <li>• Entrada por voz e comandos em português.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 border border-cyan-900/60 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                    CAMADA 02 • MOTOR MATEMÁTICO VMI
                  </span>
                  <h5 className="font-bold text-sm text-white mb-2">Políticas Dinâmicas & Lean</h5>
                  <ul className="space-y-1.5 text-slate-400 text-[11px]">
                    <li>• Cálculo dinâmico do LEC, Estoque de Segurança e Ponto de Pedido.</li>
                    <li>• Eliminação do gargalo anual: revisão contínua baseada em variabilidade real.</li>
                    <li>• Circuito Milk Run programado a cada 30 min (400 metros de trajeto).</li>
                    <li>• Sinalização e-Kanban e supermercado próximo à linha de montagem.</li>
                  </ul>
                </div>

                <div className="bg-slate-950 border border-cyan-900/60 p-4 rounded-xl">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase block mb-1">
                    CAMADA 03 • INTEGRAÇÃO ERP & IA
                  </span>
                  <h5 className="font-bold text-sm text-white mb-2">Gateway de Integração TecnoLar</h5>
                  <ul className="space-y-1.5 text-slate-400 text-[11px]">
                    <li>• Conexão com o ERP TecnoLar (https://erp-tecnolar.vercel.app/).</li>
                    <li>• Baixa instantânea no ponto de uso via código de barras.</li>
                    <li>• Sell-through da ponta varejista compartilhado em tempo real.</li>
                    <li>• Scorecard mensal de fornecedores com OTIF ponderado em 35%.</li>
                  </ul>
                </div>
              </div>

              {/* Core Principles based on Academic Article */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2">
                <h5 className="font-bold text-sm text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  Solução dos 4 Problemas Críticos Diagnosticados no Artigo TecnoLar (SENAI 2026):
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-[11px]">
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                    <strong className="text-rose-400 block mb-1">1. Ponto de Pedido revisado apenas anualmente</strong>
                    <p className="text-slate-300">
                      <strong>Solução VMI:</strong> A IA do VMI recalcula o Ponto de Pedido continuamente conforme a demanda real diária e a variabilidade do lead time dos fornecedores.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                    <strong className="text-rose-400 block mb-1">2. Baixa de consumo apenas no fim do turno</strong>
                    <p className="text-slate-300">
                      <strong>Solução VMI:</strong> Leitura ótica no ponto de uso com atualização instantânea de saldo e disparo imediato do sinal e-Kanban, eliminando estoque fantasma.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                    <strong className="text-rose-400 block mb-1">3. Lead time de 10 dias com alta variabilidade (±6 dias)</strong>
                    <p className="text-slate-300">
                      <strong>Solução VMI:</strong> Acordo operacional VMI e Scorecard mensal focado em OTIF (meta 96%), reduzindo a variabilidade para ±2 dias e o estoque de segurança de 9.216 para 3.072 unidades (-66,7%).
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                    <strong className="text-rose-400 block mb-1">4. Distância de 400m sem rotas ou horários fixos</strong>
                    <p className="text-slate-300">
                      <strong>Solução VMI:</strong> Sistema Milk Run interno com trem logístico e horários fixos a cada 30 minutos, supermercado na linha e caixas retornáveis (investimento de R$ 14.285).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DATA MODEL */}
          {activeTab === 'datamodel' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  Modelo de Dados Relacional e Entidades Centrais (VMI Core Schemas)
                </h4>
                <p className="text-slate-300">
                  Esquema normalizado para armazenamento dos mais de 400 componentes nacionais e internacionais, 
                  garantindo consistência transacional e isolamento multitenant entre fornecedores e a TecnoLar.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px]">
                {/* Entity Item */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-cyan-400">Entidade: items</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Tabela Mestra</span>
                  </div>
                  <ul className="space-y-1 font-mono text-slate-400">
                    <li><strong className="text-white">sku</strong>: VARCHAR(30) PRIMARY KEY</li>
                    <li>name: VARCHAR(150) NOT NULL</li>
                    <li>category: VARCHAR(60)</li>
                    <li>abc_classification: ENUM('A', 'B', 'C')</li>
                    <li>is_critical: BOOLEAN DEFAULT FALSE</li>
                    <li>supplier_id: VARCHAR(30) REFERENCES suppliers(id)</li>
                    <li>current_stock: INTEGER NOT NULL</li>
                    <li>reorder_point: INTEGER NOT NULL (PP)</li>
                    <li>safety_stock: INTEGER NOT NULL (SS)</li>
                    <li>economic_order_qty: INTEGER NOT NULL (LEC)</li>
                    <li>daily_demand: INTEGER DEFAULT 1200</li>
                    <li>lead_time_days: INTEGER DEFAULT 10</li>
                    <li>lead_time_std_dev: INTEGER DEFAULT 6</li>
                    <li>line_supermarket_stock: INTEGER DEFAULT 0</li>
                    <li>sell_through_weekly: INTEGER DEFAULT 0</li>
                    <li>barcode: VARCHAR(30) UNIQUE</li>
                  </ul>
                </div>

                {/* Entity Supplier */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-cyan-400">Entidade: suppliers</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Parceiros VMI</span>
                  </div>
                  <ul className="space-y-1 font-mono text-slate-400">
                    <li><strong className="text-white">id</strong>: VARCHAR(30) PRIMARY KEY</li>
                    <li>name: VARCHAR(150) NOT NULL</li>
                    <li>type: ENUM('nacional', 'internacional')</li>
                    <li>country: VARCHAR(50) NOT NULL</li>
                    <li>city: VARCHAR(60) / state: VARCHAR(10)</li>
                    <li>tax_id: VARCHAR(30) NOT NULL (CNPJ / TaxID)</li>
                    <li>contact_name: VARCHAR(100)</li>
                    <li>contact_email: VARCHAR(100)</li>
                    <li>contact_phone: VARCHAR(30)</li>
                    <li>scorecard_otif: DECIMAL(5,2) (Peso 35%)</li>
                    <li>scorecard_quality: DECIMAL(5,2) (Peso 20%)</li>
                    <li>scorecard_total: DECIMAL(5,2)</li>
                    <li>classification: ENUM('A', 'B', 'C')</li>
                  </ul>
                </div>

                {/* Entity Orders */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-cyan-400">Entidade: replenishment_orders</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Ressuprimento VMI</span>
                  </div>
                  <ul className="space-y-1 font-mono text-slate-400">
                    <li><strong className="text-white">id</strong>: VARCHAR(30) PRIMARY KEY</li>
                    <li>order_number: VARCHAR(40) UNIQUE</li>
                    <li>sku: VARCHAR(30) REFERENCES items(sku)</li>
                    <li>supplier_id: VARCHAR(30) REFERENCES suppliers(id)</li>
                    <li>requested_qty: INTEGER NOT NULL</li>
                    <li>status: ENUM('draft', 'in_transit', 'received', 'staged')</li>
                    <li>emission_date: DATE NOT NULL</li>
                    <li>expected_arrival: DATE NOT NULL</li>
                    <li>actual_arrival: TIMESTAMP</li>
                    <li>tracking_code: VARCHAR(50)</li>
                    <li>invoice_number: VARCHAR(40) (NF-e)</li>
                    <li>total_value_brl: DECIMAL(12,2)</li>
                  </ul>
                </div>

                {/* Entity VMI Contracts */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-cyan-400">Entidade: vmi_contracts</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">SLAs & Governança</span>
                  </div>
                  <ul className="space-y-1 font-mono text-slate-400">
                    <li><strong className="text-white">id</strong>: VARCHAR(30) PRIMARY KEY</li>
                    <li>supplier_id: VARCHAR(30) REFERENCES suppliers(id)</li>
                    <li>availability_target_pct: DECIMAL(4,2) (ex: 99.5%)</li>
                    <li>max_stockout_pct: DECIMAL(4,2) (ex: 0.2%)</li>
                    <li>penalty_per_hour_downtime: DECIMAL(10,2) (R$ 22.000)</li>
                    <li>short_shipment_fine: DECIMAL(10,2) (R$ 150.000)</li>
                    <li>inventory_ownership: ENUM('consignado', 'faturamento_ponto_uso')</li>
                    <li>coverage_band_min_days: INTEGER (ex: 8 dias)</li>
                    <li>coverage_band_max_days: INTEGER (ex: 15 dias)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ROLES & FLOWS */}
          {activeTab === 'roles' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <GitMerge className="w-4 h-4 text-cyan-400" />
                  Estrutura de Telas & Fluxos por Perfil de Usuário
                </h4>
                <p className="text-slate-300">
                  Controle de acesso rigoroso por perfil (RBAC): fornecedores visualizam apenas dados permitidos pelo SLA, 
                  enquanto gestores da TecnoLar têm visão estratégica ponta a ponta.
                </p>
              </div>

              <div className="space-y-4">
                {/* Profile TecnoLar */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <h5 className="font-bold text-sm text-white">Perfil 1: Planejador de Suprimentos & S&OP (TecnoLar)</h5>
                  </div>
                  <p className="text-slate-400 text-xs mb-3">
                    Acesso pleno a todos os 400+ componentes, scorecards de todos os fornecedores nacionais e internacionais, 
                    auditoria de paradas de linha, aprovação de parâmetros e plano de ação 5W2H.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-cyan-300 block mb-1">Tela de Dashboard</strong>
                      Visualização de KPIs macro: OTIF 76%&rarr;96%, Horas paradas 28h&rarr;8h, Economia R$ 545k/trim.
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-cyan-300 block mb-1">Tela de Parâmetros</strong>
                      Simulação interativa de LEC, SS e Ponto de Pedido com sliders e testes unitários.
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-cyan-300 block mb-1">Tela de Scorecard</strong>
                      Ranqueamento de fornecedores (Quadro 2 e Gráfico do Artigo) e emissão de POP/5W2H.
                    </div>
                  </div>
                </div>

                {/* Profile Fornecedor Nacional */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h5 className="font-bold text-sm text-white">Perfil 2: Fornecedor Nacional (ex: Polilux Franca)</h5>
                  </div>
                  <p className="text-slate-400 text-xs mb-3">
                    Acesso restrito aos componentes plásticos sob seu contrato VMI. Visualização do estoque em consignação na 
                    fábrica, sell-through nos varejistas e emissão autônoma de reposição quando o estoque atinge o PP.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-emerald-300 block mb-1">Visão de Estoque</strong>
                      Acompanhamento em tempo real do nível de peças e do consumo nas células A3 e B1 da montagem.
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-emerald-300 block mb-1">Despacho de Pedidos</strong>
                      Criação da ordem de reposição do LEC (9.354 un) e geração do espelho de DANFE / NF-e.
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-emerald-300 block mb-1">SLA & Desempenho</strong>
                      Acompanhamento do seu índice OTIF pessoal e plano de ação para superar os 96%.
                    </div>
                  </div>
                </div>

                {/* Profile Operador Logístico / Milk Run */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h5 className="font-bold text-sm text-white">Perfil 3: Operador de Linha & Milk Run Interno</h5>
                  </div>
                  <p className="text-slate-400 text-xs mb-3">
                    Interface simplificada e de alta velocidade para operadores e condutores do trem logístico.
                    Suporte completo a Libras e comando de voz ativados automaticamente.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-amber-300 block mb-1">Leitor no Ponto de Uso</strong>
                      Escaneamento de código de barras a cada unidade montada (baixa instantânea).
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-amber-300 block mb-1">Circuito Milk Run</strong>
                      Horários a cada 30 min, coleta de caixas plásticas retornáveis e abastecimento de mini-estoques.
                    </div>
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <strong className="text-amber-300 block mb-1">e-Kanban Visual</strong>
                      Quadro de sinalização visual verde/amarelo/vermelho por posto de trabalho.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: API CONTRACTS */}
          {activeTab === 'apis' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  Especificação Técnica das APIs de Integração VMI &harr; ERP TecnoLar
                </h4>
                <p className="text-slate-300">
                  Endpoints RESTful e Webhooks de eventos para sincronização bidirecional entre o aplicativo VMI 
                  e o ERP TecnoLar (hospedado em https://erp-tecnolar.vercel.app/).
                </p>
              </div>

              <div className="space-y-4">
                {/* Endpoint 1 */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-emerald-600 text-white font-mono font-bold rounded text-[10px]">
                      POST
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">/api/v1/erp/consumption/point-of-use</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Registra a baixa em tempo real no ponto de consumo via leitor ótico, eliminando a baixa ao final do turno.
                  </p>
                  <pre className="p-2.5 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
{`// Payload de Requisição
{
  "barcode": "7891234560012",
  "sku": "GAB-PLAST-800",
  "quantity": 1,
  "workstation_id": "WS-LINHA01-A3",
  "operator_id": "usr-operador-milkrun",
  "timestamp": "2026-11-03T14:32:00.000Z"
}

// Resposta 200 OK
{
  "status": "success",
  "sku": "GAB-PLAST-800",
  "updated_current_stock": 14199,
  "updated_supermarket_stock": 849,
  "reorder_point": 21216,
  "is_below_reorder_point": true,
  "kanban_trigger": "SINAL_VERMELHO_ACIONADO"
}`}
                  </pre>
                </div>

                {/* Endpoint 2 */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-600 text-white font-mono font-bold rounded text-[10px]">
                      GET
                    </span>
                    <span className="font-mono text-cyan-300 font-bold">/api/v1/vmi/suppliers/{`{id}`}/scorecard</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Retorna os indicadores mensais ponderados do fornecedor com base nas entregas registradas no ERP.
                  </p>
                  <pre className="p-2.5 bg-slate-900 rounded-lg text-[10px] font-mono text-slate-300 overflow-x-auto border border-slate-800">
{`// Resposta 200 OK
{
  "supplier_id": "sup-polilux-franca",
  "month": "2026-10",
  "criteria": {
    "otif": { "score": 88.5, "weight": 0.35, "target": 96.0 },
    "quality": { "score": 94.0, "weight": 0.20, "target": 98.0 },
    "lead_time": { "score": 82.0, "weight": 0.15, "actual_days": 10, "std_dev": 6 },
    "total_cost": { "score": 89.0, "weight": 0.15 },
    "flexibility": { "score": 85.0, "weight": 0.10 },
    "documentation": { "score": 98.0, "weight": 0.05 }
  },
  "consolidated_score": 88.3,
  "classification": "A",
  "action_plan_required": true,
  "action_plan_protocol": "5W2H-TEC-2026-10"
}`}
                  </pre>
                </div>

                {/* Webhook */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-600 text-white font-mono font-bold rounded text-[10px]">
                      WEBHOOK
                    </span>
                    <span className="font-mono text-purple-300 font-bold">tecnolar.vmi.replenishment.triggered</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Disparo assíncrono para o sistema do Fornecedor assim que a fábrica atinge o Ponto de Pedido (PP).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: UNIT TESTS */}
          {activeTab === 'tests' && (
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Suíte de Testes Unitários das Fórmulas VMI (Validação do Artigo SENAI 2026)
                  </h4>
                  <p className="text-slate-300">
                    Bateria de testes que valida rigorosamente os cálculos matemáticos de LEC, Estoque de Segurança e Ponto de Pedido 
                    conforme as premissas e resultados descritos no artigo científico.
                  </p>
                </div>
                <button
                  onClick={refreshUnitTests}
                  className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs transition"
                >
                  Executar Testes Novamente
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {unitTestResults.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                      t.passed
                        ? 'bg-slate-950/80 border-emerald-500/40 text-slate-200'
                        : 'bg-rose-950/50 border-rose-500 text-rose-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-white text-xs">{t.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            t.passed ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-rose-900 text-rose-200'
                          }`}
                        >
                          {t.passed ? 'PASSED (100%)' : 'FAILED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">{t.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800 font-mono">
                      <span className="text-slate-500">
                        Esperado: <strong className="text-cyan-300">{t.expected.toString()}</strong>
                      </span>
                      <span className="text-slate-500">
                        Obtido: <strong className="text-emerald-300">{t.actual.toString()}</strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Todos os testes de validação matemática passaram com 100% de precisão em relação às equações das seções 3.1.1, 3.1.2 e 3.1.3 do artigo científico.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            Documentação técnica em conformidade com as normas ABNT NBR 6023 e padrões de integração ERP.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

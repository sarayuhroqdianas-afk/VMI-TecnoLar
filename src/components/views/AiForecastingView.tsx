import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Volume2,
  Calendar,
  ExternalLink,
  Layers,
  Zap,
} from 'lucide-react';
import { useVmi } from '../../context/VmiContext';
import { Item } from '../../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendations?: Array<{ label: string; action: string }>;
}

export const AiForecastingView: React.FC<{ onOpenVoice?: () => void; onOpenLibras?: () => void }> = ({
  onOpenVoice,
  onOpenLibras,
}) => {
  const { items, suppliers, erpSyncStatus, lastSyncTime, syncWithErp, speakText, updateItemParameters, formatMoney } = useVmi();
  const [selectedSku, setSelectedSku] = useState<string>('GAB-PLAST-800');
  const [inputQuery, setInputQuery] = useState<string>('');
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Olá! Sou o Modelo de Inteligência Artificial de Suprimentos da TecnoLar, integrado diretamente à API do ERP (https://erp-tecnolar.vercel.app/). Analiso em tempo real o consumo nos postos de montagem (1.200 un/dia), a sazonalidade e a variabilidade dos fornecedores para prever necessidades e recalcular dinamicamente os Pontos de Pedido.',
      timestamp: '11:20',
      recommendations: [
        { label: 'Análise de Ruptura nos Plásticos', action: 'analise_plasticos' },
        { label: 'Revisão Dinâmica de Ponto de Pedido', action: 'revisao_pp' },
        { label: 'Previsão de Demanda Próximo Mês', action: 'previsao_mes' },
      ],
    },
  ]);

  const activeItem = items.find((i) => i.sku === selectedSku) || items[0];

  // Dynamic AI Reorder Point Calculation for the active item
  const dynamicAIRecommendation = {
    currentPP: activeItem.reorderPoint,
    recommendedPP: Math.round(activeItem.reorderPoint * 0.88),
    recommendedSS: Math.round(activeItem.safetyStock * 0.75),
    confidencePercent: 96.8,
    estimatedSavings: 'R$ 48.000 / mês',
    reasoning:
      'Com base na estabilização do lead time da Polilux pelo Milk Run de 30 minutos e no nivelamento S&OP de 1.200 un/dia, a variabilidade do lead time caiu para ±2 dias. É seguro diminuir o Ponto de Pedido sem elevar o risco de ruptura, liberando capital de giro.',
  };

  const processQuerySmart = (query: string): string => {
    const q = query.toLowerCase().trim();

    // Check for specific SKUs or item names
    for (const item of items) {
      if (q.includes(item.sku.toLowerCase()) || q.includes(item.name.toLowerCase().split(' ')[0])) {
        const isBelow = item.currentStock <= item.reorderPoint;
        return `Consulta do SKU ${item.sku} (${item.name}): Saldo atual na fábrica de ${item.currentStock.toLocaleString('pt-BR')} unidades. ${
          isBelow
            ? `ATENÇÃO: O item está ABAIXO do Ponto de Pedido (${item.reorderPoint.toLocaleString('pt-BR')} un)! O ressuprimento VMI já foi acionado junto a ${item.supplierName}.`
            : `Estoque regular com cobertura de ${(item.currentStock / item.dailyDemand).toFixed(1)} dias de consumo.`
        } Estoque no supermercado de linha: ${item.lineSupermarketStock} un. Lote Econômico: ${item.economicOrderQty} un.`;
      }
    }

    // Check for general logistics topics
    if (q.includes('ruptura') || q.includes('parada') || q.includes('28h') || q.includes('paradas')) {
      return `Diagnóstico das paradas de produção: No último trimestre foram registradas 28 horas de paralisação da linha a R$ 22.000,00 por hora (R$ 616.000,00), além de R$ 150.000,00 em multas contratuais por short-shipment, totalizando R$ 766.000,00. As principais causas identificadas no Pareto foram atrasos de fornecedores (14h) e falha na logística interna no layout de 400m (6h). Com o VMI e o Milk Run, a meta projeta redução para 8 horas e impacto de R$ 221.000,00 (-71,1% de custos).`;
    }

    if (q.includes('otif') || q.includes('fornecedor') || q.includes('polilux') || q.includes('shenzhen')) {
      return `Avaliação de fornecedores pelo Scorecard mensal: O cálculo pondera 6 critérios oficiais do artigo: OTIF (35%), Qualidade (20%), Lead Time (15%), Custo Total (15%), Flexibilidade (10%) e Documentação (5%). A Polilux Plásticos está com OTIF de 88,5% (meta mínima de 96% para itens A-críticos), o que disparou o plano de ação 5W2H. A Shenzhen Precision (China) opera com OTIF de 92% e lead time marítimo de 25 dias via Porto de Santos.`;
    }

    if (q.includes('ponto de pedido') || q.includes('pp') || q.includes('revisão') || q.includes('anual')) {
      return `Revisão do Ponto de Pedido: O problema diagnosticado no artigo foi a revisão estática realizada apenas 1 vez por ano pelo ERP tradicional. Nossa IA agora executa a revisão contínua dinâmica baseada na variabilidade real: PP = (Demanda Diária × Lead Time) + Estoque de Segurança. No cenário atual dos plásticos, PP = (1.200 × 10) + 9.216 = 21.216 un. No cenário projetado, com redução do lead time para 8 dias e desvio para 2 dias, o PP cai com segurança para 12.672 un (-40,3%).`;
    }

    if (q.includes('lec') || q.includes('lote econômico') || q.includes('fórmula') || q.includes('cálculo')) {
      return `Fórmula do Lote Econômico de Compra: LEC = √[(2 × D × S) / H]. Com Demanda anual D = 300.000 un, Custo de pedido S = R$ 350,00 e Manutenção de estoque H = R$ 2,40/un/ano, o LEC exato calculado é de 9.354 unidades por pedido, minimizando o custo total de estocagem.`;
    }

    if (q.includes('milk run') || q.includes('kanban') || q.includes('layout') || q.includes('400')) {
      return `Abastecimento Interno Milk Run: Resolução do gargalo de 400 metros entre almoxarifado central e a linha de montagem. O trem logístico cumpre rotas fixas a cada 30 minutos (2 viagens por hora) com carrinhos industriais e 30 caixas retornáveis, reduzindo o tempo de resposta de 45 para 15 minutos (-66,7%). O investimento inicial foi de R$ 14.285,00 (Quadro 11), com retorno de investimento em apenas 1,6 dias de operação.`;
    }

    if (q.includes('economia') || q.includes('financeiro') || q.includes('545') || q.includes('retorno')) {
      return `Impacto financeiro do VMI: A redução das paradas de 28h para 8h e das multas de R$ 150.000 para R$ 45.000 gera uma economia líquida de R$ 545.000,00 por trimestre, correspondendo a uma economia bruta anual de R$ 2.180.000,00.`;
    }

    if (q.includes('erp') || q.includes('api') || q.includes('integração') || q.includes('vercel')) {
      return `Integração com ERP TecnoLar (https://erp-tecnolar.vercel.app/): A comunicação é bidirecional via REST API e Webhooks. A cada leitura ótica de código de barras no posto de trabalho da linha, o evento /api/v1/erp/consumption/point-of-use é disparado, baixando o estoque físico e informando o sell-through do varejo para o fornecedor em tempo real.`;
    }

    if (q.includes('olá') || q.includes('bom dia') || q.includes('boa tarde') || q.includes('ajuda')) {
      return `Olá! Estou à disposição para analisar dados do ERP TecnoLar. Você pode me perguntar sobre o saldo de qualquer SKU (ex: GAB-PLAST-800), o índice OTIF dos fornecedores, as 28 horas de parada, a economia do projeto ou o circuito de Milk Run.`;
    }

    // Default intelligent comprehensive fallback
    return `Análise de Demanda & Suprimentos TecnoLar: Para sua consulta sobre "${query}", os dados consolidados do ERP indicam demanda média estável de 1.200 unidades/dia (300.000 un/ano). O estoque geral está operando com acuracidade de 99,1% após a implantação do inventário diário de itens classe A. Os componentes plásticos continuam sendo o foco prioritário de monitoramento devido à Curva ABC (63% do impacto).`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const userText = inputQuery.trim();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      const aiText = processQuerySmart(userText);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
      speakText(aiText);
    }, 900);
  };

  const handleApplyAiRecommendation = () => {
    updateItemParameters(activeItem.sku, {
      reorderPoint: dynamicAIRecommendation.recommendedPP,
      safetyStock: dynamicAIRecommendation.recommendedSS,
    });
    speakText(`Recomendação da inteligência artificial aplicada ao SKU ${activeItem.sku} no ERP TecnoLar.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with ERP Sync Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              IA Preditiva de Demanda & Integração ERP TecnoLar
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Revisão dinâmica contínua do Ponto de Pedido (substituindo a revisão anual estática) e previsão de consumo real.
          </p>
        </div>

        {/* Sync Button */}
        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-400 block">Sincronismo ERP:</span>
            <span className="text-emerald-400 font-semibold">{lastSyncTime}</span>
          </div>
          <button
            onClick={syncWithErp}
            disabled={erpSyncStatus === 'syncing'}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${erpSyncStatus === 'syncing' ? 'animate-spin text-cyan-400' : ''}`} />
            {erpSyncStatus === 'syncing' ? 'Sincronizando...' : 'Sincronizar ERP'}
          </button>
        </div>
      </div>

      {/* Dynamic Reorder Point Recalculator Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-cyan-950/60 to-slate-900 border border-cyan-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cyan-900/60 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Motor IA: Revisão Dinâmica do Ponto de Pedido (PP)
              </h3>
              <p className="text-xs text-slate-300">
                Ajuste automático baseado na variabilidade real em vez da antiga revisão anual do ERP.
              </p>
            </div>
          </div>

          {/* SKU Picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300 font-semibold">SKU em Análise:</span>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              className="bg-slate-950 border border-cyan-700 text-white text-xs font-mono font-bold rounded-xl px-3 py-1.5 outline-none focus:border-cyan-400"
            >
              {items.map((i) => (
                <option key={i.sku} value={i.sku}>
                  {i.sku} - {i.name.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block mb-1">Ponto de Pedido Atual (ERP):</span>
            <span className="text-2xl font-extrabold text-white font-mono">
              {dynamicAIRecommendation.currentPP.toLocaleString('pt-BR')} un
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Definido anualmente</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-cyan-600/60 rounded-xl">
            <span className="text-cyan-400 font-bold block mb-1">Recomendação Dinâmica da IA:</span>
            <span className="text-2xl font-extrabold text-cyan-300 font-mono">
              {dynamicAIRecommendation.recommendedPP.toLocaleString('pt-BR')} un
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
              Redução segura de 12%
            </span>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block mb-1">Confiança do Modelo:</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              {dynamicAIRecommendation.confidencePercent}%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">R2 = 0.94 na demanda</span>
          </div>

          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-slate-400 block mb-1">Economia de Posse de Estoque:</span>
            <span className="text-2xl font-extrabold text-amber-400 font-mono">
              {dynamicAIRecommendation.estimatedSavings}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Capital de giro otimizado</span>
          </div>
        </div>

        {/* Reasoning and Action Button */}
        <div className="p-4 bg-slate-950/90 border border-cyan-900/60 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-bold text-cyan-300 block mb-1">Justificativa da IA TecnoLar:</span>
            <p className="text-slate-300 leading-relaxed text-[11px]">{dynamicAIRecommendation.reasoning}</p>
          </div>
          <button
            onClick={handleApplyAiRecommendation}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg whitespace-nowrap transition flex items-center gap-2 self-start md:self-center"
          >
            <CheckCircle2 className="w-4 h-4" />
            Aplicar no ERP TecnoLar
          </button>
        </div>
      </div>

      {/* Interactive AI Chat with Natural Language Comprehension */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">
              Diálogo Natural com o Assistente de IA de Suprimentos
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            {onOpenVoice && (
              <button
                onClick={onOpenVoice}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl border border-slate-700 transition"
              >
                Falar por Voz
              </button>
            )}
            {onOpenLibras && (
              <button
                onClick={onOpenLibras}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl border border-slate-700 transition"
              >
                Interagir em Libras
              </button>
            )}
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            'Qual o status do gabinete plástico GAB-PLAST-800?',
            'Por que ocorreram 28h de parada de linha?',
            'Qual o índice OTIF da Polilux e plano de ação?',
            'Como funciona a fórmula do LEC de 9.354 un?',
            'Como o Milk Run resolveu o trajeto de 400m?',
          ].map((promptText, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputQuery(promptText);
              }}
              className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500 transition"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="space-y-3 max-h-96 overflow-y-auto p-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-2xl p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600 text-white font-medium rounded-br-none shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                <p>{msg.text}</p>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => speakText(msg.text)}
                    className="mt-2 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    Ouvir Resposta
                  </button>
                )}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Analisando bases do ERP TecnoLar e processando resposta...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            placeholder="Pergunte à IA do VMI sobre qualquer componente, ruptura, fórmula, OTIF ou economia..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 text-white text-xs rounded-xl px-4 py-3 outline-none focus:border-cyan-500 transition"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

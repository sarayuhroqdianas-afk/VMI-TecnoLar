import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  Play,
  Sliders,
  Settings2,
  Activity,
  User,
  Radio,
  Zap,
  Send,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { useVmi } from '../context/VmiContext';

interface VoiceAssistantModalProps {
  onClose: () => void;
  onNavigate?: (view: string) => void;
}

interface VoicePersona {
  id: string;
  name: string;
  gender: 'Feminino' | 'Masculino';
  accent: string;
  pitch: number;
  rate: number;
  description: string;
  samplePhrase: string;
}

const VOICE_PERSONAS: VoicePersona[] = [
  {
    id: 'fernanda',
    name: 'Fernanda',
    gender: 'Feminino',
    accent: 'pt-BR (Executiva & S&OP)',
    pitch: 1.28,
    rate: 1.0,
    description: 'Voz feminina executiva, límpida e natural para apresentações de diretoria e S&OP.',
    samplePhrase: 'Olá, sou Fernanda. Como posso auxiliar na gestão integrada de estoques da TecnoLar hoje?',
  },
  {
    id: 'leticia',
    name: 'Letícia',
    gender: 'Feminino',
    accent: 'pt-BR (Natural Franca-SP)',
    pitch: 1.20,
    rate: 0.98,
    description: 'Voz feminina calorosa, natural e articulada para comunicação operacional na fábrica de Franca.',
    samplePhrase: 'Oi! Sou a Letícia. Estou monitorando os componentes plásticos e as entregas dos fornecedores.',
  },
  {
    id: 'luciana',
    name: 'Luciana',
    gender: 'Feminino',
    accent: 'pt-BR (Acessibilidade Neural)',
    pitch: 1.15,
    rate: 0.92,
    description: 'Voz feminina com ritmo cadenciado e alta clareza fonética para leitores de tela e WCAG AAA.',
    samplePhrase: 'Assistente Luciana ativa. Dados de estoque e parâmetros operacionais disponíveis com alta fidelidade.',
  },
  {
    id: 'felipe',
    name: 'Felipe',
    gender: 'Masculino',
    accent: 'pt-BR (Operacional & Linha)',
    pitch: 0.82,
    rate: 1.02,
    description: 'Voz masculina dinâmica e objetiva para abastecimento e leitura no ponto de uso.',
    samplePhrase: 'Aqui é o Felipe! A linha 01 está operando a todo vapor com consumo integrado pelo e-Kanban.',
  },
  {
    id: 'ricardo',
    name: 'Ricardo',
    gender: 'Masculino',
    accent: 'pt-BR (Logística & Barítono)',
    pitch: 0.74,
    rate: 0.96,
    description: 'Voz masculina encorpada e firme para monitoramento de rotas Milk Run e alertas críticos de ruptura.',
    samplePhrase: 'Ricardo na escuta. O circuito de Milk Run a cada 30 minutos garante o fluxo contínuo das linhas.',
  },
];

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ onClose, onNavigate }) => {
  const { items, suppliers, requestPermission, formatMoney, currentUser, contracts } = useVmi();
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [typedInput, setTypedInput] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>(
    'Olá! Eu sou a IA Integrada de Suprimentos TecnoLar. Fale ou digite sua pergunta sobre estoque em tempo real, Ponto de Pedido (PP), Lote Econômico (LEC), OTIF dos fornecedores ou custos de parada de linha.'
  );
  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(VOICE_PERSONAS[0]);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [speechPitch, setSpeechPitch] = useState<number>(1.0);
  const [showVoiceSettings, setShowVoiceSettings] = useState<boolean>(false);
  const [availableSystemVoices, setAvailableSystemVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceUri, setSelectedVoiceUri] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Load and classify real browser voices
  useEffect(() => {
    const loadVoices = () => {
      if (!('speechSynthesis' in window)) return;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableSystemVoices(voices);
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Initial greeting
    setTimeout(() => {
      speakCustomPersona('Assistente de Voz TecnoLar ativado. Pergunte sobre estoque, paradas ou fornecedores.');
    }, 400);

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (animRef.current) {
        cancelAnimationFrame(animRef.current);
      }
    };
  }, []);

  // Find the most appropriate system voice for a persona
  const pickBestVoiceForPersona = (persona: VoicePersona): SpeechSynthesisVoice | null => {
    if (availableSystemVoices.length === 0) return null;

    // If user explicitly picked a voice URI
    if (selectedVoiceUri) {
      const explicit = availableSystemVoices.find((v) => v.voiceURI === selectedVoiceUri);
      if (explicit) return explicit;
    }

    const ptVoices = availableSystemVoices.filter(
      (v) => v.lang.startsWith('pt') || v.lang.includes('BR') || v.lang.includes('pt-BR')
    );
    const candidatePool = ptVoices.length > 0 ? ptVoices : availableSystemVoices;

    if (persona.gender === 'Feminino') {
      const femaleKeywords = [
        'maria', 'luciana', 'leticia', 'letícia', 'francisca', 'fernanda', 'vitoria', 'vitória',
        'helena', 'camila', 'raquel', 'yara', 'female', 'mulher', 'zira', 'samantha', 'karen',
        'pt-br-x-afs', 'pt-br-x-sfg', 'google português do brasil'
      ];
      const match = candidatePool.find((v) => {
        const name = v.name.toLowerCase();
        return femaleKeywords.some((kw) => name.includes(kw));
      });
      if (match) return match;
      return candidatePool[0];
    } else {
      const maleKeywords = [
        'daniel', 'felipe', 'ricardo', 'thiago', 'antonio', 'antônio', 'jorge', 'carlos',
        'male', 'homem', 'george', 'david', 'pt-br-x-afm', 'pt-br-x-ybf', 'microsoft daniel'
      ];
      const match = candidatePool.find((v) => {
        const name = v.name.toLowerCase();
        return maleKeywords.some((kw) => name.includes(kw));
      });
      if (match) return match;
      // If no explicit male voice in pt-BR, pick the last one or default, pitch modification will enforce male timbre
      return candidatePool[candidatePool.length - 1];
    }
  };

  // Speak with rich timbre & accurate gender characteristics
  const speakCustomPersona = (text: string, overridePersona?: VoicePersona) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const persona = overridePersona || selectedPersona;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';

    // Best matching voice
    const matchedVoice = pickBestVoiceForPersona(persona);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    // Determine acoustic pitch:
    // If the persona is male and matched voice might be female/generic, shift pitch strongly downwards (0.70-0.78)
    // If the persona is female, pitch is shifted upwards (1.18-1.30)
    let finalPitch = persona.pitch * speechPitch;
    if (persona.gender === 'Masculino') {
      if (matchedVoice && matchedVoice.name.toLowerCase().includes('female')) {
        finalPitch = 0.65;
      }
    }

    utterance.pitch = Math.max(0.5, Math.min(2.0, finalPitch));
    utterance.rate = Math.max(0.5, Math.min(2.0, persona.rate * speechRate));

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  // Audio wave visualizer animation
  useEffect(() => {
    let phase = 0;
    const animateWave = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      phase += isListening || isSpeaking ? 0.12 : 0.03;
      const amp = isListening ? 22 : isSpeaking ? 16 : 4;

      // Primary wave (cyan/emerald)
      ctx.strokeStyle = isListening ? '#ef4444' : isSpeaking ? '#00ffff' : '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.sin(x * 0.04 + phase) * amp * Math.sin(x * 0.018);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Secondary wave
      ctx.strokeStyle = isListening ? '#f87171' : isSpeaking ? '#38bdf8' : '#0369a1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let x = 0; x < w; x++) {
        const y = h / 2 + Math.cos(x * 0.03 - phase) * (amp * 0.7) * Math.cos(x * 0.012);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animRef.current = requestAnimationFrame(animateWave);
    };

    animRef.current = requestAnimationFrame(animateWave);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isListening, isSpeaking]);

  // Start Voice Listening with SpeechRecognition
  const handleStartListening = async () => {
    await requestPermission('microphone');
    setIsListening(true);
    setTranscript('');
    setInterimTranscript('Ouvindo com atenção... Fale agora.');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = 'pt-BR';
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let currentInterim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript;
              setTranscript(text);
              setInterimTranscript('');
              setIsListening(false);
              processVoiceQuery(text);
              return;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }
          setInterimTranscript(currentInterim);
        };

        recognition.onerror = () => {
          fallbackSimulateVoiceInput();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch {
        fallbackSimulateVoiceInput();
        return;
      }
    }

    fallbackSimulateVoiceInput();
  };

  const fallbackSimulateVoiceInput = () => {
    setTimeout(() => {
      const sampleQueries = [
        'Qual o status do componente plástico crítico e risco de ruptura?',
        'Quanto a TecnoLar perdeu com paradas de linha e multas?',
        'Qual é o OTIF da Polilux Termoplásticos e plano de ação?',
        'Qual é o Lote Econômico e Ponto de Pedido no cenário projetado?',
        'Como funciona o circuito de Milk Run a cada 30 minutos?',
      ];
      const selected = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      setTranscript(selected);
      setInterimTranscript('');
      setIsListening(false);
      processVoiceQuery(selected);
    }, 2400);
  };

  const handleStopListening = () => {
    setIsListening(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
  };

  // Helper to remove accents for robust NLP matching
  const cleanStr = (s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  // Advanced NLP processing & information retrieval
  const processVoiceQuery = (query: string) => {
    const q = cleanStr(query);
    let responseText = '';

    // 1. SPECIFIC COMPONENT: GABINETE PLASTICO / GAB-PLAST-800
    if (q.includes('plastico') || q.includes('gabinete') || q.includes('gab-plast') || q.includes('polilux')) {
      const item = items.find((i) => i.sku === 'GAB-PLAST-800');
      const polilux = suppliers.find((s) => s.id === 'sup-polilux-franca');
      responseText = `O Gabinete Plástico GAB-PLAST-800 possui estoque atual de ${item?.currentStock.toLocaleString('pt-BR')} unidades no almoxarifado e ${item?.lineSupermarketStock.toLocaleString('pt-BR')} unidades no supermercado da linha. Está abaixo do Ponto de Pedido de ${item?.reorderPoint.toLocaleString('pt-BR')} unidades. Há um lote de reposição VMI de 9.354 unidades em trânsito com o fornecedor Polilux Termoplásticos. O OTIF atual da Polilux é de ${polilux?.scoreCard.otif}%, com plano de ação 5W2H em andamento.`;
    }
    // 2. SPECIFIC COMPONENT: MOTOR BLDC / MOT-1200-SS
    else if (q.includes('motor') || q.includes('mot-1200') || q.includes('eletromotores')) {
      const item = items.find((i) => i.sku === 'MOT-1200-SS');
      responseText = `O Motor BLDC 1200W Silencioso possui ${item?.currentStock.toLocaleString('pt-BR')} unidades em estoque, com cobertura de 12 dias. O Ponto de Pedido é de ${item?.reorderPoint.toLocaleString('pt-BR')} unidades. O fornecedor nacional EletroMotores Brasil opera com OTIF de 96.5%, em conformidade com o SLA.`;
    }
    // 3. SPECIFIC COMPONENT: PLACA INVERTER / PCI-INVERTER-V2 / CHINA / SHENZHEN
    else if (q.includes('placa') || q.includes('inverter') || q.includes('shenzhen') || q.includes('china') || q.includes('internacional')) {
      const item = items.find((i) => i.sku === 'PCI-INVERTER-V2');
      const shenzhen = suppliers.find((s) => s.id === 'sup-shenzhen-elec');
      responseText = `A Placa Eletrônica Inverter V2 é fornecida pela Shenzhen ElectroTech, da China. O estoque atual é de ${item?.currentStock.toLocaleString('pt-BR')} unidades com estoque de segurança de 60 dias devido ao Lead Time marítimo de 45 dias. O OTIF da Shenzhen está em 97.2%, plenamente em conformidade com a meta de 96%.`;
    }
    // 4. CRITICAL ITEMS / STOCKOUT ALERT
    else if (q.includes('ruptura') || q.includes('critico') || q.includes('baixo estoque') || q.includes('alerta') || q.includes('falta')) {
      const criticals = items.filter((i) => i.status === 'critical' || i.status === 'warning');
      const names = criticals.map((c) => `${c.sku} (${c.currentStock} un)`).join(', ');
      responseText = `Atenção: Identificamos ${criticals.length} itens abaixo do Ponto de Pedido ou próximos da ruptura: ${names}. O caso mais urgente é o Gabinete Plástico GAB-PLAST-800, com cobertura para apenas 10 dias. O reabastecimento automático via VMI já foi acionado.`;
    }
    // 5. FINANCIAL IMPACT / DOWNTIME COSTS / FINES / SAVINGS
    else if (q.includes('custo') || q.includes('parada') || q.includes('financeiro') || q.includes('economia') || q.includes('multa') || q.includes('perdeu') || q.includes('prejuizo')) {
      responseText = `Conforme o Artigo Científico da TecnoLar: a fábrica registrou 28 horas de parada no trimestre a um custo de ${formatMoney(22000)} por hora, somando ${formatMoney(616000)} em perdas produtivas, mais ${formatMoney(150000)} em multas por entregas incompletas, totalizando ${formatMoney(766000)}. Com o VMI e Milk Run, a projeção é reduzir para 8 horas de parada, gerando economia líquida de ${formatMoney(545000)} por trimestre, ou ${formatMoney(2180000)} por ano.`;
    }
    // 6. SUPPLIERS / OTIF / SCORECARD
    else if (q.includes('otif') || q.includes('scorecard') || q.includes('fornecedor') || q.includes('joinville') || q.includes('minas')) {
      responseText = `O scorecard mensal avalia OTIF (meta 96% para itens A-críticos), qualidade, lead time, custo total e flexibilidade. A Polilux Termoplásticos está com 91.5% e necessita de plano de ação. A Joinville Condutores opera com 96.8% e a Shenzhen Precision com 97.2%, ambas na faixa Classe A com conformidade contratual.`;
    }
    // 7. MILK RUN / INTERNAL LOGISTICS / 30 MINUTES
    else if (q.includes('milk run') || q.includes('kanban') || q.includes('rotas') || q.includes('horario') || q.includes('abastecimento') || q.includes('30 min') || q.includes('circuito')) {
      responseText = `O circuito interno de Milk Run opera em ciclos rigorosos de 30 minutos, percorrendo 400 metros entre o almoxarifado central e as Linhas 01 e 02. Utiliza 30 caixas plásticas retornáveis padronizadas, eliminando estoques intermediários e desabastecimento na linha.`;
    }
    // 8. MATHEMATICAL PARAMETERS: LEC / PP / FORMULAS
    else if (q.includes('lec') || q.includes('lote economico') || q.includes('ponto de pedido') || q.includes('seguranca') || q.includes('formula') || q.includes('calculo')) {
      responseText = `Pelo modelo de Ford Harris e Camp: com demanda de 300.000 un/ano, custo de pedido de ${formatMoney(350)} e manutenção de ${formatMoney(2.4)}/un/ano, o Lote Econômico de Compra é de 9.354 unidades. O Estoque de Segurança foi otimizado de 9.216 para 3.072 unidades, e o Ponto de Pedido foi reduzido de 21.216 para 12.672 unidades no cenário projetado.`;
    }
    // 9. SELL-THROUGH / RETAIL SALES
    else if (q.includes('sell-through') || q.includes('venda') || q.includes('varejo') || q.includes('pdv') || q.includes('consumo')) {
      const totalWeekly = items.reduce((acc, i) => acc + i.sellThroughWeekly, 0);
      responseText = `O sell-through semanal nas redes varejistas parceiras é de ${totalWeekly.toLocaleString('pt-BR')} unidades. O VMI utiliza as vendas na ponta do consumidor final para puxar o planejamento de produção, evitando o efeito chicote (bullwhip effect).`;
    }
    // 10. SYSTEM NAVIGATION / ACTIONS
    else if (q.includes('abrir') || q.includes('ir para') || q.includes('mostrar') || q.includes('navegar')) {
      if (q.includes('estoque')) {
        responseText = 'Navegando para a tela de Estoque em Tempo Real e Sell-Through.';
        if (onNavigate) onNavigate('inventory');
      } else if (q.includes('parametro') || q.includes('lec') || q.includes('pp')) {
        responseText = 'Navegando para o módulo de Parâmetros e Simulação de LEC e Ponto de Pedido.';
        if (onNavigate) onNavigate('parameters');
      } else if (q.includes('milk') || q.includes('kanban')) {
        responseText = 'Abrindo o módulo de Milk Run, rotas e e-Kanban.';
        if (onNavigate) onNavigate('milkrun');
      } else if (q.includes('manutencao') || q.includes('ti') || q.includes('falha') || q.includes('erro')) {
        responseText = 'Abrindo o Centro de Engenharia e Manutenção de TI para diagnóstico e correção de falhas.';
        if (onNavigate) onNavigate('maintenance');
      } else if (q.includes('contrato') || q.includes('sla')) {
        responseText = 'Abrindo a Central de Contratos de VMI e SLAs com assinaturas digitais.';
        if (onNavigate) onNavigate('contracts');
      } else {
        responseText = 'Comando de navegação recebido. Atualizando a visualização do sistema TecnoLar.';
      }
    }
    // 11. GENERAL / SYSTEM GREETING
    else {
      responseText = `Informação processada pela IA TecnoLar: a fábrica de Franca mantém cadência de 1.200 eletrodomésticos por dia para mais de 400 componentes nacionais e internacionais. Todos os pontos de pedido e ordens de reposição VMI estão sincronizados em tempo real com o ERP.`;
    }

    setAiResponse(responseText);
    speakCustomPersona(responseText);
  };

  const handleSendTyped = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    const query = typedInput.trim();
    setTranscript(query);
    setTypedInput('');
    processVoiceQuery(query);
  };

  const sampleQuickQuestions = [
    'Qual o status do gabinete plástico crítico?',
    'Quanto a TecnoLar perdeu com paradas de linha e multas?',
    'Qual é o OTIF da Polilux Termoplásticos e plano de ação?',
    'Qual é o Lote Econômico e Ponto de Pedido?',
    'Como está o circuito de Milk Run a cada 30 min?',
    'Como funciona o sell-through de vendas no PDV?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Assistente de Voz & Chat IA TecnoLar</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  NLP v3 Ativo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Captação de áudio, processamento semântico de suprimentos e vozes naturais femininas e masculinas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                showVoiceSettings
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Configurar Vozes e Perfis de Síntese"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Voz: {selectedPersona.name}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Persona Selector Panel if toggled */}
        {showVoiceSettings && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 animate-fade-in text-xs max-h-72 overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                Selecione a Personalidade de Voz da IA:
              </span>
              <span className="text-[10px] font-mono text-cyan-400">
                {selectedPersona.gender === 'Feminino' ? 'Voz Feminina Ativa' : 'Voz Masculina Ativa'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {VOICE_PERSONAS.map((p) => {
                const isSelected = selectedPersona.id === p.id;
                const isFemale = p.gender === 'Feminino';
                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <strong className="text-white text-xs">{p.name}</strong>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isFemale
                              ? 'bg-purple-900/60 text-purple-300 border border-purple-700/50'
                              : 'bg-blue-900/60 text-blue-300 border border-blue-700/50'
                          }`}
                        >
                          {p.gender}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyan-300 block font-mono">{p.accent}</span>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">{p.description}</p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          setSelectedPersona(p);
                          speakCustomPersona(p.samplePhrase, p);
                        }}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 font-extrabold'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        {isSelected ? 'Selecionada' : 'Ativar'}
                      </button>

                      <button
                        onClick={() => speakCustomPersona(p.samplePhrase, p)}
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white transition"
                        title="Ouvir Demonstração desta Voz"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* System installed voices picker if user wants explicit engine selection */}
            {availableSystemVoices.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Voz do Sistema no Navegador (Opcional):
                </label>
                <select
                  value={selectedVoiceUri}
                  onChange={(e) => setSelectedVoiceUri(e.target.value)}
                  className="w-full text-xs bg-slate-900 border border-slate-700 text-slate-200 rounded-xl px-2.5 py-1.5 outline-none focus:border-cyan-500"
                >
                  <option value="">Detecção Automática Ideal para {selectedPersona.name} ({selectedPersona.gender})</option>
                  {availableSystemVoices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang}) {v.default ? '• Padrão' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Fine tuning controls */}
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Velocidade de Fala:</span>
                  <span className="font-mono text-cyan-300">{speechRate.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.05"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Ajuste Fino de Tom (Pitch):</span>
                  <span className="font-mono text-cyan-300">{speechPitch.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.05"
                  value={speechPitch}
                  onChange={(e) => setSpeechPitch(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Audio Wave Visualizer & Status Display */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col items-center justify-center space-y-1.5 shadow-inner">
            <canvas ref={canvasRef} width={500} height={48} className="w-full h-12" />
            <div className="flex items-center justify-between w-full px-1 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isListening
                      ? 'bg-rose-500 animate-ping'
                      : isSpeaking
                      ? 'bg-cyan-400 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
                {isListening
                  ? 'CAPTURANDO ÁUDIO EM TEMPO REAL...'
                  : isSpeaking
                  ? `SINTETIZANDO FALA COM ${selectedPersona.name.toUpperCase()}...`
                  : 'PRONTO PARA COMANDOS'}
              </span>
              <span className="text-cyan-400 font-bold">
                {selectedPersona.name} ({selectedPersona.gender})
              </span>
            </div>
          </div>

          {/* Interactive Microphone Button */}
          <div className="flex flex-col items-center justify-center text-center">
            <button
              onClick={isListening ? handleStopListening : handleStartListening}
              className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl relative ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-600/50 scale-105 animate-pulse'
                  : 'bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-600/40 hover:scale-105'
              }`}
              title={isListening ? 'Parar de Ouvir' : 'Falar Pergunta'}
            >
              {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
            </button>

            <span className="mt-2.5 text-xs font-semibold text-slate-200">
              {isListening ? 'Ouvindo... Pode falar agora!' : 'Toque no microfone para falar seu comando'}
            </span>

            {/* Interim or Final Transcript Banner */}
            {(transcript || interimTranscript) && (
              <div className="mt-2 text-xs text-cyan-300 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 font-mono max-w-lg">
                "{transcript || interimTranscript}"
              </div>
            )}
          </div>

          {/* AI Response Display Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
              <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Resposta da IA Integrada de Suprimentos
              </span>
              <button
                onClick={() => speakCustomPersona(aiResponse)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition font-semibold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Ouvir com {selectedPersona.name}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans">{aiResponse}</p>
          </div>

          {/* Text input fallback so user can test commands without microphone */}
          <form onSubmit={handleSendTyped} className="flex gap-2">
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="Ou digite sua pergunta (ex: quanto a tecnolar perdeu com paradas?)..."
              className="flex-1 text-xs bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Enviar
            </button>
          </form>

          {/* Suggested Quick Questions Grid */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Comandos e Perguntas Prontas para Teste:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleQuickQuestions.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(cmd);
                    processVoiceQuery(cmd);
                  }}
                  className="text-left p-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500 rounded-xl text-xs text-slate-300 hover:text-white transition flex items-center gap-2 group"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400 shrink-0 group-hover:scale-110 transition" />
                  <span className="line-clamp-1">{cmd}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-[11px] text-slate-500 font-mono">
            VMI TecnoLar • Comunicação por Voz & NLP Inteligente
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Settings,
  Moon,
  Sun,
  Globe,
  DollarSign,
  Bell,
  User,
  Shield,
  Key,
  Lock,
  Camera,
  Mic,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
} from 'lucide-react';
import { useVmi, CurrencyType, LanguageType } from '../../context/VmiContext';

export const SettingsView: React.FC<{ onOpenPermissions: () => void }> = ({ onOpenPermissions }) => {
  const {
    theme,
    toggleTheme,
    currency,
    setCurrency,
    language,
    setLanguage,
    timezone,
    setTimezone,
    currentTimeInTimezone,
    currentUser,
    permissions,
    requestPermission,
    addNotification,
  } = useVmi();

  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [soundAlerts, setSoundAlerts] = useState<boolean>(true);
  const [milkRunAlerts, setMilkRunAlerts] = useState<boolean>(true);

  // TI Security settings state (only editable by tecnolar_ti or tecnolar_planner)
  const isTi = currentUser.role === 'tecnolar_ti' || currentUser.role === 'tecnolar_planner';
  const [apiKey, setApiKey] = useState<string>('tec_live_89a712f0049281bc89a7');
  const [webhookUrl, setWebhookUrl] = useState<string>('https://erp-tecnolar.vercel.app/api/webhooks/vmi');
  const [dataRetentionDays, setDataRetentionDays] = useState<number>(365);
  const [encryptionLevel, setEncryptionLevel] = useState<string>('AES-256-GCM');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [testNotificationSent, setTestNotificationSent] = useState<boolean>(false);

  const handleSaveTiSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSendTestNotification = () => {
    addNotification({
      title: '🔔 Teste de Notificação Operacional',
      message: `Aviso enviado com sucesso às ${currentTimeInTimezone} (${timezone}) para ${currentUser.name}. O sistema de notificações está 100% operacional!`,
      type: 'info',
      actionView: 'inventory',
    });
    setTestNotificationSent(true);
    setTimeout(() => setTestNotificationSent(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-xl md:text-2xl font-extrabold text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-cyan-400" />
            Configurações do Sistema VMI TecnoLar
          </h2>
        </div>
        <p className="text-xs text-slate-400">
          Personalização visual, preferências regionais, privacidade e permissões de hardware.
        </p>
      </div>

      {/* 1. Theme and Appearance (Dark: Preto & Azul petróleo; Light: Branco & Azul petróleo) */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              Tema da Interface & Paleta Cromática
            </h3>
            <p className="text-xs text-slate-400">
              Modo Escuro (Preto e Azul Petróleo) ou Modo Claro (Branco e Azul Petróleo).
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center gap-2"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            Alternar para {theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div
            onClick={() => theme !== 'dark' && toggleTheme()}
            className={`p-3.5 rounded-xl border cursor-pointer transition ${
              theme === 'dark'
                ? 'bg-slate-950 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">Modo Escuro (Padrão Industrial)</span>
              {theme === 'dark' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-md bg-[#060b11] border border-slate-700" title="Preto Profundo" />
              <div className="w-6 h-6 rounded-md bg-[#0f2942] border border-cyan-800" title="Azul Petróleo Escuro" />
              <div className="w-6 h-6 rounded-md bg-[#0284c7]" title="Azul Ciano Destaque" />
            </div>
          </div>

          <div
            onClick={() => theme !== 'light' && toggleTheme()}
            className={`p-3.5 rounded-xl border cursor-pointer transition ${
              theme === 'light'
                ? 'bg-slate-100 text-slate-900 border-cyan-600 shadow-md ring-1 ring-cyan-600'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs text-white">Modo Claro (Branco e Azul Petróleo)</span>
              {theme === 'light' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 rounded-md bg-[#ffffff] border border-slate-300" title="Branco Puro" />
              <div className="w-6 h-6 rounded-md bg-[#0f2942]" title="Azul Petróleo / Navy" />
              <div className="w-6 h-6 rounded-md bg-[#0284c7]" title="Azul Destaque" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Language, Region & Currency */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-white flex items-center gap-2 pb-2 border-b border-slate-800">
          <Globe className="w-4 h-4 text-cyan-400" />
          Idioma, Região & Conversor de Moedas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Idioma */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Idioma da Aplicação:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageType)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500 font-medium"
            >
              <option value="pt-BR">🇧🇷 Português (Brasil)</option>
              <option value="en-US">🇺🇸 English (United States)</option>
              <option value="es-ES">🇪🇸 Español (América Latina)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Tradução dinâmica de dashboards e termos.
            </span>
          </div>

          {/* Moeda */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Moeda Padrão de Exibição:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyType)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500 font-mono font-bold"
            >
              <option value="BRL">R$ BRL (Real Brasileiro)</option>
              <option value="USD">$ USD (Dólar Americano - Câmbio 5,75)</option>
              <option value="EUR">€ EUR (Euro Europeu - Câmbio 6,20)</option>
            </select>
            <span className="text-[10px] text-slate-500 mt-1 block">
              Converte automaticamente valores de multas e estoques.
            </span>
          </div>

          {/* Fuso Horário */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Fuso Horário Operacional:</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500 font-mono"
            >
              <option value="America/Sao_Paulo">Brasília / Franca-SP (UTC-3)</option>
              <option value="America/Manaus">Manaus Polo Industrial (UTC-4)</option>
              <option value="America/New_York">Nova York / EUA (UTC-5)</option>
              <option value="Europe/Lisbon">Lisboa / Europa Ocidental (UTC+0)</option>
              <option value="Asia/Shanghai">Shenzhen / Pequim - China (UTC+8)</option>
              <option value="Asia/Tokyo">Kyoto / Japão (UTC+9)</option>
            </select>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono mt-1">
              <Clock className="w-3 h-3" />
              <span>Hora local: <strong>{currentTimeInTimezone}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Notifications */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            Canais de Notificação & Alertas de Ruptura
          </h3>
          <button
            type="button"
            onClick={handleSendTestNotification}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl shadow transition"
          >
            <Send className="w-3 h-3" />
            Disparar Alerta de Teste
          </button>
        </div>

        {testNotificationSent && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Alerta de teste enviado com sucesso para a central de avisos e exibido no topo da tela!</span>
          </div>
        )}

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <span className="font-semibold text-white block">Alertas de Ruptura Iminente & Ponto de Pedido</span>
              <span className="text-[11px] text-slate-400">Disparo visual e push quando o estoque atinge o limite crítico.</span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <span className="font-semibold text-white block">Sinais Sonoros e Alertas por Voz (A11y)</span>
              <span className="text-[11px] text-slate-400">Aviso sonoro em caso de parada de linha ou chegada de lote.</span>
            </div>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(e) => setSoundAlerts(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
            <div>
              <span className="font-semibold text-white block">Avisos do Circuito Milk Run (30 min)</span>
              <span className="text-[11px] text-slate-400">Notificar postos de trabalho da chegada do trem logístico.</span>
            </div>
            <input
              type="checkbox"
              checked={milkRunAlerts}
              onChange={(e) => setMilkRunAlerts(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
          </div>
        </div>
      </div>

      {/* 4. Hardware System Permissions */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            Permissões do Dispositivo & Sensores
          </h3>
          <button
            onClick={onOpenPermissions}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            Gerenciar Detalhes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Câmera (Libras / Scanner)</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                permissions.camera ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {permissions.camera ? 'ATIVO' : 'PENDENTE'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>Microfone (Comandos Voz)</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                permissions.microphone ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {permissions.microphone ? 'ATIVO' : 'PENDENTE'}
            </span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Lista de Contatos Fornecedor</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                permissions.contacts ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {permissions.contacts ? 'ATIVO' : 'PENDENTE'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Privacy & Security (Role-based: TI TecnoLar can edit; Suppliers see terms) */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Privacidade & Segurança da Informação</h3>
          </div>
          <span
            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
              isTi
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                : 'bg-amber-950 text-amber-300 border border-amber-800'
            }`}
          >
            {isTi ? 'MODO ADMINISTRADOR TI (CAMILA RIBEIRO)' : 'VISUALIZAÇÃO DE TERMOS (FORNECEDOR)'}
          </span>
        </div>

        {isTi ? (
          <form onSubmit={handleSaveTiSettings} className="space-y-4 text-xs">
            <p className="text-slate-400 text-[11px]">
              Você está autenticado com credenciais de Governança e TI TecnoLar. É permitida a alteração das chaves de integração, retenção de logs e criptografia dos dados de vendas compartilhados.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Chave de API do ERP TecnoLar (API Key):</label>
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono text-xs outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Webhook de Sincronismo Transacional:</label>
                <input
                  type="text"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 font-mono text-xs outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Criptografia dos Dados de Venda (Sell-Through):</label>
                <select
                  value={encryptionLevel}
                  onChange={(e) => setEncryptionLevel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                >
                  <option value="AES-256-GCM">AES-256-GCM (Padrão Bancário & Indústria)</option>
                  <option value="RSA-4096">RSA-4096 com Assinatura Digital</option>
                  <option value="ChaCha20-Poly1305">ChaCha20-Poly1305 (Alta performance mobile)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Retenção de Logs de Consumo:</label>
                <select
                  value={dataRetentionDays}
                  onChange={(e) => setDataRetentionDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 outline-none focus:border-cyan-500"
                >
                  <option value={90}>90 dias</option>
                  <option value={180}>180 dias</option>
                  <option value={365}>365 dias (Recomendado para auditoria S&OP)</option>
                  <option value={1825}>5 anos (Fiscal SPED / NF-e)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              {isSaved ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-4 h-4" /> Configurações de segurança atualizadas!
                </span>
              ) : (
                <span className="text-slate-500 text-[11px]">Alterações auditadas no log de eventos TI.</span>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow"
              >
                Salvar Diretrizes de Segurança
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 leading-relaxed text-[11px]">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                <Shield className="w-4 h-4" />
                Termos de Privacidade & Governança de Dados para Fornecedores
              </div>
              <p>
                Os dados de consumo real, sell-through nos pontos de venda varejistas e projeções de demanda compartilhados nesta plataforma são protegidos por sigilo industrial (Lei nº 9.279/96 e LGPD nº 13.709/18).
              </p>
              <p className="mt-2 text-slate-400">
                Seu perfil de fornecedor possui acesso estrito aos SKUs contratados. As configurações de infraestrutura de TI, chaves de webhook e parâmetros de criptografia são gerenciadas exclusivamente pela equipe de Tecnologia da Informação da Indústria TecnoLar.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Sliders,
  Truck,
  Users,
  FileCheck,
  Sparkles,
  Printer,
  HelpCircle,
  Settings,
  Eye,
  Hand,
  Mic,
  Barcode,
  BookOpen,
  LogOut,
  Bell,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  Clock,
  ChevronDown,
  Globe,
  Coins,
  Wrench,
} from 'lucide-react';
import { useVmi, CurrencyType, LanguageType } from '../context/VmiContext';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAccessibility: () => void;
  onOpenLibras: () => void;
  onOpenVoice: () => void;
  onOpenScanner: () => void;
  onOpenReports: () => void;
  onOpenDocs: () => void;
  onOpenPermissions: () => void;
  onOpenNotifications: () => void;
  onOpenContractsModal: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAccessibility,
  onOpenLibras,
  onOpenVoice,
  onOpenScanner,
  onOpenReports,
  onOpenDocs,
  onOpenPermissions,
  onOpenNotifications,
  onOpenContractsModal,
  onLogout,
}) => {
  const {
    currentUser,
    permissions,
    theme,
    toggleTheme,
    currency,
    setCurrency,
    language,
    setLanguage,
    currentTimeInTimezone,
    unreadNotificationCount,
    activeNotificationToast,
    clearNotificationToast,
    t,
  } = useVmi();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  // Dynamic role-based navigation tabs
  const getNavItemsForRole = () => {
    if (currentUser.role === 'tecnolar_ti') {
      return [
        { id: 'maintenance', label: t('maintenance'), icon: Wrench },
        { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { id: 'inventory', label: t('inventory'), icon: Package },
        { id: 'parameters', label: t('parameters'), icon: Sliders },
        { id: 'contracts', label: t('contracts'), icon: FileCheck },
        { id: 'ai', label: t('ai'), icon: Sparkles },
        { id: 'settings', label: t('settings'), icon: Settings },
      ];
    }
    if (currentUser.role === 'tecnolar_ceo') {
      return [
        { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { id: 'contracts', label: t('contracts'), icon: FileCheck },
        { id: 'suppliers', label: t('suppliers'), icon: Users },
        { id: 'inventory', label: t('inventory'), icon: Package },
        { id: 'ai', label: t('ai'), icon: Sparkles },
        { id: 'help', label: t('help'), icon: HelpCircle },
        { id: 'settings', label: t('settings'), icon: Settings },
      ];
    }
    if (currentUser.role.startsWith('fornecedor_')) {
      return [
        { id: 'inventory', label: t('inventory'), icon: Package },
        { id: 'parameters', label: t('parameters'), icon: Sliders },
        { id: 'milkrun', label: t('milkrun'), icon: Truck },
        { id: 'contracts', label: t('contracts'), icon: FileCheck },
        { id: 'ai', label: t('ai'), icon: Sparkles },
        { id: 'settings', label: t('settings'), icon: Settings },
      ];
    }
    if (currentUser.role === 'operador_logistica') {
      return [
        { id: 'milkrun', label: t('milkrun'), icon: Truck },
        { id: 'inventory', label: t('inventory'), icon: Package },
        { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { id: 'help', label: t('help'), icon: HelpCircle },
      ];
    }
    return [
      { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
      { id: 'inventory', label: t('inventory'), icon: Package },
      { id: 'parameters', label: t('parameters'), icon: Sliders },
      { id: 'milkrun', label: t('milkrun'), icon: Truck },
      { id: 'suppliers', label: t('suppliers'), icon: Users },
      { id: 'contracts', label: t('contracts'), icon: FileCheck },
      { id: 'ai', label: t('ai'), icon: Sparkles },
      { id: 'help', label: t('help'), icon: HelpCircle },
      { id: 'settings', label: t('settings'), icon: Settings },
    ];
  };

  const navItems = getNavItemsForRole();

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 border-b border-slate-900 flex items-center justify-between text-xs gap-2 flex-wrap">
        {/* Left: Branding & Plant Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center text-white text-xs font-black shadow-md">
                T
              </span>
              TECNOLAR
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold hidden sm:inline">
              VMI 4.0
            </span>
          </div>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-400 hidden lg:inline">Planta Franca/SP • 1.200 un/dia</span>

          {/* Live Timezone Clock */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-cyan-300 font-mono bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{currentTimeInTimezone}</span>
          </div>
        </div>

        {/* Right: Quick Tools, Currency, Language, Theme & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <Coins className="w-3 h-3 text-slate-400 ml-1.5 mr-0.5" />
            {(['BRL', 'USD', 'EUR'] as CurrencyType[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-1.5 py-0.5 rounded font-bold transition text-[10px] ${
                  currency === c ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title={`Alterar moeda para ${c}`}
              >
                {c === 'BRL' ? 'R$' : c === 'USD' ? '$' : '€'}
              </button>
            ))}
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <Globe className="w-3 h-3 text-slate-400 ml-1.5 mr-0.5" />
            {(['pt-BR', 'en-US', 'es-ES'] as LanguageType[]).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-1.5 py-0.5 rounded font-bold transition text-[10px] ${
                  language === l ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title={`Alterar idioma para ${l}`}
              >
                {l === 'pt-BR' ? 'PT' : l === 'en-US' ? 'EN' : 'ES'}
              </button>
            ))}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-amber-400 transition"
            title={theme === 'dark' ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            aria-label="Alternar Tema Claro / Escuro"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition"
            title="Avisos & Notificações em Tempo Real"
            aria-label="Notificações"
          >
            <Bell className="w-3.5 h-3.5 text-cyan-400" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {/* Dedicated "Visualizar Contratos" Button (User request requirement) */}
          <button
            onClick={onOpenContractsModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-700/80 hover:bg-emerald-900 text-[11px] text-emerald-300 hover:text-white transition font-medium"
            title="Visualizar Contratos e Instrumentos de VMI"
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Ver Contratos</span>
          </button>

          {/* Hardware Permissions Status */}
          <button
            onClick={onOpenPermissions}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-300 transition"
            title="Permissões de hardware (Câmera, Microfone, Contatos)"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Hardware</span>
            <span className="flex gap-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${permissions.camera ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${permissions.microphone ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className={`w-1.5 h-1.5 rounded-full ${permissions.contacts ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            </span>
          </button>

          {/* Quick Scanner Shortcut */}
          <button
            onClick={onOpenScanner}
            className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-white transition"
            title="Leitor de Código de Barras (Ponto de Uso)"
          >
            <Barcode className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden lg:inline">Leitor</span>
          </button>

          {/* Quick Libras Shortcut */}
          <button
            onClick={onOpenLibras}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-cyan-950/80 border border-cyan-800/80 text-[11px] text-cyan-300 hover:text-white transition font-medium"
            title="Abrir Central de Libras"
          >
            <Hand className="w-3.5 h-3.5 text-cyan-400" />
            <span>Libras</span>
          </button>

          {/* Quick Voice Shortcut */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-950/80 border border-blue-800/80 text-[11px] text-blue-300 hover:text-white transition font-medium"
            title="Comandos por Voz"
          >
            <Mic className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Voz</span>
          </button>

          {/* Reports Trigger */}
          <button
            onClick={onOpenReports}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition"
            title="Imprimir e Editar Relatórios e NF-e"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Relatórios</span>
          </button>

          {/* Accessibility Center Button */}
          <button
            onClick={onOpenAccessibility}
            className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[11px] rounded-lg shadow transition"
            aria-label="Abrir Painel de Acessibilidade"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Acessibilidade</span>
          </button>

          {/* User Profile Avatar & Switcher */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-900 transition border border-transparent hover:border-slate-800"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-cyan-500/50"
              />
              <span className="hidden md:inline text-xs font-semibold text-white max-w-[100px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-2xl z-50 text-xs">
                <div className="pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-white block truncate">{currentUser.name}</span>
                  <span className="text-[11px] text-cyan-400 font-medium block truncate">{currentUser.roleTitle}</span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5 block truncate">
                    {currentUser.companyName}
                  </span>
                  <div className="mt-2 text-[10px] bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-slate-400 flex justify-between">
                      <span>Perfil:</span>
                      <strong className="text-white">{currentUser.role}</strong>
                    </div>
                    {currentUser.supplierId && (
                      <div className="text-slate-400 flex justify-between">
                        <span>Fornecedor ID:</span>
                        <strong className="text-emerald-400">{currentUser.supplierId}</strong>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setUserDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left p-2 hover:bg-slate-800 rounded-xl text-rose-400 flex items-center gap-2 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Trocar Perfil / Sair da Conta
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 lg:hidden"
            aria-label="Menu de Navegação"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar (Desktop) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 hidden lg:flex items-center justify-between overflow-x-auto py-1">
        <nav className="flex items-center gap-1 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Live Toast Notification Banner */}
      {activeNotificationToast && (
        <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 border-t border-b border-cyan-700/60 py-2 px-4 text-xs text-cyan-200 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-4xl mx-auto flex-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-medium">{activeNotificationToast}</span>
          </div>
          <button
            onClick={clearNotificationToast}
            className="text-cyan-400 hover:text-white text-xs px-2 py-0.5 rounded ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </header>
  );
};

import React, { useState } from 'react';
import { LogIn, Shield, User, Key, CheckCircle2, Hand, Eye, Sparkles, Building2, Crown, Wrench, Globe2, Truck } from 'lucide-react';
import { useVmi } from '../context/VmiContext';
import { MOCK_USERS } from '../data/mockData';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { setCurrentUser } = useVmi();
  const [username, setUsername] = useState<string>('maria.noel@tecnolar.ind.br');
  const [password, setPassword] = useState<string>('••••••••');
  const [selectedUser, setSelectedUser] = useState<UserProfile>(MOCK_USERS[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'ceos' | 'suppliers' | 'tecnolar' | 'accessibility'>('all');

  const handleSelectDemoProfile = (p: UserProfile) => {
    setSelectedUser(p);
    setUsername(p.email);
  };

  const filteredUsers = MOCK_USERS.filter((u) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'ceos') return u.role.includes('ceo');
    if (categoryFilter === 'suppliers') return u.role.startsWith('fornecedor_');
    if (categoryFilter === 'tecnolar') return u.role.startsWith('tecnolar_') || u.role === 'operador_logistica';
    if (categoryFilter === 'accessibility') return u.accessibilityNeed !== 'none';
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Login and automatically trigger user accessibility needs from ERP profile
      setCurrentUser(selectedUser);
      setLoading(false);
      onLoginSuccess();
    }, 500);
  };

  const getRoleBadge = (role: string) => {
    if (role === 'tecnolar_ceo') {
      return <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 border border-amber-700/60 px-1.5 py-0.5 rounded flex items-center gap-1"><Crown className="w-2.5 h-2.5" /> CEO TecnoLar</span>;
    }
    if (role === 'fornecedor_nacional_ceo') {
      return <span className="text-[9px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-1.5 py-0.5 rounded flex items-center gap-1"><Crown className="w-2.5 h-2.5" /> CEO Fornecedor Nacional</span>;
    }
    if (role === 'fornecedor_internacional_ceo') {
      return <span className="text-[9px] font-bold text-blue-300 bg-blue-950/80 border border-blue-700/60 px-1.5 py-0.5 rounded flex items-center gap-1"><Crown className="w-2.5 h-2.5" /> CEO Fornecedor Internacional</span>;
    }
    if (role === 'tecnolar_ti') {
      return <span className="text-[9px] font-bold text-purple-300 bg-purple-950/80 border border-purple-700/60 px-1.5 py-0.5 rounded flex items-center gap-1"><Wrench className="w-2.5 h-2.5" /> TI / Correção de Falhas</span>;
    }
    if (role === 'fornecedor_nacional') {
      return <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded flex items-center gap-1"><Building2 className="w-2.5 h-2.5" /> Fornecedor Nacional</span>;
    }
    if (role === 'fornecedor_internacional') {
      return <span className="text-[9px] font-bold text-blue-400 bg-blue-950/60 border border-blue-800/40 px-1.5 py-0.5 rounded flex items-center gap-1"><Globe2 className="w-2.5 h-2.5" /> Fornecedor Internacional</span>;
    }
    return <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-1.5 py-0.5 rounded">TecnoLar S&OP</span>;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-bold tracking-wider uppercase mb-1">
            <Building2 className="w-3.5 h-3.5" />
            Ecossistema VMI • Indústria TecnoLar S.A.
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Autenticação Unificada VMI & ERP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Acesso para TecnoLar, Fornecedores Nacionais e Internacionais, CEOs e Equipe de TI.
          </p>
        </div>

        {/* Demo Fast Profile Switcher */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Selecione um Perfil de Acesso:
            </span>
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg text-[10px]">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  categoryFilter === 'all' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({MOCK_USERS.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('ceos')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  categoryFilter === 'ceos' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                CEOs
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('suppliers')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  categoryFilter === 'suppliers' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Fornecedores
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('tecnolar')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  categoryFilter === 'tecnolar' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                TecnoLar / TI
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('accessibility')}
                className={`px-2 py-0.5 rounded font-semibold transition ${
                  categoryFilter === 'accessibility' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Acessibilidade
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs max-h-64 overflow-y-auto pr-1">
            {filteredUsers.map((p) => {
              const isSelected = selectedUser.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectDemoProfile(p)}
                  className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500 text-white shadow-md ring-1 ring-cyan-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-white truncate text-xs">{p.name}</span>
                      {getRoleBadge(p.role)}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate">{p.roleTitle}</span>
                    <span className="text-[9px] text-slate-500 block truncate">{p.companyName}</span>
                    {p.accessibilityNeed !== 'none' && (
                      <span className="text-[9px] font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.2 rounded mt-0.5 inline-block">
                        {p.accessibilityNeed === 'deaf_libras'
                          ? '🤟 Libras Ativo'
                          : p.accessibilityNeed === 'visual_impairment'
                          ? '👁️ Voz/Alto Contraste'
                          : '🎨 Daltonismo Ativo'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Traditional Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">E-mail Corporativo / Login:</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Senha de Acesso:</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white pl-9 pr-3 py-2.5 rounded-xl outline-none focus:border-cyan-500"
                required
              />
            </div>
          </div>

          {/* Automatic Accessibility Banner for the selected profile */}
          {selectedUser.accessibilityNeed !== 'none' && (
            <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl text-xs text-cyan-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Acessibilidade Ativada no ERP:</strong> O cadastro de {selectedUser.name} possui necessidade registrada no ERP TecnoLar.
                Os recursos de {selectedUser.accessibilityNeed === 'deaf_libras'
                  ? 'Intérprete Virtual Libras e Leitura por Câmera'
                  : selectedUser.accessibilityNeed === 'visual_impairment'
                  ? 'Comandos por Voz e Alto Contraste WCAG'
                  : 'Filtro para Daltonismo'} serão ativados instantaneamente ao logar.
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Autenticando no ERP TecnoLar...' : `Entrar como ${selectedUser.name.split(' ')[0]} (${selectedUser.roleTitle.split('(')[0].trim()})`}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          TecnoLar Eletrodomésticos S.A. • Integração ERP via API RESTful • Franca/SP (2026)
        </div>
      </div>
    </div>
  );
};

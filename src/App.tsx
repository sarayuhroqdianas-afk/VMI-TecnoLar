import React, { useState } from 'react';
import { VmiProvider, useVmi } from './context/VmiContext';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { AccessibilityModal } from './components/AccessibilityModal';
import { LibrasAssistant } from './components/LibrasAssistant';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { ReportsModal } from './components/ReportsModal';
import { DocumentationModal } from './components/DocumentationModal';
import { PermissionsModal } from './components/PermissionsModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ContractViewerModal } from './components/ContractViewerModal';

// Views
import { DashboardView } from './components/views/DashboardView';
import { InventoryView } from './components/views/InventoryView';
import { ParametersView } from './components/views/ParametersView';
import { MilkRunView } from './components/views/MilkRunView';
import { SuppliersView } from './components/views/SuppliersView';
import { ContractsView } from './components/views/ContractsView';
import { AiForecastingView } from './components/views/AiForecastingView';
import { HelpDeskView } from './components/views/HelpDeskView';
import { SettingsView } from './components/views/SettingsView';
import { MaintenanceView } from './components/views/MaintenanceView';

const AppContent: React.FC = () => {
  const { accessibility, selectedContractForModal, setSelectedContractForModal, currentUser } = useVmi();
  const [currentView, setCurrentView] = useState<string>(
    currentUser.role === 'tecnolar_ti' ? 'maintenance' : 'dashboard'
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Automatically adapt landing view when switching profiles
  React.useEffect(() => {
    if (currentUser.role === 'tecnolar_ti') {
      setCurrentView('maintenance');
    } else if (currentUser.role === 'operador_logistica') {
      setCurrentView('milkrun');
    } else if (currentUser.role.startsWith('fornecedor_')) {
      setCurrentView('inventory');
    } else if (currentUser.role === 'tecnolar_ceo') {
      setCurrentView('dashboard');
    }
  }, [currentUser.id, currentUser.role]);

  // Modals state
  const [showAccessibility, setShowAccessibility] = useState<boolean>(false);
  const [showLibras, setShowLibras] = useState<boolean>(false);
  const [showVoice, setShowVoice] = useState<boolean>(false);
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [showReports, setShowReports] = useState<boolean>(false);
  const [showDocs, setShowDocs] = useState<boolean>(false);
  const [showPermissions, setShowPermissions] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showContractsModal, setShowContractsModal] = useState<boolean>(false);

  if (!isAuthenticated) {
    return <AuthScreen onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* SVG Filters for Daltonism (WCAG Compliant Color Blindness Matrices) */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          {/* Protanopia (Red-blind) */}
          <filter id="protanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.567, 0.433, 0, 0, 0
                      0.558, 0.442, 0, 0, 0
                      0, 0.242, 0.758, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          {/* Deuteranopia (Green-blind) */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.625, 0.375, 0, 0, 0
                      0.700, 0.300, 0, 0, 0
                      0, 0.300, 0.700, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
          {/* Tritanopia (Blue-blind) */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              type="matrix"
              values="0.95, 0.05, 0, 0, 0
                      0, 0.433, 0.567, 0, 0
                      0, 0.475, 0.525, 0, 0
                      0, 0, 0, 1, 0"
            />
          </filter>
        </defs>
      </svg>

      {/* Main Responsive Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onOpenAccessibility={() => setShowAccessibility(true)}
        onOpenLibras={() => setShowLibras(true)}
        onOpenVoice={() => setShowVoice(true)}
        onOpenScanner={() => setShowScanner(true)}
        onOpenReports={() => setShowReports(true)}
        onOpenDocs={() => setShowDocs(true)}
        onOpenPermissions={() => setShowPermissions(true)}
        onOpenNotifications={() => setShowNotifications(true)}
        onOpenContractsModal={() => setShowContractsModal(true)}
        onLogout={() => setIsAuthenticated(false)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Dynamic Views */}
        {currentView === 'maintenance' && <MaintenanceView />}
        {currentView === 'dashboard' && <DashboardView onNavigate={setCurrentView} />}
        {currentView === 'inventory' && (
          <InventoryView onOpenScanner={() => setShowScanner(true)} />
        )}
        {currentView === 'parameters' && <ParametersView />}
        {currentView === 'milkrun' && <MilkRunView />}
        {currentView === 'suppliers' && <SuppliersView />}
        {currentView === 'contracts' && <ContractsView />}
        {currentView === 'ai' && (
          <AiForecastingView
            onOpenVoice={() => setShowVoice(true)}
            onOpenLibras={() => setShowLibras(true)}
          />
        )}
        {currentView === 'help' && <HelpDeskView />}
        {currentView === 'settings' && (
          <SettingsView onOpenPermissions={() => setShowPermissions(true)} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 TecnoLar Eletrodomésticos S.A. • Sistema Integrado VMI & ERP • Planta Industrial Franca-SP
          </span>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowContractsModal(true)} className="hover:text-emerald-400 transition font-medium">
              Contratos & SLAs
            </button>
            <span>•</span>
            <button onClick={() => setShowDocs(true)} className="hover:text-cyan-400 transition">
              Arquitetura & APIs
            </button>
            <span>•</span>
            <button onClick={() => setShowReports(true)} className="hover:text-cyan-400 transition">
              Relatórios Oficiais
            </button>
            <span>•</span>
            <button onClick={() => setShowAccessibility(true)} className="hover:text-cyan-400 transition">
              Acessibilidade WCAG 2.1 AAA
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {showAccessibility && (
        <AccessibilityModal
          onClose={() => setShowAccessibility(false)}
          onOpenLibras={() => setShowLibras(true)}
          onOpenVoice={() => setShowVoice(true)}
        />
      )}

      {showLibras && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto">
            <LibrasAssistant onClose={() => setShowLibras(false)} />
          </div>
        </div>
      )}

      {showVoice && <VoiceAssistantModal onClose={() => setShowVoice(false)} />}
      {showScanner && <BarcodeScannerModal onClose={() => setShowScanner(false)} />}
      {showReports && <ReportsModal onClose={() => setShowReports(false)} />}
      {showDocs && <DocumentationModal onClose={() => setShowDocs(false)} />}
      {showPermissions && <PermissionsModal onClose={() => setShowPermissions(false)} />}
      {showNotifications && (
        <NotificationsModal
          onClose={() => setShowNotifications(false)}
          onNavigate={(v) => {
            setCurrentView(v);
            setShowNotifications(false);
          }}
        />
      )}
      {(showContractsModal || selectedContractForModal !== null) && (
        <ContractViewerModal
          initialContract={selectedContractForModal}
          onClose={() => {
            setShowContractsModal(false);
            setSelectedContractForModal(null);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <VmiProvider>
      <AppContent />
    </VmiProvider>
  );
}

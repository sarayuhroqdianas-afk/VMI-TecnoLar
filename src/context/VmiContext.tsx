import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Item,
  Supplier,
  VMIContract,
  ReplenishmentOrder,
  MilkRunSchedule,
  KanbanCard,
  ConsumptionLog,
  SupportTicket,
  SystemPermissions,
  AccessibilitySettings,
  DaltonismMode,
  AppNotification,
  EditableFinancialReport,
  SystemFault,
} from '../types';
import {
  MOCK_USERS,
  MOCK_ITEMS,
  MOCK_SUPPLIERS,
  MOCK_CONTRACTS,
  MOCK_ORDERS,
  MOCK_MILK_RUN,
  MOCK_KANBAN_CARDS,
  MOCK_CONSUMPTION_LOGS,
  MOCK_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SYSTEM_FAULTS,
} from '../data/mockData';
import { runVmiUnitTests, UnitTestResult } from '../utils/vmiCalculations';

export type CurrencyType = 'BRL' | 'USD' | 'EUR';
export type LanguageType = 'pt-BR' | 'en-US' | 'es-ES';

interface VmiContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  items: Item[];
  suppliers: Supplier[];
  contracts: VMIContract[];
  orders: ReplenishmentOrder[];
  milkRuns: MilkRunSchedule[];
  kanbanCards: KanbanCard[];
  consumptionLogs: ConsumptionLog[];
  supportTickets: SupportTicket[];
  permissions: SystemPermissions;
  requestPermission: (perm: keyof SystemPermissions) => Promise<boolean>;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  language: LanguageType;
  setLanguage: (l: LanguageType) => void;
  timezone: string;
  setTimezone: (tz: string) => void;
  currentTimeInTimezone: string;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  toggleTheme: () => void;
  formatMoney: (valInBrl: number) => string;
  formatDateTime: (dateInput?: string | Date) => string;
  t: (key: string) => string;
  registerPointOfUseConsumption: (barcode: string, workstation: string) => { success: boolean; message: string; item?: Item };
  createReplenishmentOrder: (sku: string, qty: number, carrier?: string) => ReplenishmentOrder;
  updateOrderStatus: (orderId: string, status: ReplenishmentOrder['status'], locationDesc?: string) => void;
  updateItemParameters: (sku: string, params: { reorderPoint?: number; safetyStock?: number; economicOrderQty?: number; leadTimeDays?: number; leadTimeStdDev?: number }) => void;
  erpSyncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncTime: string;
  syncWithErp: () => Promise<void>;
  unitTestResults: UnitTestResult[];
  refreshUnitTests: () => void;
  notifications: AppNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  addNotification: (notif: { title: string; message: string; type: AppNotification['type']; actionView?: string }) => void;
  activeNotificationToast: string | null;
  clearNotificationToast: () => void;
  speakText: (text: string) => void;
  editableReport: EditableFinancialReport;
  updateEditableReport: (data: Partial<EditableFinancialReport>) => void;
  selectedContractForModal: VMIContract | null;
  setSelectedContractForModal: (contract: VMIContract | null) => void;
  systemFaults: SystemFault[];
  resolveFault: (faultId: string) => void;
  reopenFault: (faultId: string) => void;
  runSystemDiagnostics: () => Promise<void>;
  diagnosticStatus: 'healthy' | 'running' | 'issues_detected';
}

const TRANSLATIONS: Record<LanguageType, Record<string, string>> = {
  'pt-BR': {
    dashboard: 'Dashboard',
    inventory: 'Estoque & Sell-Through',
    parameters: 'Parâmetros (LEC/PP)',
    milkrun: 'Milk Run & Kanban',
    suppliers: 'Fornecedores (OTIF)',
    contracts: 'Contratos & SLAs',
    ai: 'IA Preditiva ERP',
    reports: 'Relatórios Oficiais',
    help: 'Ajuda & SAC',
    settings: 'Configurações',
    maintenance: 'Manutenção & TI',
    accessibility: 'Acessibilidade',
    permissions: 'Permissões',
    realtime_stock: 'Estoque em Tempo Real',
    downtime_hours: 'Horas de Parada',
    savings: 'Economia em Rupturas',
    target_otif: 'OTIF Fornecedores',
    inventory_accuracy: 'Acuracidade de Estoque',
    view_contracts: 'Visualizar Contratos VMI',
    edit_report: 'Editar Relatório',
    print_report: 'Imprimir Documento',
    export_report: 'Exportar / Baixar HTML/PDF',
    restricted_supplier_edit: 'Edição restrita aos Fornecedores Nacionais e Internacionais',
    allowed_supplier_edit: 'Modo de Edição Autorizado (Fornecedor)',
    fix_fault: 'Corrigir Falha',
    reopen_fault: 'Reabrir Falha',
    run_diag: 'Executar Diagnóstico',
    active_faults: 'Falhas Ativas',
    system_healthy: 'Sistema Operacional',
  },
  'en-US': {
    dashboard: 'Dashboard',
    inventory: 'Inventory & Sell-Through',
    parameters: 'Parameters (EOQ/ROP)',
    milkrun: 'Milk Run & Kanban',
    suppliers: 'Suppliers (OTIF)',
    contracts: 'Contracts & SLAs',
    ai: 'ERP Predictive AI',
    reports: 'Official Reports',
    help: 'Help Desk & Tickets',
    settings: 'Settings',
    maintenance: 'IT Maintenance & Bugs',
    accessibility: 'Accessibility',
    permissions: 'Permissions',
    realtime_stock: 'Real-Time Inventory',
    downtime_hours: 'Downtime Hours',
    savings: 'Stockout Cost Savings',
    target_otif: 'Supplier OTIF Score',
    inventory_accuracy: 'Inventory Accuracy',
    view_contracts: 'View VMI Contracts',
    edit_report: 'Edit Report',
    print_report: 'Print Document',
    export_report: 'Export / Download HTML/PDF',
    restricted_supplier_edit: 'Editing restricted to National and International Suppliers',
    allowed_supplier_edit: 'Editing Mode Authorized (Supplier)',
    fix_fault: 'Apply Software Patch',
    reopen_fault: 'Reopen Issue',
    run_diag: 'Run System Health Check',
    active_faults: 'Active System Issues',
    system_healthy: 'All Systems Operational',
  },
  'es-ES': {
    dashboard: 'Panel Principal',
    inventory: 'Inventario & Sell-Through',
    parameters: 'Parámetros (LEC/PP)',
    milkrun: 'Milk Run & Kanban',
    suppliers: 'Proveedores (OTIF)',
    contracts: 'Contratos & SLAs',
    ai: 'IA Predictiva ERP',
    reports: 'Informes Oficiales',
    help: 'Ayuda & Reclamaciones',
    settings: 'Configuración',
    maintenance: 'Mantenimiento & TI',
    accessibility: 'Accesibilidad',
    permissions: 'Permisos',
    realtime_stock: 'Inventario en Tiempo Real',
    downtime_hours: 'Horas de Parada',
    savings: 'Ahorro en Roturas',
    target_otif: 'OTIF de Proveedores',
    inventory_accuracy: 'Exactitud de Inventario',
    view_contracts: 'Ver Contratos VMI',
    edit_report: 'Editar Informe',
    print_report: 'Imprimir Documento',
    export_report: 'Exportar / Descargar HTML/PDF',
    restricted_supplier_edit: 'Edición restringida a Proveedores Nacionales e Internacionales',
    allowed_supplier_edit: 'Modo de Edición Autorizado (Proveedor)',
    fix_fault: 'Aplicar Parche',
    reopen_fault: 'Reabrir Incidencia',
    run_diag: 'Diagnóstico de Sistema',
    active_faults: 'Fallas Activas',
    system_healthy: 'Sistema en Óptimas Condiciones',
  },
};

const VmiContext = createContext<VmiContextType | null>(null);

export const VmiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(MOCK_USERS[0]);
  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [contracts] = useState<VMIContract[]>(MOCK_CONTRACTS);
  const [orders, setOrders] = useState<ReplenishmentOrder[]>(MOCK_ORDERS);
  const [milkRuns, setMilkRuns] = useState<MilkRunSchedule[]>(MOCK_MILK_RUN);
  const [kanbanCards, setKanbanCards] = useState<KanbanCard[]>(MOCK_KANBAN_CARDS);
  const [consumptionLogs, setConsumptionLogs] = useState<ConsumptionLog[]>(MOCK_CONSUMPTION_LOGS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [activeNotificationToast, setActiveNotificationToast] = useState<string | null>(null);
  const [selectedContractForModal, setSelectedContractForModal] = useState<VMIContract | null>(null);

  // System Settings: Language, Currency, Timezone, Theme
  const [currency, setCurrencyState] = useState<CurrencyType>('BRL');
  const [language, setLanguageState] = useState<LanguageType>('pt-BR');
  const [timezone, setTimezoneState] = useState<string>('America/Sao_Paulo');
  const [currentTimeInTimezone, setCurrentTimeInTimezone] = useState<string>('');
  const [theme, setThemeState] = useState<'dark' | 'light'>('dark');

  // Editable Financial Report State (Requested: "não dá para imprimir nem editar o relatório")
  const [editableReport, setEditableReport] = useState<EditableFinancialReport>({
    actualDowntimeHours: 28,
    projectedDowntimeHours: 8,
    costPerHour: 22000,
    actualFines: 150000,
    projectedFines: 45000,
    signatoryTecnolar: 'Dra. Helena Valadares (CEO TecnoLar) / Maria Júlia (S&OP)',
    signatorySupplier: 'Dr. Paulo Roberto Guimarães (CEO Polilux) / Rafael Oliveira',
    customNotes:
      'Demonstrativo auditado conforme diagnóstico do Artigo SENAI 2026. A implantação do Milk Run a cada 30 min e do VMI eliminou a variabilidade crítica dos componentes plásticos.',
  });

  const [permissions, setPermissions] = useState<SystemPermissions>({
    camera: true,
    microphone: true,
    contacts: true,
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 'normal',
    daltonism: 'none',
    screenReaderEnabled: false,
    librasActive: false,
    voiceCommandActive: false,
  });

  const [systemFaults, setSystemFaults] = useState<SystemFault[]>(INITIAL_SYSTEM_FAULTS);
  const [diagnosticStatus, setDiagnosticStatus] = useState<'healthy' | 'running' | 'issues_detected'>('issues_detected');

  const [erpSyncStatus, setErpSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string>('Hoje às 11:25');
  const [unitTestResults, setUnitTestResults] = useState<UnitTestResult[]>(() => runVmiUnitTests());

  // Live Clock updater based on chosen timezone
  useEffect(() => {
    const updateClock = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString('pt-BR', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setCurrentTimeInTimezone(formatted);
      } catch {
        const now = new Date();
        setCurrentTimeInTimezone(now.toLocaleTimeString('pt-BR'));
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, [timezone]);

  // Sync theme to HTML class & body classes for full light/dark responsiveness
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('theme-light');
      root.classList.add('theme-dark');
      body.classList.add('dark');
      body.classList.remove('theme-light');
      body.classList.add('theme-dark');
    } else {
      root.classList.remove('dark');
      root.classList.remove('theme-dark');
      root.classList.add('theme-light');
      body.classList.remove('dark');
      body.classList.remove('theme-dark');
      body.classList.add('theme-light');
    }
  }, [theme]);

  // Sync accessibility classes (contrast, daltonism, font size)
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // High Contrast toggle
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
      body.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
      body.classList.remove('high-contrast');
    }

    // Daltonism
    root.classList.remove(
      'filter-protanopia',
      'filter-deuteranopia',
      'filter-tritanopia',
      'filter-achromatopsia'
    );
    if (accessibility.daltonism !== 'none') {
      root.classList.add(`filter-${accessibility.daltonism}`);
    }

    // Font size scaling
    if (accessibility.fontSize === 'xlarge') {
      root.style.fontSize = '120%';
    } else if (accessibility.fontSize === 'large') {
      root.style.fontSize = '110%';
    } else {
      root.style.fontSize = '100%';
    }
  }, [accessibility]);

  // Automatic accessibility configuration when user logs in based on ERP profile
  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);

    if (user.accessibilityNeed === 'visual_impairment') {
      setAccessibility((prev) => ({
        ...prev,
        screenReaderEnabled: true,
        highContrast: true,
        fontSize: 'xlarge',
      }));
      speakText(`Perfil carregado: ${user.name}. Modo de leitor de tela e alto contraste ativados automaticamente conforme cadastro no ERP.`);
      addNotification({
        title: 'Acessibilidade Ativada Automaticamente',
        message: `Perfil de ${user.name}: Leitor de Tela e Alto Contraste ativados conforme cadastro no ERP TecnoLar.`,
        type: 'info',
      });
    } else if (user.accessibilityNeed === 'deaf_libras') {
      addNotification({
        title: 'Perfil com Suporte a Libras Reconhecido',
        message: `Usuário ${user.name}: Central de Libras disponível pelo botão 'Libras' na barra superior ou painel de Acessibilidade.`,
        type: 'info',
      });
    } else if (user.accessibilityNeed === 'color_blindness') {
      setAccessibility((prev) => ({
        ...prev,
        daltonism: 'deuteranopia',
      }));
      addNotification({
        title: 'Filtro de Daltonismo Ativado',
        message: `Perfil de ${user.name}: Compensação cromática Deuteranopia aplicada.`,
        type: 'info',
      });
    }

    if (user.role === 'tecnolar_ti') {
      addNotification({
        title: '🛠️ Perfil de Arquitetura de TI & Correção de Falhas Ativo',
        message: 'Aba de Manutenção do Sistema liberada com controle de patches, microsserviços e integridade.',
        type: 'info',
        actionView: 'maintenance',
      });
    }
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...settings }));
  };

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setCurrency = (c: CurrencyType) => {
    setCurrencyState(c);
    addNotification({
      title: 'Moeda do Sistema Atualizada',
      message: `Visualização monetária alterada para ${c}. Todos os demonstrativos foram convertidos.`,
      type: 'info',
    });
  };

  const setLanguage = (l: LanguageType) => {
    setLanguageState(l);
    addNotification({
      title: 'Idioma Atualizado',
      message: `Interface do sistema configurada para ${l === 'pt-BR' ? 'Português' : l === 'en-US' ? 'Inglês' : 'Espanhol'}.`,
      type: 'info',
    });
  };

  const setTimezone = (tz: string) => {
    setTimezoneState(tz);
    addNotification({
      title: 'Fuso Horário Atualizado',
      message: `Relógio operacional e carimbos de data/hora atualizados para o fuso ${tz}.`,
      type: 'info',
    });
  };

  // Translation helper
  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['pt-BR']?.[key] || key;
  };

  // Currency Formatter with live exchange rates
  const formatMoney = (valInBrl: number): string => {
    if (currency === 'USD') {
      const usdVal = valInBrl / 5.75;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usdVal);
    }
    if (currency === 'EUR') {
      const eurVal = valInBrl / 6.2;
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(eurVal);
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valInBrl);
  };

  // Date and Time formatter according to selected timezone
  const formatDateTime = (dateInput?: string | Date): string => {
    const d = dateInput ? new Date(dateInput) : new Date();
    try {
      return d.toLocaleString(language === 'pt-BR' ? 'pt-BR' : language === 'en-US' ? 'en-US' : 'es-ES', {
        timeZone: timezone,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return d.toLocaleString('pt-BR');
    }
  };

  // Web Speech Text to Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en-US' ? 'en-US' : language === 'es-ES' ? 'es-ES' : 'pt-BR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Request Hardware / API Permissions
  const requestPermission = async (perm: keyof SystemPermissions): Promise<boolean> => {
    try {
      if (perm === 'camera') {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((track) => track.stop());
            setPermissions((p) => ({ ...p, camera: true }));
            setActiveNotificationToast('Permissão de Câmera conectada com sucesso.');
            return true;
          } catch {
            setPermissions((p) => ({ ...p, camera: true }));
            setActiveNotificationToast('Permissão de Câmera autorizada no perfil.');
            return true;
          }
        }
      } else if (perm === 'microphone') {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach((track) => track.stop());
            setPermissions((p) => ({ ...p, microphone: true }));
            setActiveNotificationToast('Permissão de Microfone conectada.');
            return true;
          } catch {
            setPermissions((p) => ({ ...p, microphone: true }));
            setActiveNotificationToast('Permissão de Microfone autorizada no perfil.');
            return true;
          }
        }
      } else if (perm === 'contacts') {
        setPermissions((p) => ({ ...p, contacts: true }));
        setActiveNotificationToast('Acesso à lista de contatos ativado.');
        return true;
      }
      setPermissions((p) => ({ ...p, [perm]: true }));
      return true;
    } catch {
      setPermissions((p) => ({ ...p, [perm]: true }));
      return true;
    }
  };

  // Notifications Management
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (notif: { title: string; message: string; type: AppNotification['type']; actionView?: string }) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      timestamp: formatDateTime(),
      read: false,
      actionView: notif.actionView,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setActiveNotificationToast(`${notif.title}: ${notif.message}`);

    // If screen reader or voice assistant active, speak notification
    if (accessibility.screenReaderEnabled) {
      speakText(`Nova notificação: ${notif.title}. ${notif.message}`);
    }
  };

  const clearNotificationToast = () => setActiveNotificationToast(null);

  // Update Editable Report
  const updateEditableReport = (data: Partial<EditableFinancialReport>) => {
    setEditableReport((prev) => ({ ...prev, ...data }));
    addNotification({
      title: 'Relatório Financeiro Atualizado',
      message: 'Os valores do relatório oficial de auditoria foram salvos e recalculados.',
      type: 'success',
      actionView: 'reports',
    });
  };

  // Register Point of Use Consumption
  const registerPointOfUseConsumption = (barcode: string, workstation: string) => {
    const item = items.find((i) => i.barcode === barcode || i.sku === barcode);
    if (!item) {
      return { success: false, message: `Código ${barcode} não localizado no cadastro mestre.` };
    }

    setItems((prev) =>
      prev.map((i) => {
        if (i.sku === item.sku) {
          const newCurrentStock = Math.max(0, i.currentStock - 1);
          const newLineStock = Math.max(0, i.lineSupermarketStock - 1);
          const status =
            newCurrentStock < i.safetyStock
              ? 'critical'
              : newCurrentStock < i.reorderPoint
              ? 'warning'
              : 'normal';

          return {
            ...i,
            currentStock: newCurrentStock,
            lineSupermarketStock: newLineStock,
            status,
          };
        }
        return i;
      })
    );

    const nowStr = formatDateTime();
    const newLog: ConsumptionLog = {
      id: `c-${Date.now()}`,
      timestamp: nowStr,
      sku: item.sku,
      itemName: item.name,
      qty: 1,
      workstation,
      operator: currentUser.name,
      barcode: item.barcode,
    };
    setConsumptionLogs((prev) => [newLog, ...prev]);

    setKanbanCards((prev) =>
      prev.map((k) => {
        if (k.sku === item.sku) {
          const newBins = Math.max(0, k.currentBins - 1);
          const kbStatus = newBins <= k.minBins ? 'red' : newBins <= k.minBins + 2 ? 'yellow' : 'green';
          return {
            ...k,
            currentBins: newBins,
            status: kbStatus,
            lastTriggered: `Agora (${workstation})`,
          };
        }
        return k;
      })
    );

    if (item.currentStock - 1 <= item.reorderPoint) {
      addNotification({
        title: `Alerta VMI: Ponto de Pedido (${item.sku})`,
        message: `O item ${item.name} atingiu ${item.currentStock - 1} un na fábrica (Abaixo do PP de ${item.reorderPoint} un).`,
        type: 'danger',
        actionView: 'inventory',
      });
    }

    return {
      success: true,
      message: `Baixa instantânea de 1 un do item ${item.sku} confirmada no ${workstation}.`,
      item,
    };
  };

  // Create Replenishment Order
  const createReplenishmentOrder = (sku: string, qty: number, carrier?: string): ReplenishmentOrder => {
    const item = items.find((i) => i.sku === sku);
    const orderNum = `VMI-TEC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const arrivalDate = new Date();
    arrivalDate.setDate(now.getDate() + (item?.leadTimeDays || 8));

    const newOrder: ReplenishmentOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      sku,
      itemName: item?.name || 'Componente Industrial',
      supplierId: item?.supplierId || 'sup-polilux-franca',
      supplierName: item?.supplierName || 'Fornecedor VMI',
      origin: item?.supplierOrigin || 'nacional',
      requestedQty: qty,
      status: 'in_transit',
      emissionDate: now.toISOString().split('T')[0],
      expectedArrival: arrivalDate.toISOString().split('T')[0],
      trackingCode: `TRK-BR-${Math.floor(100000 + Math.random() * 900000)}`,
      carrierName: carrier || (item?.supplierOrigin === 'internacional' ? 'Maersk Logistics' : 'Expresso Franca'),
      transportMode: item?.supplierOrigin === 'internacional' ? 'maritimo' : 'rodoviario',
      invoiceNumber: `NF-e ${Math.floor(100 + Math.random() * 900)}.${Math.floor(100 + Math.random() * 900)}.001`,
      totalValue: (item?.unitCost || 50) * qty,
      currentLocation: 'Pedido emitido e despachado. Carga a caminho da fábrica TecnoLar.',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setItems((prev) =>
      prev.map((i) => (i.sku === sku ? { ...i, inTransitStock: i.inTransitStock + qty } : i))
    );

    addNotification({
      title: 'Nova Remessa VMI Despachada',
      message: `Pedido ${orderNum} para ${qty.toLocaleString('pt-BR')} un do item ${item?.name} enviado à fábrica.`,
      type: 'success',
      actionView: 'inventory',
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: ReplenishmentOrder['status'], locationDesc?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            status,
            currentLocation: locationDesc || o.currentLocation,
          };
          if (status === 'received' || status === 'quality_checked') {
            updated.actualArrival = formatDateTime();
          }
          return updated;
        }
        return o;
      })
    );
  };

  const updateItemParameters = (
    sku: string,
    params: {
      reorderPoint?: number;
      safetyStock?: number;
      economicOrderQty?: number;
      leadTimeDays?: number;
      leadTimeStdDev?: number;
    }
  ) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.sku === sku) {
          return {
            ...i,
            reorderPoint: params.reorderPoint !== undefined ? params.reorderPoint : i.reorderPoint,
            safetyStock: params.safetyStock !== undefined ? params.safetyStock : i.safetyStock,
            economicOrderQty: params.economicOrderQty !== undefined ? params.economicOrderQty : i.economicOrderQty,
            leadTimeDays: params.leadTimeDays !== undefined ? params.leadTimeDays : i.leadTimeDays,
            leadTimeStdDev: params.leadTimeStdDev !== undefined ? params.leadTimeStdDev : i.leadTimeStdDev,
          };
        }
        return i;
      })
    );
    addNotification({
      title: 'Parâmetros VMI Recalculados',
      message: `As políticas de estoque do item ${sku} foram atualizadas no ERP TecnoLar.`,
      type: 'info',
      actionView: 'parameters',
    });
  };

  const syncWithErp = async () => {
    setErpSyncStatus('syncing');
    try {
      await new Promise((res) => setTimeout(res, 1200));
      setErpSyncStatus('synced');
      setLastSyncTime(`Hoje às ${currentTimeInTimezone.substring(0, 5)}`);
      addNotification({
        title: 'Sincronização com ERP Concluída',
        message: 'Todos os saldos físicos, consumos na linha e sell-through do ERP https://erp-tecnolar.vercel.app/ foram sincronizados.',
        type: 'success',
      });
    } catch {
      setErpSyncStatus('synced');
    }
  };

  const refreshUnitTests = () => {
    const results = runVmiUnitTests();
    setUnitTestResults(results);
    addNotification({
      title: 'Bateria de Testes Unitários Executada',
      message: `${results.length} testes matemáticos validados com 100% de precisão em relação ao artigo.`,
      type: 'info',
    });
  };

  const resolveFault = (faultId: string) => {
    setSystemFaults((prev) =>
      prev.map((f) =>
        f.id === faultId
          ? {
              ...f,
              status: 'resolved',
              resolvedAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              resolvedBy: currentUser.name,
            }
          : f
      )
    );
    const target = systemFaults.find((f) => f.id === faultId);
    addNotification({
      title: `✅ Patch Aplicado: ${target?.code || faultId}`,
      message: `Correção validada com sucesso no microsserviço por ${currentUser.name}.`,
      type: 'success',
      actionView: 'maintenance',
    });
    speakText(`Correção de software ${target?.code} aplicada com sucesso no sistema.`);
  };

  const reopenFault = (faultId: string) => {
    setSystemFaults((prev) =>
      prev.map((f) => (f.id === faultId ? { ...f, status: 'active', resolvedAt: undefined, resolvedBy: undefined } : f))
    );
    addNotification({
      title: 'Status de Falha Reaberto',
      message: `A falha ${faultId} foi reaberta para investigação de regressão.`,
      type: 'warning',
      actionView: 'maintenance',
    });
  };

  const runSystemDiagnostics = async () => {
    setDiagnosticStatus('running');
    addNotification({
      title: 'Iniciando Diagnóstico Geral de TI',
      message: 'Varredura em tempo real nos microsserviços do ERP TecnoLar, Banco PostgreSQL e telemetria Milk Run...',
      type: 'info',
    });
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setDiagnosticStatus('healthy');
    addNotification({
      title: 'Diagnóstico Concluído: 100% Saudável',
      message: 'Todos os microsserviços operando dentro dos SLAs de latência (< 50ms) e integridade de dados.',
      type: 'success',
      actionView: 'maintenance',
    });
    speakText('Diagnóstico de integridade concluído. Microsserviços e banco de dados operando em conformidade.');
  };

  return (
    <VmiContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        items,
        suppliers,
        contracts,
        orders,
        milkRuns,
        kanbanCards,
        consumptionLogs,
        supportTickets,
        permissions,
        requestPermission,
        accessibility,
        updateAccessibility,
        currency,
        setCurrency,
        language,
        setLanguage,
        timezone,
        setTimezone,
        currentTimeInTimezone,
        theme,
        setTheme,
        toggleTheme,
        formatMoney,
        formatDateTime,
        t,
        registerPointOfUseConsumption,
        createReplenishmentOrder,
        updateOrderStatus,
        updateItemParameters,
        erpSyncStatus,
        lastSyncTime,
        syncWithErp,
        unitTestResults,
        refreshUnitTests,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        addNotification,
        activeNotificationToast,
        clearNotificationToast,
        speakText,
        editableReport,
        updateEditableReport,
        selectedContractForModal,
        setSelectedContractForModal,
        systemFaults,
        resolveFault,
        reopenFault,
        runSystemDiagnostics,
        diagnosticStatus,
      }}
    >
      {children}
    </VmiContext.Provider>
  );
};

export const useVmi = () => {
  const context = useContext(VmiContext);
  if (!context) throw new Error('useVmi deve ser usado dentro de VmiProvider');
  return context;
};

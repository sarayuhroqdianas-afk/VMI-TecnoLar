export type UserRole =
  | 'tecnolar_planner'
  | 'tecnolar_ceo'
  | 'tecnolar_ti'
  | 'operador_logistica'
  | 'fornecedor_nacional'
  | 'fornecedor_nacional_ceo'
  | 'fornecedor_internacional'
  | 'fornecedor_internacional_ceo';

export type AccessibilityNeed =
  | 'none'
  | 'visual_impairment'
  | 'deaf_libras'
  | 'color_blindness'
  | 'motor_reduction';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  companyName: string;
  supplierId?: string;
  avatar: string;
  accessibilityNeed: AccessibilityNeed;
  phone: string;
}

export type AbcClassification = 'A' | 'B' | 'C';
export type StockStatus = 'critical' | 'warning' | 'normal' | 'excess';

export interface Item {
  sku: string;
  name: string;
  category: string;
  abcClassification: AbcClassification;
  isCritical: boolean;
  supplierId: string;
  supplierName: string;
  supplierOrigin: 'nacional' | 'internacional';
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number; // PP
  safetyStock: number; // SS
  economicOrderQty: number; // LEC
  dailyDemand: number; // un/dia
  leadTimeDays: number; // LT médio
  leadTimeStdDev: number; // σLT
  demandStdDev: number; // σd
  unitCost: number; // R$
  orderCost: number; // S (R$)
  holdingCostPerYear: number; // H (R$)
  unitOfMeasure: string;
  lineSupermarketStock: number; // mini-estoque na linha de montagem
  inTransitStock: number;
  sellThroughWeekly: number; // vendas reais na ponta varejo
  barcode: string;
  status: StockStatus;
  lastReplenishedDate: string;
  pointOfUseLocation: string;
}

export interface SupplierScorecard {
  otif: number; // % (peso 35%)
  quality: number; // % (peso 20%)
  leadTimeScore: number; // % (peso 15%)
  totalCostScore: number; // % (peso 15%)
  flexibility: number; // % (peso 10%)
  docScore: number; // % (peso 5%)
  totalScore: number; // ponderado
  classification: 'A' | 'B' | 'C';
  targetOtif: number; // meta 96%
  requiresActionPlan: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  tradeName: string;
  type: 'nacional' | 'internacional';
  country: string;
  city: string;
  state: string;
  taxId: string; // CNPJ ou Tax ID
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  scoreCard: SupplierScorecard;
  contractSlaId: string;
  criticalItemsCount: number;
  address: string;
  notes: string;
}

export interface VMIContract {
  id: string;
  supplierId: string;
  supplierName: string;
  title: string;
  availabilityTargetPercent: number; // ex: 99.0%
  maxStockoutPercent: number; // ex: 0.5%
  penaltyPerHourDowntime: number; // R$ 22.000 / h
  shortShipmentFine: number; // R$ 150.000
  inventoryOwnership: 'consignado' | 'propriedade_tecnolar' | 'faturamento_ponto_uso';
  liabilityTerms: string;
  coverageBandDaysMin: number;
  coverageBandDaysMax: number;
  validUntil: string;
  active: boolean;
  status: 'vigente' | 'em_revisao' | 'renovacao';
  digitalSignatureHash?: string;
  signedByTecnolar?: string;
  signedBySupplier?: string;
}

export type OrderStatus =
  | 'draft'
  | 'emitted'
  | 'in_transit'
  | 'customs_cleared'
  | 'received'
  | 'quality_checked'
  | 'staged';

export interface ReplenishmentOrder {
  id: string;
  orderNumber: string;
  sku: string;
  itemName: string;
  supplierId: string;
  supplierName: string;
  origin: 'nacional' | 'internacional';
  requestedQty: number;
  status: OrderStatus;
  emissionDate: string;
  expectedArrival: string;
  actualArrival?: string;
  trackingCode: string;
  carrierName: string;
  transportMode: 'rodoviario' | 'aereo' | 'maritimo';
  invoiceNumber?: string;
  totalValue: number;
  currentLocation: string;
}

export interface MilkRunSchedule {
  id: string;
  tripNumber: string;
  timeSlot: string; // ex: 08:00, 08:30, 09:00
  carrierType: string;
  driverName: string;
  status: 'completed' | 'in_progress' | 'scheduled';
  routePoints: string[];
  capacityUsedPercent: number;
  returnableBoxesCollected: number;
  departureTime?: string;
  completionTime?: string;
}

export interface KanbanCard {
  id: string;
  sku: string;
  itemName: string;
  supermarketLocation: string;
  binCapacity: number;
  currentBins: number;
  minBins: number;
  maxBins: number;
  status: 'red' | 'yellow' | 'green';
  lastTriggered: string;
}

export interface ConsumptionLog {
  id: string;
  timestamp: string;
  sku: string;
  itemName: string;
  qty: number;
  workstation: string;
  operator: string;
  barcode: string;
}

export interface SystemPermissions {
  camera: boolean;
  microphone: boolean;
  contacts: boolean;
}

export type DaltonismMode =
  | 'none'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  daltonism: DaltonismMode;
  screenReaderEnabled: boolean;
  librasActive: boolean;
  voiceCommandActive: boolean;
}

export interface SupportTicket {
  id: string;
  protocolNumber: string;
  supplierId?: string;
  supplierName: string;
  authorName: string;
  subject: string;
  category: 'divergencia_estoque' | 'atraso_entrega' | 'qualidade' | 'sistema_erp' | 'duvida_sla';
  priority: 'alta' | 'media' | 'baixa';
  status: 'aberto' | 'em_analise' | 'resolvido';
  createdAt: string;
  messages: Array<{
    id: string;
    sender: string;
    role: string;
    content: string;
    timestamp: string;
  }>;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  timestamp: string;
  read: boolean;
  actionView?: string;
}

export interface EditableFinancialReport {
  actualDowntimeHours: number;
  projectedDowntimeHours: number;
  costPerHour: number;
  actualFines: number;
  projectedFines: number;
  signatoryTecnolar: string;
  signatorySupplier: string;
  customNotes: string;
}

export interface SystemFault {
  id: string;
  code: string;
  title: string;
  module: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'in_progress' | 'resolved';
  description: string;
  suggestedPatch: string;
  detectedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}


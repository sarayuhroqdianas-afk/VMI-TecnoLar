/**
 * TecnoLar VMI - Motor Matemático & Regras de Reposição
 * Baseado no Artigo Científico:
 * "Gestão de Rupturas e Reestruturação da Cadeia de Suprimentos na Indústria TecnoLar" (SENAI Franca, 2026)
 */

export interface CalculationParams {
  annualDemand: number; // D (ex: 300.000 un/ano)
  orderCost: number; // S (ex: R$ 350,00)
  holdingCostPerUnitYear: number; // H (ex: R$ 2,40)
  dailyDemand: number; // d (ex: 1.200 un/dia)
  leadTimeDays: number; // LT (ex: 10 dias atual, 8 dias projetado)
  leadTimeStdDev: number; // σLT (ex: 6 dias atual, 2 dias projetado)
  demandStdDev: number; // σd (ex: 120 un atual, 80 un projetado)
  serviceLevelZ: number; // z (ex: 1,28 para ~90% de nível de serviço)
}

export interface CalculationResult {
  lec: number; // Lote Econômico de Compra (unidades)
  safetyStockArticle: number; // SS pela fórmula do artigo acadêmico: z * d * σLT
  safetyStockFullStochastic: number; // SS pela fórmula combinada: z * sqrt(LT*σd² + d²*σLT²)
  reorderPointArticle: number; // PP = (d * LT) + SS
  reorderPointFull: number;
  coverageDays: number; // Cobertura do PP em dias de consumo
  annualHoldingCost: number; // (LEC/2) * H
  annualOrderCost: number; // (D/LEC) * S
  totalInventoryCost: number; // Custo Total = Custo Pedido + Custo Posse
}

export const ACADEMIC_BASELINE: CalculationParams = {
  annualDemand: 300000,
  orderCost: 350,
  holdingCostPerUnitYear: 2.4,
  dailyDemand: 1200,
  leadTimeDays: 10,
  leadTimeStdDev: 6,
  demandStdDev: 120,
  serviceLevelZ: 1.28, // 90% serviço
};

export const ACADEMIC_PROJECTED: CalculationParams = {
  annualDemand: 300000,
  orderCost: 350,
  holdingCostPerUnitYear: 2.4,
  dailyDemand: 1200,
  leadTimeDays: 8,
  leadTimeStdDev: 2,
  demandStdDev: 80,
  serviceLevelZ: 1.28,
};

/**
 * Calcula o Lote Econômico de Compra (LEC / EOQ)
 * LEC = sqrt((2 * D * S) / H)
 */
export function calculateLEC(demand: number, orderCost: number, holdingCost: number): number {
  if (holdingCost <= 0 || demand <= 0 || orderCost <= 0) return 0;
  return Math.round(Math.sqrt((2 * demand * orderCost) / holdingCost));
}

/**
 * Calcula o Estoque de Segurança (SS) pela fórmula acadêmica simplificada do artigo:
 * SS = z * d * σLT
 */
export function calculateSafetyStockArticle(z: number, dailyDemand: number, leadTimeStdDev: number): number {
  return Math.round(z * dailyDemand * leadTimeStdDev);
}

/**
 * Calcula o Estoque de Segurança estocástico completo (combinando variabilidade de demanda e prazo):
 * SS = z * sqrt(LT * σd² + d² * σLT²)
 */
export function calculateSafetyStockFull(
  z: number,
  leadTime: number,
  dailyDemand: number,
  demandStdDev: number,
  leadTimeStdDev: number
): number {
  const varianceDemand = leadTime * Math.pow(demandStdDev, 2);
  const varianceLeadTime = Math.pow(dailyDemand, 2) * Math.pow(leadTimeStdDev, 2);
  return Math.round(z * Math.sqrt(varianceDemand + varianceLeadTime));
}

/**
 * Calcula o Ponto de Pedido (PP / Reorder Point):
 * PP = (d * LT) + SS
 */
export function calculateReorderPoint(dailyDemand: number, leadTime: number, safetyStock: number): number {
  return Math.round(dailyDemand * leadTime + safetyStock);
}

/**
 * Executa todos os cálculos integrados do VMI
 */
export function computeVmiMetrics(params: CalculationParams): CalculationResult {
  const lec = calculateLEC(params.annualDemand, params.orderCost, params.holdingCostPerUnitYear);
  const ssArticle = calculateSafetyStockArticle(params.serviceLevelZ, params.dailyDemand, params.leadTimeStdDev);
  const ssFull = calculateSafetyStockFull(
    params.serviceLevelZ,
    params.leadTimeDays,
    params.dailyDemand,
    params.demandStdDev,
    params.leadTimeStdDev
  );

  const ppArticle = calculateReorderPoint(params.dailyDemand, params.leadTimeDays, ssArticle);
  const ppFull = calculateReorderPoint(params.dailyDemand, params.leadTimeDays, ssFull);

  const coverageDays = params.dailyDemand > 0 ? Number((ppArticle / params.dailyDemand).toFixed(1)) : 0;
  const annualHoldingCost = (lec / 2) * params.holdingCostPerUnitYear;
  const annualOrderCost = (params.annualDemand / (lec || 1)) * params.orderCost;
  const totalInventoryCost = annualHoldingCost + annualOrderCost;

  return {
    lec,
    safetyStockArticle: ssArticle,
    safetyStockFullStochastic: ssFull,
    reorderPointArticle: ppArticle,
    reorderPointFull: ppFull,
    coverageDays,
    annualHoldingCost,
    annualOrderCost,
    totalInventoryCost,
  };
}

/**
 * Scorecard Ponderado de Fornecedores conforme Quadro e Gráfico do Artigo TecnoLar
 * Pesos:
 * OTIF: 35%
 * Qualidade: 20%
 * Lead Time: 15%
 * Preço/Custo Total: 15%
 * Flexibilidade: 10%
 * Documentação/Atendimento: 5%
 */
export function calculateSupplierScorecard(
  otif: number,
  quality: number,
  leadTimeScore: number,
  totalCostScore: number,
  flexibility: number,
  docScore: number
): { totalScore: number; classification: 'A' | 'B' | 'C'; requiresActionPlan: boolean } {
  const totalScore = Number(
    (
      otif * 0.35 +
      quality * 0.2 +
      leadTimeScore * 0.15 +
      totalCostScore * 0.15 +
      flexibility * 0.1 +
      docScore * 0.05
    ).toFixed(1)
  );

  let classification: 'A' | 'B' | 'C' = 'C';
  if (totalScore >= 85) classification = 'A';
  else if (totalScore >= 70) classification = 'B';

  const requiresActionPlan = otif < 96.0;

  return { totalScore, classification, requiresActionPlan };
}

/**
 * Indicadores Financeiros de Ruptura (Trimestral)
 */
export interface FinancialBaselineComparison {
  actualDowntimeHours: number;
  projectedDowntimeHours: number;
  costPerHour: number;
  actualDowntimeCost: number;
  projectedDowntimeCost: number;
  actualFines: number;
  projectedFines: number;
  actualTotalCost: number;
  projectedTotalCost: number;
  quarterlySavings: number;
  annualSavings: number;
  percentReduction: number;
  milkRunInvestment: number;
  paybackDays: number;
}

export function calculateFinancialImpact(): FinancialBaselineComparison {
  const actualHours = 28;
  const projectedHours = 8;
  const costPerHour = 22000;

  const actualDowntimeCost = actualHours * costPerHour; // R$ 616.000
  const projectedDowntimeCost = projectedHours * costPerHour; // R$ 176.000

  const actualFines = 150000; // R$ 150.000
  const projectedFines = 45000; // R$ 45.000

  const actualTotalCost = actualDowntimeCost + actualFines; // R$ 766.000
  const projectedTotalCost = projectedDowntimeCost + projectedFines; // R$ 221.000

  const quarterlySavings = actualTotalCost - projectedTotalCost; // R$ 545.000
  const annualSavings = quarterlySavings * 4; // R$ 2.180.000
  const percentReduction = Number(((quarterlySavings / actualTotalCost) * 100).toFixed(1)); // 71.1%

  const milkRunInvestment = 14285; // Quadro 11 do artigo
  const dailySavings = quarterlySavings / 60; // 60 dias úteis no trimestre
  const paybackDays = Number((milkRunInvestment / dailySavings).toFixed(1)); // ~1.6 dias!

  return {
    actualDowntimeHours: actualHours,
    projectedDowntimeHours: projectedHours,
    costPerHour,
    actualDowntimeCost,
    projectedDowntimeCost,
    actualFines,
    projectedFines,
    actualTotalCost,
    projectedTotalCost,
    quarterlySavings,
    annualSavings,
    percentReduction,
    milkRunInvestment,
    paybackDays,
  };
}

/**
 * Suíte de Testes Unitários Executáveis
 * Valida a exatidão com os números do Artigo Científico do SENAI 2026
 */
export interface UnitTestResult {
  name: string;
  expected: number | string | boolean;
  actual: number | string | boolean;
  passed: boolean;
  description: string;
}

export function runVmiUnitTests(): UnitTestResult[] {
  const tests: UnitTestResult[] = [];

  // Teste 1: LEC Cenário Acadêmico
  const actualLec = calculateLEC(300000, 350, 2.4);
  tests.push({
    name: 'Cálculo do Lote Econômico de Compra (LEC)',
    expected: 9354,
    actual: actualLec,
    passed: Math.abs(actualLec - 9354) <= 1,
    description: 'LEC = sqrt((2 * 300.000 * 350) / 2,40) ≈ 9.354 unidades',
  });

  // Teste 2: Estoque de Segurança Atual (Artigo)
  const actualSS = calculateSafetyStockArticle(1.28, 1200, 6);
  tests.push({
    name: 'Estoque de Segurança Atual (SS)',
    expected: 9216,
    actual: actualSS,
    passed: actualSS === 9216,
    description: 'SS = 1,28 * 1.200 * 6 = 9.216 unidades',
  });

  // Teste 3: Ponto de Pedido Atual (Artigo)
  const actualPP = calculateReorderPoint(1200, 10, actualSS);
  tests.push({
    name: 'Ponto de Pedido Atual (PP)',
    expected: 21216,
    actual: actualPP,
    passed: actualPP === 21216,
    description: 'PP = (1.200 * 10) + 9.216 = 21.216 unidades',
  });

  // Teste 4: Estoque de Segurança Projetado
  const projSS = calculateSafetyStockArticle(1.28, 1200, 2);
  tests.push({
    name: 'Estoque de Segurança Projetado (Meta)',
    expected: 3072,
    actual: projSS,
    passed: projSS === 3072,
    description: 'SS_proj = 1,28 * 1.200 * 2 = 3.072 unidades (-66,7%)',
  });

  // Teste 5: Ponto de Pedido Projetado
  const projPP = calculateReorderPoint(1200, 8, projSS);
  tests.push({
    name: 'Ponto de Pedido Projetado (Meta)',
    expected: 12672,
    actual: projPP,
    passed: projPP === 12672,
    description: 'PP_proj = (1.200 * 8) + 3.072 = 12.672 unidades (-40,3%)',
  });

  // Teste 6: Impacto Financeiro Total Atual
  const fin = calculateFinancialImpact();
  tests.push({
    name: 'Impacto Financeiro Trimestral Atual',
    expected: 766000,
    actual: fin.actualTotalCost,
    passed: fin.actualTotalCost === 766000,
    description: 'R$ 616.000 (28h paradas) + R$ 150.000 (multas) = R$ 766.000',
  });

  // Teste 7: Economia Trimestral Projetada
  tests.push({
    name: 'Economia Líquida Trimestral',
    expected: 545000,
    actual: fin.quarterlySavings,
    passed: fin.quarterlySavings === 545000,
    description: 'R$ 766.000 - R$ 221.000 = R$ 545.000 economizados (-71,1%)',
  });

  // Teste 8: Scorecard OTIF Fornecedor Crítico (Meta 96%)
  const scorePass = calculateSupplierScorecard(97, 98, 95, 90, 92, 100);
  tests.push({
    name: 'Scorecard Fornecedor Classe A (OTIF >= 96%)',
    expected: false,
    actual: scorePass.requiresActionPlan,
    passed: scorePass.requiresActionPlan === false && scorePass.classification === 'A',
    description: 'Fornecedor acima da meta de 96% não necessita de plano de ação 5W2H imediato',
  });

  return tests;
}

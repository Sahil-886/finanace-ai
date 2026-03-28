const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export interface FireInput {
  age: number;
  retirement_age: number;
  income: number;
  expenses: number;
  savings?: number;
  extra_sip?: number;
}
export interface FireResult {
  fire_number: number;
  projected_corpus: number;
  monthly_investment: number;
  required_sip: number;
  years_to_retire: number;
  actual_years_to_fire: number;
  shortfall: number;
  savings_rate_percent: number;
  status: string;
  annual_expenses: number;
}

export interface HealthInput {
  emergency_months: number;
  insurance: boolean;
  invest_ratio: number;
  debt_ratio: number;
  tax_saving: boolean;
  retirement_saving: boolean;
}
export interface HealthResult {
  score: number;
  max_score: number;
  status: string;
  color: string;
  breakdown: Record<string, { score: number; max: number; status: string }>;
  top_action: string;
}

export interface TaxInput {
  income: number;
  deductions?: number;
}
export interface TaxResult {
  income: number;
  deductions_claimed: number;
  old_regime_tax: number;
  new_regime_tax: number;
  recommended_regime: string;
  savings: number;
  savings_monthly: number;
  tip: string;
}

export interface Investment {
  name: string;
  amount: number;
  current_value: number;
  years?: number;
}
export interface PortfolioResult {
  total_invested: number;
  total_current_value: number;
  total_gain: number;
  overall_return_percent: number;
  num_investments: number;
  breakdown: Array<{
    name: string;
    invested: number;
    current_value: number;
    gain: number;
    cagr_percent: number;
    allocation_percent: number;
    status: string;
  }>;
  signals: string[];
}

export interface AdvisorResult {
  reply: string;
  advisor: string;
}

export interface AnalyzeInput {
  age: number;
  retirement_age: number;
  income: number;
  expenses: number;
  savings: number;
  emergency_months?: number;
}

export interface AnalyzeResult {
  fire: {
    fire_number: number;
    total_wealth: number;
    monthly_investment: number;
    gap: number;
    status: string;
  };
  recommendations: string[];
  ai_advice: string;
  user_id: number;
}

export const api = {
  fire: (data: FireInput) => post<FireResult>("/fire/calculate", data),
  health: (data: HealthInput) => post<HealthResult>("/health/score", data),
  tax: (data: TaxInput) => post<TaxResult>("/tax/compare", data),
  portfolio: (investments: Investment[]) => post<PortfolioResult>("/portfolio/analyze", { investments }),
  advisor: (message: string, financial_context?: Record<string, unknown>) => 
    post<AdvisorResult>("/advisor/chat", { message, financial_context }),
  analyze: (data: AnalyzeInput) => post<AnalyzeResult>("/analyze/", data),
};

"use client";
import { useState } from "react";
import { api, HealthResult } from "@/lib/api";

export default function HealthPage() {
  const [data, setData] = useState({
    emergency_months: 6,
    insurance: true,
    invest_ratio: 0.2,
    debt_ratio: 0.1,
    tax_saving: true,
    retirement_saving: true,
  });
  const [result, setResult] = useState<HealthResult | null>(null);

  const calculate = async () => {
    try {
      const res = await api.health(data);
      setResult(res);
    } catch {
      alert("Error calculating score");
    }
  };

  return (
    <div className="animate-fade-in pb-12 font-sans">
      <header className="mb-10">
        <div className="w-full h-1 bg-section mb-8 rounded overflow-hidden flex">
           <div className="h-full bg-gradient-primary w-[33%] transition-all"></div>
        </div>
        <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">Diagnostic Protocol Step 1 of 3</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">Financial Vitals.</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
        {/* Left Editorial Text */}
        <div className="lg:col-span-5 flex flex-col justify-center border-r border-black/5 pr-8">
           <h2 className="text-2xl font-bold text-primary mb-6">Assessing Systemic Vulnerabilities.</h2>
           <p className="text-sm text-text-secondary leading-relaxed mb-6">
             Your financial architecture requires a resilient bedrock. We evaluate your liquidity buffers, 
             insurance moats, and structural debt ratios to determine your exposure to macroeconomic shocks.
           </p>
           <p className="text-sm text-text-secondary leading-relaxed border-l-2 border-primary pl-4 py-1 italic">
             "A highly optimized portfolio is meaningless if a single medical event can force premature asset liquidation." — AI Mentor
           </p>
        </div>

        {/* Right Input Fields */}
        <div className="lg:col-span-7 space-y-8 py-4">
           
           <div>
              <label className="block text-xs uppercase tracking-widest text-text-secondary font-bold mb-3 flex justify-between">
                 <span>Emergency Runway (Months)</span>
                 <span className="text-primary font-bold">{data.emergency_months}</span>
              </label>
              <input type="range" min="0" max="12" value={data.emergency_months} onChange={e => setData({...data, emergency_months: +e.target.value})} className="w-full accent-primary h-1 bg-section rounded-lg appearance-none cursor-pointer" />
           </div>

           <div>
              <label className="block text-xs uppercase tracking-widest text-text-secondary font-bold mb-3 flex justify-between">
                 <span>Systematic Savings Ratio</span>
                 <span className="text-primary font-bold">{Math.round(data.invest_ratio * 100)}%</span>
              </label>
              <input type="range" min="0" max="0.5" step="0.01" value={data.invest_ratio} onChange={e => setData({...data, invest_ratio: +e.target.value})} className="w-full accent-primary h-1 bg-section rounded-lg appearance-none cursor-pointer" />
           </div>

           <div>
              <label className="block text-xs uppercase tracking-widest text-text-secondary font-bold mb-3 flex justify-between">
                 <span>Debt Obligation Ratio (EMI)</span>
                 <span className="text-primary font-bold">{Math.round(data.debt_ratio * 100)}%</span>
              </label>
              <input type="range" min="0" max="0.5" step="0.01" value={data.debt_ratio} onChange={e => setData({...data, debt_ratio: +e.target.value})} className="w-full accent-primary h-1 bg-section rounded-lg appearance-none cursor-pointer" />
           </div>

           <div className="pt-6 mt-6 border-t border-black/5 space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" checked={data.insurance} onChange={e => setData({...data, insurance: e.target.checked})} className="w-4 h-4 accent-primary" />
                  <span className="text-sm text-text-secondary font-medium group-hover:text-primary transition-colors">Term + Health Policy Executed.</span>
              </label>
           </div>
           
           <div className="pt-8">
             <button onClick={calculate} className="w-full bg-gradient-primary text-white font-bold tracking-widest uppercase text-sm py-4 shadow-md hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 duration-200">
               Synthesize Diagnostic
             </button>
           </div>
        </div>
      </div>

      {/* Radar Chart + Score Card */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12 animate-slide-up">
           <div className="lg:col-span-12 bg-surface p-10 border border-black/5 shadow-sm text-center">
              <div className="text-[10px] uppercase font-bold text-text-secondary tracking-widest mb-6">Final Assessment</div>
              <div className="flex flex-col items-center justify-center">
                 <div className="text-6xl font-bold text-success mb-2">{result.score}</div>
                 <div className="text-sm font-bold uppercase tracking-widest text-success px-4 py-2 bg-success/10 mt-4 border border-success/20">
                    Systemic Resilience: {result.status}
                 </div>
              </div>
              <p className="text-sm text-text-secondary mt-8 max-w-lg mx-auto">
                 Your baseline defense metrics meet institutional standards. Proceed to asset allocation and X-Ray diagnostics.
              </p>
           </div>
        </div>
      )}

    </div>
  );
}

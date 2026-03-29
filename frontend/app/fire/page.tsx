"use client";
import { useState, useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import { api, FireResult } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Calculator, Target, IndianRupee, WalletCards, ArrowRight, Flame, Zap, ArrowDown } from "lucide-react";

export default function FirePage() {
  const { user } = useUser();
  const [data, setData] = useState({ age: 28, retirement_age: 45, income: 150000, expenses: 60000, savings: 500000 });
  
  const [baseResult, setBaseResult] = useState<FireResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  // Sync with User Context on mount
  useEffect(() => {
    if (user) {
      setData({
        age: parseInt(user.age || "28") || 28,
        retirement_age: 45, // default
        income: parseFloat(user.income || "150000") || 150000,
        expenses: parseFloat(user.expenses || "60000") || 60000,
        savings: parseFloat(user.savings || "500000") || 500000,
      });
    }
  }, [user]);

  // Scenario
  const [scenario, setScenario] = useState({ extraSip: 0, delayYears: 0 });
  const [scenarioResult, setScenarioResult] = useState<FireResult | null>(null);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.fire(data as any); 
      setBaseResult(res);
      setScenarioResult(res);
      setScenario({ extraSip: 0, delayYears: 0 });
    } catch (e) {
      alert("Error resolving engine state.");
    }
    setLoading(false);
  };

  // Full Reactivity: Re-calculate whenever data or scenario changes
  useEffect(() => {
    const compute = async () => {
      setCalculating(true);
      try {
        const payload = { 
          ...data, 
          extra_sip: scenario.extraSip,
          retirement_age: data.retirement_age + scenario.delayYears,
        };
        const res = await api.fire(payload as any);
        setScenarioResult(res);
        if (!baseResult) setBaseResult(res); // Initialize base if empty
      } catch (e) {
        // ignore
      }
      setCalculating(false);
    };
    const t = setTimeout(compute, 300);
    return () => clearTimeout(t);
  }, [data.age, data.retirement_age, data.income, data.expenses, data.savings, scenario.extraSip, scenario.delayYears]);

  const activeResult = scenarioResult || baseResult;

  const chartData = activeResult ? Array.from({length: 10}, (_, i) => {
    const y = i * 2 + 1;
    const rate = 0.12 / 12;
    const months = y * 12;
    const inv = activeResult.monthly_investment;
    const futureSavings = (data.savings || 0) * Math.pow(1 + rate, months);
    const futureSip = inv > 0 ? inv * ((Math.pow(1 + rate, months) - 1) / rate) : 0;
    return {
      year: `Y${y}`,
      value: Math.round((futureSavings + futureSip) / 100000)
    };
  }) : [];

  const fmt = (n: number) => n.toLocaleString('en-IN');

  return (
    <div className="animate-fade-in pb-12 font-sans text-text-primary">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-3">
          <Flame className="w-4 h-4 text-text-primary" />
          <div className="text-[10px] font-bold text-text-primary tracking-[0.2em] uppercase">Capital Advisory</div>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-text-primary mb-4">The Path to Freedom.</h1>
        <p className="text-text-primary text-lg max-w-2xl leading-relaxed font-medium opacity-80">
          Compute the exact capital requirement to untether from active employment. Map your journey to financial independence in precision.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Input Panel */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-surface p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-shadow duration-300 relative border border-black/5">
             <div className="flex items-center gap-3 border-b border-black/10 pb-4 mb-8">
                <Calculator className="w-5 h-5 text-text-primary" />
                <h2 className="text-sm uppercase tracking-widest font-black text-text-primary">Key Parameters</h2>
             </div>
             
             <div className="space-y-6">
                 <div className="group/input relative transition-transform hover:-translate-y-0.5 duration-200">
                    <label className="block text-[10px] uppercase tracking-widest text-text-primary font-bold mb-2 group-hover/input:text-primary transition-colors">
                      Current Age
                    </label>
                    <input type="number" value={data.age} onChange={e => setData({...data, age: +e.target.value})} className="w-full bg-slate-50 border-b-2 border-slate-200 px-3 py-3 outline-none focus:border-text-primary focus:bg-slate-100 text-text-primary font-bold text-lg transition-all" />
                 </div>
                 
                 <div className="group/input relative transition-transform hover:-translate-y-0.5 duration-200">
                    <label className="block text-[10px] uppercase tracking-widest text-text-primary font-bold mb-2 group-hover/input:text-primary transition-colors">
                      Target FIRE Age
                    </label>
                    <input type="number" value={data.retirement_age} onChange={e => setData({...data, retirement_age: +e.target.value})} className="w-full bg-slate-50 border-b-2 border-slate-200 px-3 py-3 outline-none focus:border-text-primary focus:bg-slate-100 text-text-primary font-bold text-lg transition-all" />
                 </div>
                 
                 <div className="group/input relative transition-transform hover:-translate-y-0.5 duration-200">
                    <label className="block text-[10px] uppercase tracking-widest text-text-primary font-bold mb-2 group-hover/input:text-primary transition-colors">
                      Monthly Income (₹)
                    </label>
                    <input type="number" value={data.income} onChange={e => setData({...data, income: +e.target.value})} className="w-full bg-slate-50 border-b-2 border-slate-200 px-3 py-3 outline-none focus:border-text-primary focus:bg-slate-100 text-text-primary font-bold text-lg transition-all" />
                 </div>
                 
                 <div className="group/input relative transition-transform hover:-translate-y-0.5 duration-200">
                    <label className="block text-[10px] uppercase tracking-widest text-text-primary font-bold mb-2 group-hover/input:text-primary transition-colors">
                      Monthly Expenses (₹)
                    </label>
                    <input type="number" value={data.expenses} onChange={e => setData({...data, expenses: +e.target.value})} className="w-full bg-slate-50 border-b-2 border-slate-200 px-3 py-3 outline-none focus:border-text-primary focus:bg-slate-100 text-text-primary font-bold text-lg transition-all" />
                 </div>

                 <div className="group/input relative transition-transform hover:-translate-y-0.5 duration-200">
                    <label className="block text-[10px] uppercase tracking-widest text-text-primary font-bold mb-2 group-hover/input:text-primary transition-colors">
                      Current Savings (₹)
                    </label>
                    <input type="number" value={data.savings} onChange={e => setData({...data, savings: +e.target.value})} className="w-full bg-slate-50 border-b-2 border-slate-200 px-3 py-3 outline-none focus:border-text-primary focus:bg-slate-100 text-text-primary font-bold text-lg transition-all" />
                 </div>
             </div>
             
             <button onClick={calculate} disabled={loading} className="w-full group bg-text-primary text-surface font-bold tracking-[0.2em] uppercase text-xs py-5 mt-8 hover:bg-black transition-all hover:shadow-[0_10px_40px_rgba(15,23,42,0.2)] flex items-center justify-center gap-3">
               {loading ? "Computing..." : (
                 <>
                   Compile Projection
                   <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </>
               )}
             </button>
          </div>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-8 flex flex-col gap-8">
           <div className="bg-surface p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] h-[400px] flex flex-col group transition-shadow relative overflow-hidden border border-black/5">
              <div className="flex items-center gap-3 mb-8">
                 <Target className="w-5 h-5 text-text-primary" />
                 <h3 className="text-xs uppercase tracking-widest text-text-primary font-black">Capital Velocity Projection (₹ Lacs)</h3>
              </div>
              <div className="flex-1 w-full">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{top:0, right: 0, left: -20, bottom: 0}}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#0f172a', fontWeight: 'bold'}} dy={15} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b', fontWeight: 'bold'}} />
                      <Tooltip 
                        cursor={{fill: '#f1f5f9'}} 
                        contentStyle={{border: '1px solid #e2e8f0', borderRadius: '0px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', color: '#0f172a'}} 
                        formatter={(val: number) => `₹${val} Lacs`}
                      />
                      <Bar dataKey="value" fill="#0f172a" radius={[2, 2, 0, 0]} maxBarSize={48} className="hover:opacity-80 transition-opacity duration-300 cursor-pointer" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-secondary opacity-50 font-medium">Enter inputs & compile to see projection</div>
                )}
              </div>
           </div>

           {baseResult && activeResult && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* FIRE Number Card */}
                <div className="bg-text-primary text-surface p-8 shadow-xl flex flex-col justify-center relative overflow-hidden group">
                   <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 blur-[40px] mix-blend-overlay group-hover:scale-150 group-hover:bg-white/10 transition-all duration-700"></div>
                   <div className="flex gap-2 items-center mb-4 opacity-70">
                     <IndianRupee className="w-4 h-4" />
                     <div className="text-[10px] uppercase tracking-[0.2em] font-bold">Required Freedom Capital</div>
                   </div>
                   <div className="text-5xl font-black mb-6 tracking-tighter">₹{(activeResult.fire_number/100000).toFixed(1)}L</div>
                   
                   <p className="text-sm opacity-80 leading-relaxed font-medium mb-4">
                     To indefinitely sustain your lifestyle of <span className="text-white font-bold">₹{(activeResult.annual_expenses/100000).toFixed(1)}L</span> per annum.
                   </p>
                   
                   <div className="pt-4 border-t border-white/10">
                      <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Time to FIRE</div>
                      <div className="font-bold text-2xl">
                        {activeResult.actual_years_to_fire > 0 ? `${activeResult.actual_years_to_fire} Years` : "Already Reached 🚀"}
                      </div>
                   </div>
                </div>

                {/* Scenario Lab & SIP Split */}
                <div className="flex flex-col gap-6">
                   <div className="bg-emerald-50 p-6 shadow-sm border border-emerald-200 transition-all duration-300 group rounded-xl">
                      <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xs uppercase tracking-[0.15em] text-emerald-800 font-black flex items-center gap-2">
                           <Zap className="w-4 h-4" /> Scenario Simulator
                         </h3>
                      </div>
                      
                      <div className="space-y-5">
                        {/* Sliders */}
                        <div>
                          <div className="flex justify-between text-xs font-bold text-emerald-900 mb-2">
                            <span>Increase SIP (₹/mo)</span>
                            <span>+₹{fmt(scenario.extraSip)}</span>
                          </div>
                          <input 
                            type="range" min="0" max="200000" step="5000"
                            value={scenario.extraSip}
                            onChange={(e) => setScenario({ ...scenario, extraSip: +e.target.value })}
                            className="w-full accent-emerald-600"
                          />
                        </div>

                        {/* Impact display */}
                        {scenario.extraSip > 0 && baseResult.actual_years_to_fire > 0 && activeResult.actual_years_to_fire > 0 && (
                          <div className="bg-emerald-100/50 p-3 rounded-lg text-sm text-emerald-800 font-semibold flex flex-col gap-1 border border-emerald-200/50 animate-fade-in">
                            <span className="flex items-center gap-2">
                              Before: <span className="opacity-70 line-through">Retire at age {data.age + baseResult.actual_years_to_fire}</span>
                            </span>
                            <span className="flex items-center gap-2 font-bold text-emerald-700">
                              <ArrowRight className="w-4 h-4" /> 
                              After: Retire at age {data.age + activeResult.actual_years_to_fire}
                            </span>
                            <span className="mt-1 text-emerald-600 text-xs">
                              You save {baseResult.actual_years_to_fire - activeResult.actual_years_to_fire} years of your life! 🎉
                            </span>
                          </div>
                        )}
                        
                        {scenario.extraSip === 0 && (
                          <div className="text-xs text-emerald-700/70 font-medium italic text-center py-2">
                            Slide to see instant future impact.
                          </div>
                        )}
                      </div>
                   </div>
                   
                   <div className="bg-surface p-6 shadow-sm border border-black/5 rounded-xl">
                      <div className="flex items-center gap-2 mb-5 border-b border-black/5 pb-3">
                         <WalletCards className="w-4 h-4 text-text-primary" />
                         <h3 className="text-[10px] uppercase tracking-[0.15em] text-text-primary font-black">SIP Directives</h3>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center text-sm group cursor-pointer w-full">
                            <span className="font-bold text-text-primary group-hover:translate-x-1 transition-transform">Equity Large Cap</span>
                            <span className="text-white bg-text-primary font-black tracking-widest text-[10px] px-2 py-1">60%</span>
                         </div>
                         <div className="flex justify-between items-center text-sm group cursor-pointer w-full">
                            <span className="font-bold text-text-primary group-hover:translate-x-1 transition-transform">Mid & Small Cap</span>
                            <span className="text-white bg-text-primary font-black tracking-widest text-[10px] px-2 py-1">25%</span>
                         </div>
                         <div className="flex justify-between items-center text-sm group cursor-pointer w-full">
                            <span className="font-bold text-text-primary group-hover:translate-x-1 transition-transform">Debt Funds</span>
                            <span className="text-white bg-text-primary font-black tracking-widest text-[10px] px-2 py-1">15%</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}

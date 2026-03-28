"use client";
import { useState } from "react";
import Link from "next/link";
import { api, AnalyzeResult, AnalyzeInput } from "@/lib/api";

export default function DecisionEngine() {
  const [data, setData] = useState<AnalyzeInput>({
    age: 28,
    retirement_age: 45,
    income: 150000,
    expenses: 60000,
    savings: 500000,
    emergency_months: 4
  });
  
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.analyze(data);
      setResult(res);
    } catch (e: any) {
      setError(e.message || "Failed to connect to the Decision Engine backend. Ensure backend is running at port 8000.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto animate-swift-fade font-inter bg-black text-white relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#003d7a]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-[#1a0033]/30 blur-[120px] rounded-full" />
      </div>

      <header className="mb-12 flex justify-between items-end border-b border-white/10 pb-6">
        <div>
          <div className="bg-white/10 text-white px-3 py-1 rounded inline-block text-[10px] font-bold mb-4 tracking-widest uppercase border border-white/20">
            System Online
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold leading-[1.1] tracking-tight">
            AI Financial Decision Engine.
          </h1>
          <p className="text-lg text-slate-400 mt-3 max-w-2xl">
            Not a dashboard. Not a chatbot. An autonomous system that thinks, calculates, and executes strategic financial directives.
          </p>
        </div>
        <Link href="/" className="text-xs text-slate-500 hover:text-white uppercase tracking-widest transition-colors hidden md:block">
          [&nbsp;Exit Protocol&nbsp;]
        </Link>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Matrix */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0f0f13] border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-emerald-500" />
             <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
               Data Ingestion
             </h2>
             
             <div className="space-y-4">
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Current Age</label>
                  <input type="number" value={data.age} onChange={e => setData({...data, age: +e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-sm font-mono transition-colors" />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Target FIRE Age (Years)</label>
                  <input type="number" value={data.retirement_age} onChange={e => setData({...data, retirement_age: +e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-sm font-mono transition-colors" />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Monthly Income (₹)</label>
                  <input type="number" value={data.income} onChange={e => setData({...data, income: +e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-sm font-mono transition-colors" />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Monthly Expenses (₹)</label>
                  <input type="number" value={data.expenses} onChange={e => setData({...data, expenses: +e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-sm font-mono transition-colors" />
               </div>
               <div>
                  <label className="block text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">Current Liquid Savings (₹)</label>
                  <input type="number" value={data.savings} onChange={e => setData({...data, savings: +e.target.value})} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-sm font-mono transition-colors" />
               </div>
             </div>

             <button 
                onClick={analyze} 
                className="w-full mt-8 bg-white text-black font-bold py-4 text-sm tracking-widest uppercase rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group"
                disabled={loading}
             >
                {loading ? (
                   <span className="animate-pulse">Processing...</span>
                ) : (
                   <>Initialize Engine <span className="group-hover:translate-x-1 transition-transform">→</span></>
                )}
             </button>
          </div>
        </div>

        {/* Engine Output */}
        <div className="lg:col-span-8">
           {error && (
             <div className="bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl p-6 mb-6 font-mono text-sm animate-fade-in flex items-start gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {error}
             </div>
           )}

           {!result && !loading && !error && (
              <div className="h-full min-h-[400px] border border-white/5 bg-[#0f0f13]/50 rounded-2xl flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                 <div className="text-center font-mono text-xs text-slate-600 tracking-widest uppercase group-hover:text-slate-400 transition-colors">
                    Awaiting Directives
                 </div>
              </div>
           )}

           {loading && (
              <div className="h-full min-h-[400px] border border-blue-500/20 bg-[#0f0f13] rounded-2xl flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                 <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                 <div className="text-blue-400 font-mono text-xs uppercase tracking-widest animate-pulse">Running Neural Optimization...</div>
              </div>
           )}

           {result && !loading && (
              <div className="space-y-6 animate-slide-up">
                 
                 {/* FIRE Core Metrics */}
                 <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8 border-b border-white/10 pb-4">Core FIRE Metrics</h2>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                       <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Target Freedom Number</div>
                          <div className="text-2xl font-mono font-bold text-white">₹{(result.fire.fire_number / 100000).toFixed(1)}L</div>
                       </div>
                       <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Projected Wealth</div>
                          <div className={`text-2xl font-mono font-bold ${result.fire.total_wealth >= result.fire.fire_number ? 'text-emerald-400' : 'text-orange-400'}`}>
                             ₹{(result.fire.total_wealth / 100000).toFixed(1)}L
                          </div>
                       </div>
                       <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Projected Gap</div>
                          <div className={`text-2xl font-mono font-bold ${result.fire.gap <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                             {result.fire.gap <= 0 ? "None" : `₹${(result.fire.gap / 100000).toFixed(1)}L`}
                          </div>
                       </div>
                       <div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Current Status</div>
                          <div className={`text-sm font-bold uppercase tracking-widest mt-1 px-3 py-1 inline-block rounded ${result.fire.status === 'On Track' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                             {result.fire.status}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Machine Recommendations */}
                    <div className="bg-[#0f0f13] border border-white/10 rounded-2xl p-8 shadow-xl">
                       <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                          System Directives
                       </h2>
                       <ul className="space-y-4">
                         {result.recommendations.map((rec, idx) => (
                            <li key={idx} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                               <span className="shrink-0 text-amber-500 mt-0.5">⚠️</span>
                               <span className="text-sm text-slate-300 leading-relaxed font-mono">{rec}</span>
                            </li>
                         ))}
                         {result.recommendations.length === 0 && (
                            <li className="text-sm text-slate-500 font-mono text-center p-4">No critical system deviations detected.</li>
                         )}
                       </ul>
                    </div>

                    {/* AI Advisor Context */}
                    <div className="bg-gradient-to-br from-[#002753] to-[#011429] border border-blue-500/30 rounded-2xl p-8 shadow-xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none" />
                       <h2 className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-6 flex items-center gap-2">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                          OpenAI Strategic Analysis
                       </h2>
                       <div className="prose prose-invert prose-sm font-mono max-w-none prose-p:leading-relaxed prose-headings:text-blue-300 prose-li:text-slate-300">
                          {result.ai_advice.split('\n').map((line, i) => (
                             line.trim() === "" ? <br key={i}/> : <p key={i} className="mb-2">{line}</p>
                          ))}
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

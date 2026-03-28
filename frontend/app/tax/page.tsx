"use client";
import { useState } from "react";
import { api, TaxResult } from "@/lib/api";

export default function TaxPage() {
  const [data, setData] = useState({ income: 1500000, deductions: 150000 });
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await api.tax(data);
      setResult(res);
    } catch {
      alert("Error calculating taxes");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in pb-12 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
        <header className="lg:col-span-8">
          <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-2">Tax Optimization</div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">Precision Tax Counseling.</h1>
          <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
             Submit your Form-16 for automated deduction discrepancy analysis.
          </p>
        </header>

        {/* Right side upload box */}
        <div className="lg:col-span-4 flex items-center justify-center">
           <div className="w-full h-full min-h-[120px] border-2 border-dashed border-text-secondary/30 rounded-xl bg-surface flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-section transition-colors group">
              <div className="w-8 h-8 rounded-full bg-section flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-primary">Upload Form-16 (PDF)</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         {/* Computations Area */}
         <div className="lg:col-span-4 bg-surface p-8 shadow-sm">
             <div className="border-b border-black/5 pb-2 mb-6">
                <h2 className="text-sm uppercase tracking-widest font-bold text-primary">Manual Overrides</h2>
             </div>
             <div>
                <label className="block text-xs uppercase tracking-widest text-text-secondary font-bold mb-2">Gross Salary (₹)</label>
                <input type="number" value={data.income} onChange={e => setData({...data, income: +e.target.value})} className="w-full bg-transparent border-b border-section px-2 py-2 outline-none focus:border-primary text-primary font-bold text-lg transition-colors" />
             </div>
             <div className="mt-6">
                <label className="block text-xs uppercase tracking-widest text-text-secondary font-bold mb-2">Claimed Deductions (₹)</label>
                <input type="number" value={data.deductions} onChange={e => setData({...data, deductions: +e.target.value})} className="w-full bg-transparent border-b border-section px-2 py-2 outline-none focus:border-primary text-primary font-bold text-lg transition-colors" />
             </div>
             
             <button onClick={calculate} disabled={loading} className="w-full bg-gradient-primary text-white font-bold tracking-widest uppercase text-sm py-4 mt-8 shadow-md hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 duration-200">
               Run Tax Audit
             </button>
         </div>

         <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Regime Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-surface p-8 shadow-sm border border-black/5 relative overflow-hidden group">
                  <div className="text-[10px] text-text-secondary uppercase tracking-widest font-bold mb-4">Old Regime Liability</div>
                  <div className="text-3xl font-bold text-primary">₹{result ? result.old_regime_tax.toLocaleString() : '--'}</div>
                  <div className="mt-4 text-xs font-medium text-text-secondary">Assumes full utilization of 80C, 80D, and applicable HRA.</div>
               </div>
               
               <div className={`bg-gradient-primary text-white p-8 shadow-sm relative overflow-hidden group`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none"></div>
                  <div className="text-[10px] text-white/70 uppercase tracking-widest font-bold mb-4">New Regime Liability (Recommended)</div>
                  <div className="text-3xl font-bold text-white">₹{result ? result.new_regime_tax.toLocaleString() : '--'}</div>
                  <div className="mt-4 text-xs font-medium text-white/80">Default flat tax brackets with ₹50,000 standard deduction limits.</div>
               </div>
            </div>

            {/* Gap Analysis & Investments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Gap List */}
               <div className="bg-surface p-6 shadow-sm">
                  <h3 className="text-xs uppercase tracking-widest text-primary font-bold mb-4">Deduction Gap Analysis</h3>
                  <ul className="space-y-4">
                     <li className="flex justify-between items-center text-sm border-b border-section pb-3">
                        <span className="text-text-secondary">Sec 80C Limit</span>
                        <span className="font-bold text-red-500">Short by ₹35,000</span>
                     </li>
                     <li className="flex justify-between items-center text-sm border-b border-section pb-3">
                        <span className="text-text-secondary">Sec 80D (Health)</span>
                        <span className="font-bold text-success">Optimized</span>
                     </li>
                     <li className="flex justify-between items-center text-sm pb-1">
                        <span className="text-text-secondary">NPS Tier 1</span>
                        <span className="font-bold text-red-500">Short by ₹50,000</span>
                     </li>
                  </ul>
               </div>

               {/* Suggestions */}
               <div className="bg-section p-6 rounded-lg shadow-inner">
                  <h3 className="text-xs uppercase tracking-widest text-primary font-bold mb-4">Investment Counsel</h3>
                  <div className="bg-surface p-4 rounded mb-3 shadow-sm border-l-2 border-primary">
                     <div className="text-xs font-bold text-primary mb-1">ELSS Allocation Required</div>
                     <p className="text-[10px] text-text-secondary leading-relaxed">Direct ₹35,000 before March 31st to exhaust aggregate limit and save additional ₹10,500 in tax burden.</p>
                  </div>
                  <div className="bg-surface p-4 rounded shadow-sm border-l-2 border-primary">
                     <div className="text-xs font-bold text-primary mb-1">Corporate NPS Registration</div>
                     <p className="text-[10px] text-text-secondary leading-relaxed">Leverage 80CCD(2) through employer restructuring for un-capped standard deductions.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

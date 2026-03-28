"use client";
import { useState } from "react";

export default function PortfolioPage() {
  return (
    <div className="animate-fade-in pb-12 font-sans">
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4">Portfolio X-Ray.</h1>
        <p className="text-text-secondary text-base leading-relaxed">
          Subject your external asset allocations to algorithmic scrutiny and overlap detection.
        </p>
      </header>

      {/* Center Layout Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
         {/* Center Large Drop Zone */}
         <div className="lg:col-span-8 bg-surface p-12 shadow-sm border border-black/5 flex flex-col items-center justify-center min-h-[400px]">
             <div className="w-16 h-16 rounded-full bg-section flex items-center justify-center text-primary mb-6 animate-pulse-slow">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
             </div>
             <h2 className="text-xl font-bold text-primary mb-3">Sync External Capital</h2>
             <p className="text-sm text-text-secondary mb-8 text-center max-w-sm leading-relaxed">
               Securely ingest your CAS statement or drag PDF files here to initiate structural portfolio analysis.
             </p>
             <button className="bg-gradient-primary text-white font-bold text-xs uppercase tracking-widest px-8 py-3 rounded shadow-md hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 duration-200">
               Browse Files
             </button>
             <div className="mt-8 text-[10px] text-text-secondary uppercase tracking-widest">Supports NSDL & CDSL CAS</div>
         </div>

         {/* Right Green Insight Card */}
         <div className="lg:col-span-4 bg-[#0f766e] text-white p-8 shadow-sm relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-[50px] rounded-full mix-blend-overlay"></div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-6">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <h3 className="text-lg font-bold mb-3">Alpha Execution</h3>
            <p className="text-sm leading-relaxed opacity-90 font-medium mb-6">
               Your recent transition from inactive regular funds to direct indexing lowered operational expense ratios by 1.2%, accelerating absolute compounding curves by 3 years.
            </p>
            <div className="mt-auto text-[10px] uppercase font-bold tracking-widest opacity-70">
               Historical Insight Validated
            </div>
         </div>
      </div>

      {/* Metrics Row Bottom */}
      <h3 className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-6 text-center">Global Performance Indices (Sample Data)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
         <div className="bg-surface p-6 shadow-sm border-t-2 border-primary text-center">
            <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Aggregate XIRR</div>
            <div className="text-2xl font-bold text-success">18.2%</div>
         </div>
         <div className="bg-surface p-6 shadow-sm border-t-2 border-primary text-center">
            <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Expense Drag</div>
            <div className="text-2xl font-bold text-red-500">0.9%</div>
            <div className="mt-1 text-[10px] text-text-secondary">High warning</div>
         </div>
         <div className="bg-surface p-6 shadow-sm border-t-2 border-primary text-center">
            <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Asset Overlap</div>
            <div className="text-2xl font-bold text-primary">24.0%</div>
         </div>
         <div className="bg-surface p-6 shadow-sm border-t-2 border-primary text-center">
            <div className="text-[10px] uppercase tracking-widest text-text-secondary font-bold mb-2">Sharpe Ratio</div>
            <div className="text-2xl font-bold text-success">1.64</div>
            <div className="mt-1 text-[10px] text-text-secondary">Excellent Risk/Reward</div>
         </div>
      </div>

    </div>
  );
}

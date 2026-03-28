"use client";
import React, { useState } from "react";
import { Calculator, Target, Heart, Home, Baby, TrendingUp, Presentation, CheckCircle2 } from "lucide-react";

export default function GoalsPage() {
  const [goal, setGoal] = useState("house");
  const [targetAmount, setTargetAmount] = useState<number>(5000000); // 50L
  const [years, setYears] = useState<number>(5);
  const [rate, setRate] = useState<number>(12); // 12%

  const r = rate / 100 / 12;
  const n = years * 12;
  
  // FV = P * [ ((1+r)^n - 1) / r ]
  // P = FV * r / ((1+r)^n - 1)
  const reqSip = targetAmount * r / (Math.pow(1 + r, n) - 1);
  const totalInvested = reqSip * n;
  const totalGain = targetAmount - totalInvested;

  const fmt = (v: number) => v.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const templates = [
    { id: "house", icon: <Home className="w-5 h-5" />, title: "Buy a House", defaultTarget: 5000000, defaultYears: 5 },
    { id: "marriage", icon: <Heart className="w-5 h-5" />, title: "Marriage Fund", defaultTarget: 1500000, defaultYears: 3 },
    { id: "baby", icon: <Baby className="w-5 h-5" />, title: "Child Education", defaultTarget: 7500000, defaultYears: 15 },
    { id: "business", icon: <Presentation className="w-5 h-5" />, title: "Start Business", defaultTarget: 2000000, defaultYears: 4 },
  ];

  const handleTemplate = (t: any) => {
    setGoal(t.id);
    setTargetAmount(t.defaultTarget);
    setYears(t.defaultYears);
  };

  return (
    <div className="animate-fade-in pb-16 font-sans">
      <header className="mb-10 pb-8 border-b border-black/5">
        <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" /> Goal-Based Planning
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4 leading-[1.15]">
          Translate dreams<br />into <span className="text-emerald-600">monthly SIPs.</span>
        </h1>
        <p className="text-text-secondary text-base max-w-2xl leading-relaxed">
          Select a major life event or a custom goal. See precisely how much you must systematically invest per month to achieve it with zero massive financial shocks.
        </p>
      </header>

      {/* Goal Templates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {templates.map(t => (
          <button 
            key={t.id} 
            onClick={() => handleTemplate(t)}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
              goal === t.id 
                ? "border-primary bg-primary text-white shadow-lg scale-[1.02]" 
                : "border-black/5 bg-surface text-primary hover:border-black/20 hover:scale-[1.01]"
            }`}
          >
            <div className="mb-3 opacity-90">{t.icon}</div>
            <div className="font-bold text-sm">{t.title}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form */}
        <div className="lg:col-span-5 bg-surface rounded-3xl p-8 shadow-sm border border-black/5">
          <h2 className="text-xs uppercase tracking-widest font-black text-text-secondary mb-8 flex items-center gap-2">
            <Calculator className="w-4 h-4" /> Goal Parameters
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">
                Target Amount (₹)
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={targetAmount} 
                  onChange={e => setTargetAmount(Number(e.target.value))}
                  className="w-full bg-background border-2 border-black/10 rounded-xl px-4 py-4 font-bold text-2xl text-primary outline-none focus:border-emerald-500 focus:bg-emerald-50/50 transition-all text-center"
                />
              </div>
            </div>

            <div>
              <label className="flex justify-between text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">
                <span>Timeline (Years)</span>
                <span className="text-primary">{years} yrs</span>
              </label>
              <input 
                type="range" min="1" max="30" step="1"
                value={years} onChange={e => setYears(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <label className="flex justify-between text-xs font-bold text-text-secondary mb-2 uppercase tracking-widest">
                <span>Expected Annual Return</span>
                <span className="text-primary">{rate}%</span>
              </label>
              <input 
                type="range" min="4" max="25" step="0.5"
                value={rate} onChange={e => setRate(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="text-[10px] text-text-secondary mt-2 flex justify-between">
                <span>4% (FDs/Bonds)</span>
                <span>12% (Equity Index)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Result Panel */}
        <div className="lg:col-span-7">
          <div className="bg-[#002753] text-white rounded-3xl p-10 shadow-xl h-full flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 blur-[60px] rounded-full mix-blend-screen group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
            
            <div className="bg-emerald-500/20 w-fit px-4 py-1.5 rounded-full text-emerald-200 text-xs font-bold uppercase tracking-widest mb-6 inline-flex items-center gap-2 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Action Plan
            </div>

            <h3 className="text-lg text-white/70 font-medium mb-2">Required Monthly SIP</h3>
            <div className="text-6xl tracking-tight font-bold mb-6">
              ₹{fmt(reqSip)}<span className="text-2xl text-white/50 font-medium">/mo</span>
            </div>
            
            <p className="text-white/80 leading-relaxed mb-8 max-w-md">
              Invest <strong className="text-emerald-400">₹{fmt(reqSip)}</strong> every month for exactly {years} years at an expected return of {rate}% to hit your target of <strong className="text-white">₹{fmt(targetAmount)}</strong>.
            </p>

            {/* Split Breakdown */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 grid grid-cols-2 gap-6 relative overflow-hidden">
               <div className="absolute left-0 bottom-0 w-full h-1 bg-white/10 flex">
                 <div className="h-full bg-blue-400" style={{ width: `${(totalInvested/targetAmount)*100}%` }} />
                 <div className="h-full bg-emerald-400" style={{ width: `${(totalGain/targetAmount)*100}%` }} />
               </div>
               <div>
                  <div className="text-[10px] uppercase font-bold text-white/50 tracking-widest mb-1.5 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400" /> You Invest
                  </div>
                  <div className="text-xl font-bold">₹{fmt(totalInvested)}</div>
               </div>
               <div>
                  <div className="text-[10px] uppercase font-bold text-white/50 tracking-widest mb-1.5 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> Wealth Gained
                  </div>
                  <div className="text-xl font-bold text-emerald-300">₹{fmt(totalGain)}</div>
               </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

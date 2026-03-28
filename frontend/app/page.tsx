"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, X, Send, Calculator, Activity, LayoutDashboard, PieChart, Sparkles, ArrowRight } from "lucide-react";
import { useUser } from "@/context/UserContext";

const features = [
  {
    href: "/fire",
    icon: <Calculator className="w-8 h-8 text-[#002753]" />,
    title: "FIRE Calculator",
    desc: "Know exactly when you can retire. Calculate your freedom number.",
  },
  {
    href: "/health",
    icon: <Activity className="w-8 h-8 text-[#002753]" />,
    title: "Money Health Score",
    desc: "Get a 0–100 score across 6 financial dimensions in seconds.",
  },
  {
    href: "/tax",
    icon: <LayoutDashboard className="w-8 h-8 text-[#002753]" />,
    title: "Tax Optimizer",
    desc: "Old vs New regime comparison. Find which saves you more ₹.",
  },
  {
    href: "/portfolio",
    icon: <PieChart className="w-8 h-8 text-[#002753]" />,
    title: "Portfolio X-Ray",
    desc: "Analyze CAGR, allocation, and get smart rebalancing signals.",
  },
  {
    href: "/advisor",
    icon: <Sparkles className="w-8 h-8 text-[#002753]" />,
    title: "AI Advisor — Artha",
    desc: "Chat with your personal Indian financial advisor.",
  },
];

const stats = [
  { label: "Financial Tools", value: "5" },
  { label: "Indian Tax Slabs", value: "2026" },
  { label: "Cost", value: "Free" },
];

export default function Home() {
  const [visible, setVisible] = useState(false);
  const { user, isHydrated } = useUser();

  useEffect(() => { setVisible(true); }, []);

  const hasData = isHydrated && user?.income;
  const investment = hasData ? (Number(user.income) - Number(user.expenses)).toLocaleString('en-IN') : 0;

  return (
    <main className="min-h-screen bg-white relative overflow-x-hidden font-sans">
      {/* Subtle radial background FIX */}
      <div 
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle at center, rgba(0,39,83,0.05), transparent 60%)' }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-xl font-extrabold text-[#0f172a]">Artha</span>
          <span className="text-[#64748b] font-medium text-sm ml-1 hidden sm:inline-block">AI Money Mentor</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/login" className="text-sm font-bold text-[#475569] hover:text-[#0f172a] transition-colors cursor-pointer hidden md:block">
            Login / Sign Up
          </Link>
          <div className="w-px h-4 bg-[#e2e8f0] hidden md:block"></div>
          <Link href="/dashboard" className="text-sm font-bold text-[#475569] hover:text-[#002753] transition-colors cursor-pointer">
            Dashboard
          </Link>
          <Link href="/advisor" className="text-sm font-bold bg-[#f1f5f9] text-[#0f172a] hover:bg-[#e2e8f0] transition-colors px-5 py-2.5 rounded-full cursor-pointer shadow-sm">
            Chat with Artha →
          </Link>
        </div>
      </nav>

      {/* Hero / Dashboard Dual-View */}
      <section className={`relative z-10 max-w-[900px] mx-auto px-6 pt-24 pb-20 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        {hasData ? (
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0f172a] mb-2 tracking-tight">
              Good morning, {user?.name || "Wealth Builder"} 👋
            </h1>
            <p className="text-[#475569] font-medium mb-12">Here is your financial snapshot.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
               <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all">
                  <div className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Monthly Investment</div>
                  <div className="text-3xl font-extrabold text-[#0f172a]">₹{investment}</div>
               </div>
               <div className="bg-white border border-[#e2e8f0] p-6 rounded-2xl shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all">
                  <div className="text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Current Savings</div>
                  <div className="text-3xl font-extrabold text-[#0f172a]">₹{Number(user.savings).toLocaleString('en-IN')}</div>
               </div>
               <div className="bg-gradient-to-tr from-[#002753] to-[#004b9e] border border-[#001a38] p-6 rounded-2xl shadow-md text-white flex flex-col justify-center items-start">
                  <div className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Profile Status</div>
                  <div className="text-xl font-extrabold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-200" /> Secured
                  </div>
               </div>
            </div>
            
            <div className="mt-12">
              <Link href="/onboarding" className="text-sm font-bold text-[#475569] hover:text-[#0f172a] underline decoration-[#cbd5e1] hover:decoration-[#0f172a] transition-colors underline-offset-4">
                Update Financial Profile
              </Link>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-full px-5 py-2 mb-8 text-sm text-[#475569] font-bold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              India's First AI-Powered Personal Finance Advisor
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0f172a] leading-[1.15] mb-8 tracking-tight">
              Your Money, Supercharged by AI
            </h1>

            <p className="text-lg md:text-xl text-[#475569] mb-12 leading-relaxed font-medium">
              Calculate your FIRE number, score your financial health, optimize taxes, 
              analyze your portfolio — all with your personal AI advisor Artha.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                 href="/onboarding"
                 className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#002753] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#001a38] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_20px_rgba(0,39,83,0.15)] cursor-pointer text-base"
               >
                 Set Up Profile
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </Link>
              <Link
                href="/health"
                className="w-full sm:w-auto border-2 border-[#002753] text-[#002753] font-bold px-8 py-4 rounded-xl hover:bg-[#f8fafc] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-base"
              >
                Get My Financial Score
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl mx-auto">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <div className="text-3xl font-extrabold text-[#0f172a] mb-1">{s.value}</div>
                  <div className="text-sm font-bold text-[#64748b] uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
           <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4">
             Everything You Need to Build Wealth
           </h2>
           <p className="text-[#475569] text-base leading-relaxed font-medium">
             Five powerful tools. One mission — your financial freedom. Clean, high-contrast, and deeply insightful.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Link
              key={f.href}
              href={f.href}
              className={`bg-white border border-[#e2e8f0] rounded-2xl p-8 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(15,23,42,0.08)] shadow-[0_4px_20px_rgba(15,23,42,0.03)] transition-all duration-300 group cursor-pointer`}
            >
              <div className="bg-[#f1f5f9] w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                 {f.icon}
              </div>
              <h3 className="text-xl font-extrabold text-[#0f172a] mb-3">{f.title}</h3>
              <p className="text-[#475569] text-base leading-relaxed font-medium mb-6">
                {f.desc}
              </p>
              <div className="text-sm font-extrabold text-[#002753] group-hover:underline">
                Explore Tool →
              </div>
            </Link>
          ))}

          {/* CTA Card */}
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-2xl p-8 flex flex-col justify-center shadow-[0_8px_30px_rgba(15,23,42,0.1)] hover:-translate-y-1 transition-all duration-300">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-extrabold text-white mb-2">Ready to Retire Early?</h3>
            <p className="text-[#94a3b8] text-base leading-relaxed font-medium mb-6">Start with your free financial health check and map your journey to financial freedom.</p>
            <Link href="/health" className="bg-white text-[#0f172a] text-center font-extrabold px-6 py-3 rounded-xl hover:bg-[#f8fafc] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Start Free Check
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#e2e8f0] py-10 text-center text-sm bg-[#f8fafc]">
        <div className="flex items-center justify-center gap-2 mb-2">
           <span className="text-xl">💰</span>
           <strong className="text-[#0f172a] font-extrabold text-base">Artha</strong> 
        </div>
        <p className="text-[#64748b] font-medium">Built for Indian wealth builders. Not personalized financial advice.</p>
      </footer>
    </main>
  );
}

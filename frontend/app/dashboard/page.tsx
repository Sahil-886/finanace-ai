"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Sparkles, RefreshCw, ArrowRight, Download } from "lucide-react";

const API = "http://localhost:8000";

export default function Dashboard() {
  const { user, isHydrated, refreshUser, isSimpleMode } = useUser();
  const [healthData, setHealthData] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);

  // ── Compute derived numbers from user context ──────────────────────────
  const income   = Number(user?.income   || 0);
  const expenses = Number(user?.expenses || 0);
  const savings  = Number(user?.savings  || 0);
  const monthly  = income - expenses;
  const savingsRate = income > 0 ? Math.round((monthly / income) * 100) : 0;

  // format with Indian locale
  const fmt = (n: number) => n.toLocaleString("en-IN");

  // ── Live health-score fetch whenever user financials change ────────────
  useEffect(() => {
    if (!user?.income || !user?.expenses) return;
    const investRatio = income > 0 ? Math.min((monthly / income), 1) : 0;
    const debtRatio   = income > 0 ? Math.min((expenses / income), 1) : 0;

    fetch(`${API}/health/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emergency_months: savings > 0 && expenses > 0 ? Math.min(savings / expenses, 12) : 0,
        insurance: true,
        invest_ratio: investRatio,
        debt_ratio: debtRatio,
        tax_saving: true,
        retirement_saving: savingsRate >= 15,
      }),
    })
      .then((r) => r.json())
      .then((d) => setHealthData(d))
      .catch(() => {});
  }, [user?.income, user?.expenses, user?.savings]);

  // ── Manual refresh handler ─────────────────────────────────────────────
  const handleRefresh = async () => {
    setSyncing(true);
    await refreshUser();
    setSyncing(false);
  };

  // ── Skeleton while hydrating ───────────────────────────────────────────
  if (!isHydrated) {
    return (
      <div className="animate-pulse space-y-6 pb-12">
        <div className="h-10 w-64 bg-section rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-section rounded-xl" />)}
        </div>
      </div>
    );
  }

  // ── No user logged in ──────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-primary tracking-tight">Welcome to Artha</h1>
        <p className="text-text-secondary max-w-sm leading-relaxed">
          Log in to access your personalized financial dashboard, live health score, and AI insights.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 bg-[#002753] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#001a38] transition-all shadow-md hover:scale-[1.02]"
        >
          Log In to Continue <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // ── Health score ring math ────────────────────────────────────────────
  const score = healthData?.score ?? 0;
  const circumference = 2 * Math.PI * 28; // r=28
  const offset = circumference - (score / 100) * circumference;
  const scoreColor = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const scoreLabel = score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";

  return (
    <div className="animate-fade-in pb-12">
      {/* Header */}
      <header className="mb-10 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary mb-1 flex items-center gap-3">
            Good morning, {user.name} 👋
            {healthData?.personality && (
              <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold shadow-sm whitespace-nowrap">
                {healthData.personality}
              </span>
            )}
          </h1>
          <p className="text-text-secondary text-sm">
            Here's your live financial snapshot — last synced now.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={syncing}
            className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary bg-surface border border-black/5 px-4 py-2 rounded-xl transition-all hover:shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync Data"}
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-emerald-700 hover:bg-emerald-50 bg-surface border border-black/5 px-4 py-2 rounded-xl transition-all hover:shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Plan
          </button>
          <Link
            href="/onboarding"
            className="text-sm font-semibold text-white bg-[#002753] hover:bg-[#001a38] px-4 py-2 rounded-xl transition-all"
          >
            Update Profile
          </Link>
        </div>
      </header>

      {/* Smart Alerts */}
      {savingsRate === 0 && expenses > 0 && income > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 font-semibold text-sm">
          <span className="text-xl">⚠️</span> Smart Alert: You didn't invest any portion of your income this month. Even ₹500/mo makes a huge difference over 10 years!
        </div>
      )}
      {expenses > income && income > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 font-semibold text-sm">
          <span className="text-xl">🚨</span> Smart Alert: You are overspending. Your expenses exceed your income this month!
        </div>
      )}

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        {/* Card 1: Health Score Ring */}
        <div className="bg-surface rounded-xl p-6 shadow-sm flex items-center gap-6 group hover:translate-y-[-2px] transition-transform">
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="6" fill="none" />
              <circle
                cx="32" cy="32" r="28"
                stroke={scoreColor}
                strokeWidth="6"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={healthData !== null ? offset : circumference}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center font-bold text-primary text-sm">
              {healthData !== null ? score : "—"}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-1">
              {isSimpleMode ? "Money Status" : "Health Score"}
            </div>
            <div className="text-sm font-semibold" style={{ color: scoreColor }}>
              {healthData !== null ? scoreLabel : "Calculating…"}
            </div>
          </div>
        </div>

        {/* Card 2: Monthly Investment */}
        <div className="bg-surface rounded-xl p-6 shadow-sm flex flex-col justify-center group hover:translate-y-[-2px] transition-transform">
          <div className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-2">
            {isSimpleMode ? "Money Saved This Month" : "Monthly Investment"}
          </div>
          <div className="text-2xl font-bold text-primary mb-1">
            {monthly >= 0 ? `₹${fmt(monthly)}` : `−₹${fmt(Math.abs(monthly))}`}
          </div>
          <div className="text-xs font-medium text-text-secondary">
            {savingsRate}% of income goes to savings
          </div>
        </div>

        {/* Card 3: Total Savings */}
        <div className="bg-surface rounded-xl p-6 shadow-sm flex flex-col justify-center group hover:translate-y-[-2px] transition-transform">
          <div className="text-xs uppercase tracking-widest text-text-secondary font-bold mb-2">
            {isSimpleMode ? "Total Cash Safe" : "Total Savings"}
          </div>
          <div className="text-2xl font-bold text-primary mb-3">₹{fmt(savings)}</div>
          {expenses > 0 && (
            <>
              <div className="w-full h-2 rounded-full bg-section overflow-hidden">
                <div
                  className="h-full bg-gradient-primary transition-all duration-700"
                  style={{ width: `${Math.min((savings / (expenses * 6)) * 100, 100)}%` }}
                />
              </div>
              <div className="text-[10px] text-text-secondary mt-1.5">
                {Math.round((savings / (expenses * 6)) * 100)}% of 6-month emergency fund
              </div>
            </>
          )}
        </div>
      </div>

      {/* Financial Snapshot Row */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-primary mb-6">Financial Snapshot</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface rounded-xl p-5 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Monthly Income</span>
            <span className="text-xl font-bold text-primary">₹{fmt(income)}</span>
          </div>
          <div className="bg-surface rounded-xl p-5 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Monthly Expenses</span>
            <span className="text-xl font-bold text-primary">₹{fmt(expenses)}</span>
          </div>
          <div className="bg-surface rounded-xl p-5 shadow-sm flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Age</span>
            <span className="text-xl font-bold text-primary">
              {user.age ? `${user.age} yrs` : "Not set"}
            </span>
          </div>
        </div>
      </section>

      {/* Next Best Actions & Financial Breakdown */}
      {healthData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Top Actions Engine */}
          <section>
            <h2 className="text-lg font-bold text-primary mb-4">AI Next Best Actions</h2>
            <div className="flex flex-col gap-3">
              {healthData.top_actions?.map((action: any, i: number) => (
                <div key={i} className="bg-surface rounded-xl p-4 shadow-sm flex items-center gap-4 border-l-4" style={{ borderColor: action.color, backgroundColor: action.bg_color }}>
                  <div className="text-2xl shrink-0">{action.icon}</div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-0.5" style={{ color: action.text_color }}>
                      {action.priority === 1 ? "Immediate Action Required" : "Optimization Target"}
                    </div>
                    <div className="font-bold text-sm" style={{ color: action.text_color }}>{action.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Health Breakdown */}
          <section>
            <h2 className="text-lg font-bold text-primary mb-4">
              {isSimpleMode ? "Where you stand" : "Financial Health Breakdown"}
            </h2>
            <div className="bg-surface rounded-xl p-5 shadow-sm space-y-4">
              {Object.entries(healthData.breakdown).map(([key, item]: any) => (
                <div key={key}>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">{item.label}</span>
                    <span className="text-[10px] font-bold text-text-secondary">{item.status}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        item.color === 'emerald' ? 'bg-emerald-500' : 
                        item.color === 'amber' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold text-primary mb-6">Your Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { href: "/fire",      emoji: "🔥", title: isSimpleMode ? "Freedom Finder" : "FIRE Planner",     desc: "Calculate your retirement freedom number." },
            { href: "/goals",     emoji: "🎯", title: isSimpleMode ? "Future Goals" : "Life Events",      desc: "Plan SIPs for your dream house or child's fund." },
            { href: "/tax",       emoji: "📊", title: isSimpleMode ? "Save on Taxes" : "Tax Optimizer",    desc: "Compare old vs new regime to save ₹ this year." },
            { href: "/portfolio", emoji: "📈", title: isSimpleMode ? "Check Investments" : "Portfolio X-Ray",  desc: "Analyze CAGR, allocation, and get signals." },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-surface rounded-xl p-6 shadow-sm relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-primary opacity-5 rounded-bl-full pointer-events-none" />
              <div className="w-10 h-10 rounded bg-section flex items-center justify-center text-primary mb-4 text-xl group-hover:scale-110 transition-transform">
                {item.emoji}
              </div>
              <h3 className="font-bold text-primary mb-2">{item.title}</h3>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">{item.desc}</p>
              <span className="text-xs font-bold text-primary uppercase tracking-widest">Explore →</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

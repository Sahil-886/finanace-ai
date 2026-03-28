"use client";
import React, { useState, useCallback } from "react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import { useUser } from "@/context/UserContext";
import {
  Sparkles, RefreshCw, TrendingUp, Shield, PiggyBank,
  Home, Landmark, Heart, ChevronDown, ChevronUp, CheckCircle2, AlertCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ── Colour palette ────────────────────────────────────────────────────────────
const CLR_A    = "#002753";
const CLR_B    = "#7c3aed";
const CLR_GOOD = "#10b981";
const CLR_WARN = "#f59e0b";

const fmt = (n: number) => Number(n).toLocaleString("en-IN");
const fmtL = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000)   return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${fmt(n)}`;
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface Partner {
  name: string;
  income: string;
  expenses: string;
  savings: string;
  age: string;
  rent: string;
  metro: boolean;
  existing_80c: string;
}

const defaultPartner = (name: string): Partner => ({
  name, income: "", expenses: "", savings: "",
  age: "", rent: "", metro: true, existing_80c: "",
});

// ── Small helpers ─────────────────────────────────────────────────────────────
function NetWorthChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="cgA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={CLR_A} stopOpacity={0.25} />
            <stop offset="95%" stopColor={CLR_A} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="cgB" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor={CLR_B} stopOpacity={0.25} />
            <stop offset="95%" stopColor={CLR_B} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
        <XAxis dataKey="yr"    axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#64748b" }} />
        <YAxis                 axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "#64748b" }}
               tickFormatter={(v) => v >= 100000 ? `${(v/100000).toFixed(0)}L` : v} />
        <Tooltip formatter={(v: any) => fmtL(v)} />
        <Area type="monotone" dataKey="a_corpus" name="Partner A" stroke={CLR_A} strokeWidth={2} fill="url(#cgA)" />
        <Area type="monotone" dataKey="b_corpus" name="Partner B" stroke={CLR_B} strokeWidth={2} fill="url(#cgB)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function SIPPie({ sip, name, color }: { sip: any; name: string; color: string }) {
  if (!sip?.total) return <p className="text-xs text-text-secondary">No investable surplus</p>;
  const slices = [
    { name: "ELSS",         value: sip.elss          },
    { name: "Equity Index", value: sip.equity_index  },
    { name: "Debt Fund",    value: sip.debt          },
    { name: "Liquid Fund",  value: sip.liquid        },
  ].filter((s) => s.value > 0);
  const COLORS = [color, "#0ea5e9", "#f59e0b", "#94a3b8"];
  return (
    <div>
      <div className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">{name}</div>
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie data={slices} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="value">
            {slices.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v: any) => `₹${fmt(v)}/mo`} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 9 }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center text-xs text-text-secondary mt-1">{sip.note}</div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, color = CLR_A }: any) {
  return (
    <div className="bg-surface rounded-2xl p-5 shadow-sm flex gap-4 items-start hover:-translate-y-0.5 transition-transform">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
        {React.cloneElement(icon, { className: "w-5 h-5", style: { color } })}
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-0.5">{label}</div>
        <div className="text-xl font-bold text-primary">{value}</div>
        {sub && <div className="text-xs text-text-secondary mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function Section({ title, icon, info, children, defaultOpen = true }: any) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 hover:bg-section/50 transition-colors text-left"
      >
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002753] to-[#003d7a] flex items-center justify-center shrink-0 mt-0.5">
            {React.cloneElement(icon, { className: "w-4 h-4 text-white" })}
          </div>
          <div>
            <div className="font-bold text-primary">{title}</div>
            {info && <div className="text-xs text-text-secondary mt-1.5 max-w-2xl pr-4 leading-relaxed font-normal">{info}</div>}
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-text-secondary shrink-0" /> : <ChevronDown className="w-5 h-5 text-text-secondary shrink-0" />}
      </button>
      {open && <div className="px-6 pb-6 border-t border-black/5 pt-6">{children}</div>}
    </div>
  );
}

function InputField({ label, name, value, onChange, type = "number", suffix, info }: any) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1.5">{label}</label>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="0"
          className="w-full bg-background border border-black/8 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 text-primary font-bold text-sm transition-all"
        />
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-secondary font-bold">{suffix}</span>}
      </div>
      {info && <div className="text-[10px] text-text-secondary mt-1.5 leading-snug">{info}</div>}
    </div>
  );
}

// ── Partner form ─────────────────────────────────────────────────────────
function PartnerForm({ label, data, onChange, color }: { label: string; data: Partner; onChange: any; color: string }) {
  return (
    <div className="bg-surface rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 border-b border-black/5 flex items-center gap-3" style={{ background: `${color}08` }}>
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: color }}>
          {data.name?.slice(0, 1).toUpperCase() || "?"}
        </div>
        <input
          name="name"
          value={data.name}
          onChange={onChange}
          placeholder="Partner name"
          className="bg-transparent font-bold text-primary text-base outline-none flex-1 placeholder:text-text-secondary"
        />
      </div>
      <div className="p-5 grid grid-cols-2 gap-x-4 gap-y-5">
        <InputField label="Monthly Income (₹)" name="income"    value={data.income}    onChange={onChange} info="In-hand salary after taxes" />
        <InputField label="Monthly Expenses (₹)"name="expenses" value={data.expenses}  onChange={onChange} info="Rent, EMI, groceries, bills" />
        <InputField label="Total Savings (₹)"   name="savings"  value={data.savings}   onChange={onChange} info="Current FD, Mutual Funds, Bank Balance" />
        <InputField label="Age"                  name="age"      value={data.age}       onChange={onChange} suffix="yrs" />
        <InputField label="Monthly Rent (₹)"     name="rent"     value={data.rent}      onChange={onChange} info="Used to calculate HRA exemption" />
        <InputField label="Existing 80C (₹/yr)"  name="existing_80c" value={data.existing_80c} onChange={onChange} info="EPF, PPF, Life Insurance (Max 1.5L)" />
        <div className="col-span-2 flex items-center gap-3 pt-1">
          <input
            type="checkbox"
            id={`metro-${label}`}
            name="metro"
            checked={data.metro}
            onChange={onChange}
            className="w-4 h-4 accent-primary"
          />
          <label htmlFor={`metro-${label}`} className="text-xs font-bold text-text-secondary uppercase tracking-widest">
            Metro City (Mumbai/Delhi/Bengaluru/Kolkata)
          </label>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CouplePlanner() {
  const { user } = useUser();

  const [pa, setPa] = useState<Partner>(() =>
    defaultPartner(user?.name || "Partner A")
  );
  const [pb, setPb] = useState<Partner>(defaultPartner("Partner B"));

  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const updateA = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPa((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setResult(null);
  }, []);

  const updateB = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPb((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
    setResult(null);
  }, []);

  const analyze = async () => {
    if (!pa.income || !pb.income) { setError("Please enter income for both partners."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/couple/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partner_a: pa, partner_b: pb }),
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Backend error");
      setResult(await res.json());
    } catch {
      setError("Could not reach the backend. Please make sure it's running.");
    }
    setLoading(false);
  };

  // ── Build projection chart data ──────────────────────────────────────────
  const projectionData = result ? Array.from({ length: 11 }, (_, i) => {
    const sa = result.net_worth.partner_a_savings;
    const sb = result.net_worth.partner_b_savings;
    const sipA = result.sip.partner_a.total * 12;
    const sipB = result.sip.partner_b.total * 12;
    const g = 0.12;
    return {
      yr: `Y${i}`,
      a_corpus: Math.round(sa * Math.pow(1 + g, i) + sipA * ((Math.pow(1 + g, i) - 1) / g)),
      b_corpus: Math.round(sb * Math.pow(1 + g, i) + sipB * ((Math.pow(1 + g, i) - 1) / g)),
    };
  }) : [];

  const harmony = result?.harmony_score ?? 0;
  const harmonyColor = harmony >= 80 ? CLR_GOOD : harmony >= 50 ? CLR_WARN : "#ef4444";
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (harmony / 100) * circumference;


  return (
    <div className="animate-fade-in pb-16 font-sans">
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <header className="mb-10 pb-8 border-b border-black/5">
        <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3">
          India's First AI Joint Financial Planner
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4 leading-[1.15]">
          Couple's Money<br />
          <span className="bg-gradient-to-r from-[#002753] to-[#7c3aed] bg-clip-text text-transparent">
            Optimizer
          </span>
        </h1>
        <p className="text-text-secondary text-base max-w-2xl leading-relaxed">
          Enter both partners' financials. Our engine optimizes HRA claims, NPS matching, SIP splits,
          joint insurance, and gives you a combined 10-year wealth projection — all at once.
        </p>
      </header>

      {/* ── Input Forms ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <PartnerForm label="A" data={pa} onChange={updateA} color={CLR_A} />
        <PartnerForm label="B" data={pb} onChange={updateB} color={CLR_B} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-4 py-3 rounded-xl mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={analyze}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#002753] to-[#7c3aed] text-white font-bold text-base px-8 py-4 rounded-2xl hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mb-10"
      >
        {loading
          ? <><RefreshCw className="w-5 h-5 animate-spin" /> Running AI Optimization…</>
          : <><Sparkles className="w-5 h-5" /> Optimize Our Finances</>
        }
      </button>

      {/* ── Results ──────────────────────────────────────────────────── */}
      {result && (
        <div className="space-y-8 animate-fade-in">

          {/* Harmony Score + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ring */}
            <div className="bg-gradient-to-br from-[#002753] to-[#7c3aed] rounded-2xl p-6 text-white flex flex-col items-center justify-center shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none" />
              <div className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-4">Harmony Index</div>
              <div className="relative w-28 h-28 mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" stroke="rgba(255,255,255,0.2)" strokeWidth="10" fill="none" />
                  <circle
                    cx="60" cy="60" r="52"
                    stroke="white" strokeWidth="10" fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.2s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{harmony}</span>
                  <span className="text-[10px] opacity-60">/100</span>
                </div>
              </div>
              <div className="text-sm font-semibold opacity-90 text-center">
                {harmony >= 80 ? "Elite Couple 🌟" : harmony >= 60 ? "Strong Foundation 💪" : "Room to Optimize 📈"}
              </div>
            </div>

            {/* Summary + Tax Saved */}
            <div className="md:col-span-2 bg-surface rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">AI Summary</div>
                <p className="text-text-primary font-medium leading-relaxed text-sm">{result.summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-emerald-50 rounded-xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1">Annual Tax Saved</div>
                  <div className="text-2xl font-bold text-emerald-700">{fmtL(result.total_annual_tax_saved)}</div>
                </div>
                <div className="bg-violet-50 rounded-xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-violet-700 mb-1">10-Yr Joint Corpus</div>
                  <div className="text-2xl font-bold text-violet-700">{fmtL(result.net_worth.projected_10yr_corpus)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<PiggyBank />}  label="Combined Savings"          value={fmtL(result.net_worth.combined_savings)} color={CLR_A} />
            <StatCard icon={<TrendingUp />} label="Monthly Investable"         value={fmtL(result.net_worth.monthly_investable_surplus)} sub="/month" color={CLR_B} />
            <StatCard icon={<Shield />}    label="Insurance Saving"            value={`₹${fmt(result.insurance.annual_saving)}/yr`} color={CLR_GOOD} />
            <StatCard icon={<Landmark />}  label="NPS Deduction (A+B)"        value={fmtL(result.nps.partner_a.total_nps_deduction + result.nps.partner_b.total_nps_deduction)} color={CLR_WARN} />
          </div>

          {/* Net Worth Chart */}
          <Section 
            title="Combined 10-Year Wealth Projection" 
            info="Assuming all your investable surplus is compounded at an average of 12% annually, along with your existing savings."
            icon={<TrendingUp />}
          >
            <div className="mb-4 flex gap-6 text-xs font-semibold">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full inline-block" style={{ background: CLR_A }} />{pa.name || "Partner A"}</div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full inline-block" style={{ background: CLR_B }} />{pb.name || "Partner B"}</div>
            </div>
            <NetWorthChart data={projectionData} />
          </Section>

          {/* HRA */}
          <Section 
            title="House Rent Allowance (HRA) Optimization" 
            info="HRA allows salaried individuals to save tax on rent paid. We calculate the most efficient partner to claim this based on income brackets."
            icon={<Home />}
          >
            <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-emerald-800">{result.hra.recommendation}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: pa.name || "Partner A", val: result.hra.partner_a, color: CLR_A },
                { label: pb.name || "Partner B", val: result.hra.partner_b, color: CLR_B },
              ].map((p) => (
                <div key={p.label} className="bg-background rounded-xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">{p.label}</div>
                  <div className="text-xl font-bold" style={{ color: p.color }}>₹{fmt(p.val)}/yr</div>
                  <div className="text-xs text-text-secondary mt-0.5">Exempt from tax</div>
                </div>
              ))}
            </div>
          </Section>

          {/* NPS */}
          <Section 
            title="NPS Matching & 80C Optimization" 
            info="National Pension System (NPS) offers an extra ₹50,000 deduction under 80CCD(1B) and tax-free employer matching under 80CCD(2) alongside your standard 80C limit."
            icon={<Landmark />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: pa.name || "Partner A", nps: result.nps.partner_a, color: CLR_A },
                { label: pb.name || "Partner B", nps: result.nps.partner_b, color: CLR_B },
              ].map((p) => (
                <div key={p.label} className="bg-background rounded-xl p-4 space-y-3">
                  <div className="font-bold text-sm" style={{ color: p.color }}>{p.label}</div>
                  {[
                    { k: "Employer NPS (80CCD2)", v: p.nps.employer_nps },
                    { k: "Employee NPS 80CCD(1B)", v: p.nps.employee_nps_80ccd1b },
                    { k: "80C Portion", v: p.nps.employee_nps_80c_portion },
                    { k: "Total Deduction", v: p.nps.total_nps_deduction, bold: true },
                    { k: "Tax Saved", v: p.nps.estimated_tax_saved, bold: true, green: true },
                  ].map((row) => (
                    <div key={row.k} className={`flex justify-between text-sm ${row.bold ? "border-t border-black/5 pt-2 font-bold" : ""}`}>
                      <span className="text-text-secondary">{row.k}</span>
                      <span className={row.green ? "text-emerald-600 font-bold" : "text-primary"}>₹{fmt(row.v)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Section>

          {/* SIP Splits */}
          <Section 
            title="SIP Routing — Tax-Efficient Allocation" 
            info="Systematic Investment Plans (SIPs) automatically invest part of your surplus over time. ELSS saves tax under 80C. Equity heavily builds wealth, while Debt secures it."
            icon={<PiggyBank />}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SIPPie sip={result.sip.partner_a} name={pa.name || "Partner A"} color={CLR_A} />
              <SIPPie sip={result.sip.partner_b} name={pb.name || "Partner B"} color={CLR_B} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {[
                { label: "ELSS (80C)", va: result.sip.partner_a?.elss, vb: result.sip.partner_b?.elss },
                { label: "Equity Index", va: result.sip.partner_a?.equity_index, vb: result.sip.partner_b?.equity_index },
                { label: "Debt Fund", va: result.sip.partner_a?.debt, vb: result.sip.partner_b?.debt },
                { label: "Liquid Fund", va: result.sip.partner_a?.liquid, vb: result.sip.partner_b?.liquid },
              ].map((s) => (
                <div key={s.label} className="bg-background rounded-xl p-3 text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">{s.label}</div>
                  <div className="text-xs font-bold" style={{ color: CLR_A }}>₹{fmt(s.va ?? 0)}</div>
                  <div className="text-xs font-bold" style={{ color: CLR_B }}>₹{fmt(s.vb ?? 0)}</div>
                  <div className="text-[10px] text-text-secondary mt-1">A / B /mo</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Insurance */}
          <Section 
            title="Joint Insurance — Consolidation Plan" 
            info="Term life shields your family by replacing 10x your annual income. A joint Family Floater Health policy centrally covers everyone, reducing overall yearly premiums drastically."
            icon={<Heart />}
          >
            <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-amber-800">{result.insurance.recommendation}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: `${pa.name || "A"} Term Cover`, val: fmtL(result.insurance.partner_a_term_cover), color: CLR_A },
                { label: `${pb.name || "B"} Term Cover`, val: fmtL(result.insurance.partner_b_term_cover), color: CLR_B },
                { label: "Current Premium/yr", val: `₹${fmt(result.insurance.current_fragmented_annual)}`, color: "#ef4444" },
                { label: "Optimized Premium/yr", val: `₹${fmt(result.insurance.optimized_joint_annual)}`, color: CLR_GOOD },
              ].map((c) => (
                <div key={c.label} className="bg-background rounded-xl p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-1">{c.label}</div>
                  <div className="text-xl font-bold" style={{ color: c.color }}>{c.val}</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Tax Regime */}
          <Section 
            title="Tax Regime Recommendation" 
            info="The New Income Tax Regime provides lower tax rates but no deductions. The Old Regime allows deductions (80C, HRA, NPS). We evaluate which structure lets you take home more cash."
            icon={<Sparkles />} 
            defaultOpen={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: pa.name || "Partner A", tax: result.tax.partner_a },
                { label: pb.name || "Partner B", tax: result.tax.partner_b },
              ].map((p) => (
                <div key={p.label} className="bg-background rounded-xl p-4">
                  <div className="font-bold text-primary text-sm mb-3">{p.label}</div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Old Regime Tax</span>
                    <span className="font-semibold text-primary">₹{fmt(p.tax.old_regime)}/yr</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3">
                    <span className="text-text-secondary">New Regime Tax</span>
                    <span className="font-semibold text-primary">₹{fmt(p.tax.new_regime)}/yr</span>
                  </div>
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
                    <span className="text-xs font-bold text-emerald-700">✓ Go with {p.tax.recommended}</span>
                    <span className="text-xs font-bold text-emerald-700">Save ₹{fmt(p.tax.saving)}/yr</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

        </div>
      )}

      {/* Intro visual when not yet analyzed */}
      {!result && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4 opacity-60">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#002753] to-[#7c3aed] flex items-center justify-center shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <p className="text-text-secondary font-medium max-w-xs">
            Fill in both partners' details above, then click <strong>Optimize Our Finances</strong> to see your personalized plan.
          </p>
        </div>
      )}
    </div>
  );
}

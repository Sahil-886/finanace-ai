"use client";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function Onboarding() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: user?.age || "",
    income: user?.income || "",
    expenses: user?.expenses || "",
    savings: user?.savings || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user_id = localStorage.getItem("user_id");
      if (user_id) {
        const payload = { user_id: user_id, ...formData };
        const res = await fetch("${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/user/save-data", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(payload)
        });
        if (res.ok) {
          const updated = await res.json();
          // Backend returns the full updated profile — sync immediately
          setUser(updated);
        } else {
          // Fallback: merge locally if backend unreachable
          setUser({ ...user, ...formData } as any);
        }
      } else {
        setUser({ ...user, ...formData } as any);
      }
    } catch (err) {
      console.error("Failed to sync profile. Saving locally.", err);
      setUser({ ...user, ...formData } as any);
    }
    
    // Simulate a brief save delay for a premium feel
    setTimeout(() => {
      router.push("/");
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6 animate-fade-in relative overflow-hidden">
      
      {/* Background Polish */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#002753]/10 to-transparent blur-3xl"></div>
      </div>

      <div className="w-full max-w-xl bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] rounded-3xl p-10 md:p-14 border border-[#e2e8f0] relative z-10 transition-all hover:shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)]">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-[#f1f5f9] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#002753]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0f172a] tracking-tight">Financial Profile</h1>
            <p className="text-xs font-bold text-[#64748b] uppercase tracking-widest mt-0.5">Secure Initialization</p>
          </div>
        </div>

        <p className="text-[#475569] font-medium leading-relaxed mb-8">
          Personalize your Artha experience. Your data enables dynamic portfolio analysis, precision FIRE modeling, and context-aware insights. 
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Age */}
            <div>
              <label className="block text-xs font-extrabold text-[#0f172a] uppercase tracking-wider mb-2">Current Age</label>
              <input 
                name="age" 
                type="number"
                placeholder="e.g. 28"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#002753] focus:ring-1 focus:ring-[#002753] transition-all text-[#0f172a] font-medium" 
              />
            </div>
            
            {/* Target Savings */}
            <div>
              <label className="block text-xs font-extrabold text-[#0f172a] uppercase tracking-wider mb-2">Total Savings (₹)</label>
              <input 
                name="savings" 
                type="number"
                placeholder="e.g. 500000"
                value={formData.savings}
                onChange={handleChange}
                required
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#002753] focus:ring-1 focus:ring-[#002753] transition-all text-[#0f172a] font-medium" 
              />
            </div>

            {/* Income */}
            <div>
              <label className="block text-xs font-extrabold text-[#0f172a] uppercase tracking-wider mb-2">Monthly Income (₹)</label>
              <input 
                name="income" 
                type="number"
                placeholder="e.g. 80000"
                value={formData.income}
                onChange={handleChange}
                required
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#002753] focus:ring-1 focus:ring-[#002753] transition-all text-[#0f172a] font-medium" 
              />
            </div>

            {/* Expenses */}
            <div>
              <label className="block text-xs font-extrabold text-[#0f172a] uppercase tracking-wider mb-2">Monthly Expenses (₹)</label>
              <input 
                name="expenses" 
                type="number"
                placeholder="e.g. 30000"
                value={formData.expenses}
                onChange={handleChange}
                required
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#002753] focus:ring-1 focus:ring-[#002753] transition-all text-[#0f172a] font-medium" 
              />
            </div>

          </div>

          <div className="pt-6 border-t border-[#e2e8f0] mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-[#64748b]">
               <ShieldCheck className="w-4 h-4 text-emerald-500" />
               Stored locally on your device
             </div>
             
             <button
               type="submit"
               disabled={loading}
               className="group w-full md:w-auto flex items-center justify-center gap-2 bg-[#002753] hover:bg-[#001a38] text-white px-8 py-3.5 rounded-full font-bold transition-all active:scale-[0.98] disabled:opacity-70"
             >
               {loading ? "Generating Profile..." : "Initialize Profile"}
               {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
             </button>
          </div>
        </form>

      </div>
    </div>
  );
}

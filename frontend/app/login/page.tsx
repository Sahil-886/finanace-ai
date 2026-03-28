"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function Login() {
  const { setUser } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Authentication Failed. Please try again.");
      }

      // Store globally & redirect securely
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("user_id", data.user_id);
      
      // If signing up, naturally push them to the onboarding flow!
      if (!isLogin) {
         router.push("/onboarding");
      } else {
         router.push("/");
      }

    } catch (e: any) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-6 animate-fade-in relative overflow-hidden">
      
      {/* Background Polish */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#002753]/10 to-transparent blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] rounded-3xl p-10 md:p-14 border border-[#e2e8f0] relative z-10 transition-all hover:shadow-[0_20px_60px_-15px_rgba(15,23,42,0.15)]">
        
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#002753] flex items-center justify-center shadow-md mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
             {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-[#64748b] font-medium leading-relaxed mt-2 text-sm">
             {isLogin ? "Access your intelligent financial mentor." : "Start building your automated financial roadmap today."}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-bold px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-extrabold text-[#0f172a] uppercase tracking-wider mb-2">Email Address</label>
            <input 
              name="email" 
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#002753] focus:ring-1 focus:ring-[#002753] transition-all text-[#0f172a] font-medium" 
            />
          </div>
          
          {/* Password */}
          <div>
            <label className="block text-xs font-extrabold text-[#0f172a] uppercase tracking-wider mb-2">Password</label>
            <input 
              name="password" 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3.5 outline-none focus:bg-white focus:border-[#002753] focus:ring-1 focus:ring-[#002753] transition-all text-[#0f172a] font-medium" 
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 bg-[#002753] hover:bg-[#001a38] text-white px-8 py-3.5 rounded-xl font-bold transition-all active:scale-[0.98] mt-2 disabled:opacity-70 shadow-[0_8px_20px_rgba(0,39,83,0.15)]"
          >
            {loading ? (isLogin ? "Authenticating..." : "Creating...") : (isLogin ? "Log In" : "Sign Up")}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#e2e8f0] pt-6">
           <button 
             onClick={() => setIsLogin(!isLogin)}
             className="text-sm font-bold text-[#475569] hover:text-[#0f172a] transition-colors underline decoration-[#cbd5e1] hover:decoration-[#0f172a] underline-offset-4"
           >
             {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
           </button>
        </div>

      </div>
    </div>
  );
}

"use client";
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2, User } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { user } = useUser();
  const [messages, setMessages] = useState<any[]>([
    {
      role: "bot",
      text: "Namaste! I am Artha, your AI financial advisor. How can I help you build wealth today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Listen for global summon events (e.g., from /advisor redirect)
  useEffect(() => {
    const handleOpenChat = () => setOpen(true);
    window.addEventListener("open-artha-chat", handleOpenChat);
    return () => window.removeEventListener("open-artha-chat", handleOpenChat);
  }, []);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/advisor/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
           message: input,
           financial_context: {
             income: user?.income || 0,
             expenses: user?.expenses || 0,
             savings: user?.savings || 0,
             age: user?.age || 0,
           }
        })
      });
      const data = await res.json();
      const botMsg = { role: "bot", text: data.reply || "No reply found." };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setMessages((prev) => [
        ...prev, 
        { role: "bot", text: "I'm having trouble connecting to the backend. Please ensure the server is running." }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!open && (
        <button 
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-tr from-[#002753] to-[#004b9e] text-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,39,83,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group"
          aria-label="Chat with Artha"
        >
          <MessageCircle className="w-8 h-8 group-hover:text-blue-100 transition-colors" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Overlay to close chat on mobile outside click */}
      {open && (
        <div 
          className="fixed inset-0 bg-[#0f172a]/20 z-40 sm:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Floating Chat Panel */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full sm:w-[400px] bg-white shadow-[-10px_0_50px_rgba(15,23,42,0.15)] transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Chat Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#e2e8f0] bg-[#f8fafc]">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#002753] to-[#004b9e] flex items-center justify-center shadow-inner">
                 <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                 <h3 className="font-extrabold text-[#0f172a]">Chat with Artha</h3>
                 <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-wider">AI Financial Advisor</p>
              </div>
           </div>
           <button 
             onClick={() => setOpen(false)}
             className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#e2e8f0] text-[#475569] transition-colors cursor-pointer"
           >
             <X className="w-5 h-5" />
           </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-[#f1f5f9] flex flex-col">
           <div className="flex justify-center mt-2 mb-2">
              <span className="text-xs font-bold text-[#64748b] bg-[#e2e8f0] px-3 py-1 rounded-full">Secure Session</span>
           </div>
           
           {messages.map((m, i) => (
             <div key={i} className={`flex items-start gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${m.role === "user" ? "bg-emerald-500" : "bg-[#002753]"}`}>
                   {m.role === "user" ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                </div>
                <div className={`border p-4 shadow-sm max-w-[85%] ${
                  m.role === "user" 
                    ? "bg-[#0f172a] border-[#0f172a] text-white rounded-2xl rounded-tr-none" 
                    : "bg-white border-[#e2e8f0] text-[#0f172a] rounded-2xl rounded-tl-none"
                }`}>
                   <p className="text-[14px] font-medium leading-relaxed whitespace-pre-wrap">
                     {m.text}
                   </p>
                </div>
             </div>
           ))}

           {loading && (
             <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#002753] flex-shrink-0 flex items-center justify-center">
                   <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-[#e2e8f0] p-4 rounded-2xl rounded-tl-none shadow-sm max-w-[85%] flex gap-2 items-center">
                   <Loader2 className="w-4 h-4 text-[#002753] animate-spin" />
                   <span className="text-sm font-medium text-[#64748b]">Artha is thinking...</span>
                </div>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white border-t border-[#e2e8f0]">
           {/* Quick Prompts */}
           <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar shrink-0 w-full text-xs font-bold text-[#002753]">
              <button onClick={() => setInput("Can I retire early?")} className="shrink-0 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">Can I retire early?</button>
              <button onClick={() => setInput("How to save tax?")} className="shrink-0 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">How to save tax?</button>
              <button onClick={() => setInput("Best investment for me?")} className="shrink-0 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">Best investment for me?</button>
           </div>
           
           <form 
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }} 
              className="relative flex items-center"
           >
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your FIRE number, taxes, or portfolio..." 
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-full pl-5 pr-12 py-3.5 outline-none focus:border-[#002753] focus:ring-1 focus:ring-[#002753] text-[#0f172a] font-medium text-sm transition-all shadow-sm"
                disabled={loading}
              />
              <button 
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-2 w-10 h-10 rounded-full bg-[#002753] text-white flex items-center justify-center hover:bg-[#001a38] transition-colors cursor-pointer active:scale-95 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                 <Send className="w-4 h-4 ml-0.5" />
              </button>
           </form>
           <p className="text-center text-[10px] text-[#64748b] mt-3 font-medium">Verify important financial advice. Artha is an AI Copilot.</p>
        </div>

      </div>
    </>
  );
}

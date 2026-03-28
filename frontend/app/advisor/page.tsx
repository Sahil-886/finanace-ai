"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdvisorChat() {
  const router = useRouter();

  useEffect(() => {
    // Trigger the global ChatWidget to auto-open
    window.dispatchEvent(new CustomEvent("open-artha-chat"));
    
    // Redirect back to the home page so the URL stays clean
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] animate-fade-in">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full border-4 border-[#002753] border-t-transparent animate-spin"></div>
        <p className="mt-4 text-[#64748b] font-medium text-sm tracking-wide">Summoning Artha...</p>
      </div>
    </div>
  );
}


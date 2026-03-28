"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { LogOut, LogIn, Type } from "lucide-react";

const navItems = [
  { name: "Dashboard",     path: "/dashboard",  icon: "❖" },
  { name: "Health Score",  path: "/health",     icon: "⊚" },
  { name: "FIRE Planner",  path: "/fire",       icon: "◓" },
  { name: "Tax Wizard",    path: "/tax",        icon: "◒" },
  { name: "Couple Planner",path: "/couple",     icon: "◫" },
  { name: "Portfolio X-Ray",path: "/portfolio", icon: "◪" },
];

export default function NavAndSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout, isSimpleMode, toggleSimpleMode } = useUser();

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : "??";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-text-primary">

      {/* ── Top Navbar ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-md z-50 flex items-center justify-between px-6 border-b border-black/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded text-white flex items-center justify-center font-bold text-lg">A</div>
          <span className="font-bold text-primary tracking-tight text-lg">AI Money Mentor</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-text-secondary">
          <Link href="/fire"      className="hover:text-primary transition-colors">FIRE Path</Link>
          <Link href="/tax"       className="hover:text-primary transition-colors">Tax Wizard</Link>
          <Link href="/portfolio" className="hover:text-primary transition-colors">Portfolio X-Ray</Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Greeting */}
              <span className="hidden sm:block text-sm font-medium text-text-secondary">
                Hi, <span className="text-primary font-bold">{user.name}</span>
              </span>

              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white select-none">
                {initials}
              </div>

              {/* Simple Mode Toggle */}
              <button
                onClick={toggleSimpleMode}
                title="Toggle Simple UI (Removes Financial Jargon)"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  isSimpleMode 
                    ? "bg-[#002753] text-white border-[#002753]" 
                    : "bg-surface text-text-secondary border-black/10 hover:border-black/20"
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span className="hidden sm:block">{isSimpleMode ? "Simple Mode: ON" : "Simple Mode: OFF"}</span>
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                title="Log out"
                className="w-8 h-8 rounded-full bg-section flex items-center justify-center text-text-secondary hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#002753] hover:bg-[#001a38] px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              <LogIn className="w-4 h-4" /> Log In
            </Link>
          )}
        </div>
      </header>

      {/* ── Main Layout ─────────────────────────────────────────────────── */}
      <div className="flex pt-16 flex-1 h-screen">

        {/* Left Sidebar */}
        <aside className="w-[240px] bg-background fixed bottom-0 top-16 left-0 overflow-y-auto hidden lg:block px-4 py-8 border-r border-black/5 z-40">
          <div className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-6 px-4">
            Editorial Authority
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path || pathname?.startsWith(item.path + "/");
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 group ${
                    isActive
                      ? "bg-surface text-primary shadow-sm font-semibold"
                      : "text-text-secondary hover:bg-black/5 hover:translate-x-1"
                  }`}
                >
                  <span className={`text-lg ${isActive ? "text-primary" : "text-text-secondary"}`}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar bottom: user info or login CTA */}
          <div className="absolute bottom-6 left-4 right-4">
            {user ? (
              <div className="bg-surface rounded-xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-primary truncate">{user.name}</div>
                  <div className="text-[10px] text-text-secondary truncate">{user.email || "Authenticated"}</div>
                </div>
                <button onClick={handleLogout} title="Log out" className="text-text-secondary hover:text-red-500 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full text-sm font-bold text-white bg-[#002753] hover:bg-[#001a38] px-4 py-3 rounded-xl transition-all"
              >
                <LogIn className="w-4 h-4" /> Log In
              </Link>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 lg:ml-[240px] overflow-y-auto bg-background p-8 relative">
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

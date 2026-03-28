"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API = "http://localhost:8000";

interface UserType {
  user_id: number;
  name: string;
  email?: string;
  age?: string | null;
  income?: string | null;
  expenses?: string | null;
  savings?: string | null;
}

interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  isHydrated: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
  isSimpleMode: boolean;
  toggleSimpleMode: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<UserType | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSimpleMode, setIsSimpleMode] = useState(false);

  // ── Hydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        setUserState(JSON.parse(saved));
      } catch {
        console.error("Failed to parse user from localStorage");
      }
    }
    setIsHydrated(true);
  }, []);

  // ── Persist to localStorage whenever user changes ───────────────────────
  const setUser = useCallback((next: UserType | null) => {
    setUserState(next);
    if (next) {
      localStorage.setItem("user", JSON.stringify(next));
      localStorage.setItem("user_id", String(next.user_id));
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
    }
  }, []);

  // ── Real-time sync: re-fetch profile from backend ───────────────────────
  const refreshUser = useCallback(async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;
    try {
      const res = await fetch(`${API}/user/profile?user_id=${user_id}`);
      if (res.ok) {
        const fresh = await res.json();
        setUser(fresh);
      }
    } catch {
      // Backend offline — keep local state as-is
    }
  }, [setUser]);

  // ── Auto-sync: refresh from DB 30s after hydration if user is logged in ─
  useEffect(() => {
    if (!isHydrated) return;
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;
    // Initial refresh to catch any changes made in other tabs / sessions
    refreshUser();
  }, [isHydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Logout helper ────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const toggleSimpleMode = useCallback(() => {
    setIsSimpleMode(s => !s);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isHydrated, refreshUser, logout, isSimpleMode, toggleSimpleMode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

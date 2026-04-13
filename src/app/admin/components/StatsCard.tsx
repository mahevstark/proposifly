"use client";

import { useTheme } from "@/context/ThemeContext";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  gradient: string;
  glowColor: string;
}

export default function StatsCard({ title, value, icon, gradient, glowColor }: StatsCardProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 cursor-default"
      style={{
        background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
        border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Hover glow bleed */}
      <div
        className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `rgba(${glowColor},0.12)` }}
      />
      <div className="relative flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
          style={{ boxShadow: `0 8px 24px rgba(${glowColor},0.3)` }}
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
        <div className="min-w-0">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.12em] truncate"
            style={{ color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)" }}
          >{title}</p>
          <p
            className="text-2xl font-bold mt-0.5 font-mono leading-none"
            style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}
          >{value}</p>
        </div>
      </div>
    </div>
  );
}

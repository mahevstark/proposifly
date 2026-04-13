"use client";

import { useTheme } from "@/context/ThemeContext";

interface ToneData { tone: string; count: number; }

const TONE_CONFIG: Record<string, { bar: string; dot: string; glow: string }> = {
  formal:     { bar: "linear-gradient(90deg,#3b82f6,#06b6d4)", dot: "#3b82f6", glow: "59,130,246" },
  casual:     { bar: "linear-gradient(90deg,#10b981,#34d399)", dot: "#10b981", glow: "16,185,129" },
  persuasive: { bar: "linear-gradient(90deg,#8b5cf6,#a78bfa)", dot: "#8b5cf6", glow: "139,92,246" },
};

const DEFAULT_CONFIG = { bar: "linear-gradient(90deg,#6b7280,#9ca3af)", dot: "#6b7280", glow: "107,114,128" };

export default function ToneChart({ data }: { data: ToneData[] }) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const total = data.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
        border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="mb-5">
        <h3 className="text-sm font-semibold" style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}>Tone Distribution</h3>
        <p className="text-[11px] mt-0.5" style={{ color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)" }}>All-time proposal tones</p>
      </div>

      {/* Stacked bar */}
      <div
        className="flex rounded-full overflow-hidden h-2 mb-6 gap-px"
        style={{ background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}
      >
        {data.length > 0 ? data.map((d) => {
          const cfg = TONE_CONFIG[d.tone] ?? DEFAULT_CONFIG;
          return (
            <div
              key={d.tone}
              className="h-full transition-all duration-700 rounded-full"
              style={{ width: `${(d.count / total) * 100}%`, background: cfg.bar }}
            />
          );
        }) : <div className="w-full h-full" style={{ background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }} />}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.length > 0 ? data.map((d) => {
          const cfg = TONE_CONFIG[d.tone] ?? DEFAULT_CONFIG;
          const pct = ((d.count / total) * 100).toFixed(1);
          return (
            <div key={d.tone} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cfg.dot, boxShadow: `0 0 6px rgba(${cfg.glow},0.6)` }} />
                <span
                  className="text-xs font-medium capitalize transition-colors"
                  style={{ color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.60)" }}
                >{d.tone}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold font-mono" style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}>{d.count}</span>
                <span className="text-[10px] w-10 text-right font-mono" style={{ color: isLight ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.30)" }}>{pct}%</span>
              </div>
            </div>
          );
        }) : (
          <p className="text-xs text-center py-4" style={{ color: isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)" }}>No data yet</p>
        )}
      </div>
    </div>
  );
}

"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTheme } from "@/context/ThemeContext";

interface DataPoint { date: string; proposals: number; }

export default function ProposalsChart({ data }: { data: DataPoint[] }) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en", { weekday: "short", day: "numeric" }),
  }));

  return (
    <div
      className="rounded-2xl p-5 overflow-hidden"
      style={{
        background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
        border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}>Proposals</h3>
          <p className="text-[11px] mt-0.5" style={{ color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)" }}>Last 7 days activity</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-semibold text-emerald-400">Live</span>
        </div>
      </div>
      <div className="h-[200px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formatted}>
            <defs>
              <linearGradient id="proposalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.04)"}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)", fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)", fontFamily: "monospace" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                background: isLight ? "rgba(255,255,255,0.95)" : "rgba(10,10,15,0.95)",
                border: isLight ? "1px solid rgba(0,0,0,0.10)" : "1px solid rgba(255,255,255,0.10)",
                borderRadius: "10px",
                fontSize: "12px",
                backdropFilter: "blur(16px)",
              }}
              labelStyle={{ color: isLight ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.85)", fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: "#f59e0b" }}
              cursor={{ stroke: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}
            />
            <Area type="monotone" dataKey="proposals" stroke="#f59e0b" strokeWidth={2} fill="url(#proposalGradient)" dot={{ r: 3, fill: "#f59e0b", strokeWidth: 0 }} activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface DataPoint { date: string; users: number; }

export default function UsersChart({ data }: { data: DataPoint[] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString("en", { weekday: "short", day: "numeric" }),
  }));

  return (
    <div
      className="rounded-2xl p-5 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-white">New Users</h3>
          <p className="text-[11px] text-white/35 mt-0.5">Last 7 days signups</p>
        </div>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.18)" }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-[10px] font-semibold text-blue-400">Signups</span>
        </div>
      </div>
      <div className="h-[200px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted}>
            <defs>
              <linearGradient id="userBarGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.25} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontFamily: "monospace" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.3)", fontFamily: "monospace" }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
            <Tooltip
              contentStyle={{ background: "rgba(10,10,15,0.95)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: "10px", fontSize: "12px", backdropFilter: "blur(16px)" }}
              labelStyle={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, marginBottom: 4 }}
              itemStyle={{ color: "#3b82f6" }}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar dataKey="users" fill="url(#userBarGradient)" radius={[5, 5, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

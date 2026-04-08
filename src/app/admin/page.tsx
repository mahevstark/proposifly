"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import StatsCard from "./components/StatsCard";
import ToneChart from "./components/ToneChart";

const ProposalsChart = dynamic(() => import("./components/ProposalsChart"), { ssr: false });
const UsersChart = dynamic(() => import("./components/UsersChart"), { ssr: false });

interface Stats {
  totalUsers: number;
  totalProposals: number;
  totalPRDs: number;
  todayProposals: number;
  activeProvider: string;
  proposalsByDay: { date: string; proposals: number }[];
  usersByDay: { date: string; users: number }[];
  toneBreakdown: { tone: string; count: number }[];
  maintenance?: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/maintenance").then((r) => r.json()),
    ])
      .then(([statsData, maintenanceData]) => {
        setStats(statsData);
        setMaintenance(maintenanceData.maintenance || false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
        <div className="absolute top-1/2 -right-48 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 w-[300px] h-[300px] rounded-full bg-amber-500/4 blur-[80px]" />
      </div>

      {/* Maintenance Banner */}
      {maintenance && (
        <div className="rounded-xl p-4 border border-red-500/30 bg-red-500/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M2.586 16.726A2 2 0 0 0 4.172 20h15.656a2 2 0 0 0 1.586-3.274L13.586 3.053a2 2 0 0 0-3.172 0z"/></svg>
            </div>
            <div>
              <p className="text-red-400 font-semibold text-sm">Maintenance Mode Active</p>
              <p className="text-red-400/70 text-xs">AI API rate limit reached. Users see a maintenance banner. It will auto-clear when the API works again.</p>
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/admin/maintenance", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ enabled: false }),
                });
                if (res.ok) {
                  setMaintenance(false);
                } else {
                  const data = await res.json();
                  alert("Failed to clear: " + (data.error || res.statusText));
                }
              } catch (err) {
                console.error(err);
                alert("Network error clearing maintenance");
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors flex-shrink-0"
          >
            Clear Manually
          </button>
        </div>
      )}

      {/* Maintenance Toggle (when not in maintenance) */}
      {!maintenance && (
        <div className="rounded-xl p-4 border border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div>
              <p className="text-green-400 font-semibold text-sm">System Online</p>
              <p className="text-white/40 text-xs">All services running normally. Maintenance mode will auto-activate if API rate limits are hit.</p>
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/admin/maintenance", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({ enabled: true }),
                });
                if (res.ok) {
                  setMaintenance(true);
                } else {
                  const data = await res.json();
                  alert("Failed: " + (data.error || res.statusText));
                }
              } catch (err) {
                console.error(err);
                alert("Network error toggling maintenance");
              }
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition-colors flex-shrink-0"
          >
            Enable Maintenance
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/25 mb-1">Overview</p>
        <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
        <p className="text-sm text-white/40 mt-1">Welcome back. Here&apos;s your platform at a glance.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard title="Total Users" value={stats?.totalUsers ?? 0} gradient="from-blue-500 to-blue-600" glowColor="59,130,246" icon="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        <StatsCard title="Total Proposals" value={stats?.totalProposals ?? 0} gradient="from-emerald-500 to-green-600" glowColor="16,185,129" icon="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        <StatsCard title="Total PRDs" value={stats?.totalPRDs ?? 0} gradient="from-violet-500 to-purple-600" glowColor="139,92,246" icon="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
        <StatsCard title="Today's Proposals" value={stats?.todayProposals ?? 0} gradient="from-amber-500 to-orange-500" glowColor="245,158,11" icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        <StatsCard title="AI Provider" value={stats?.activeProvider ?? "none"} gradient="from-cyan-500 to-teal-500" glowColor="6,182,212" icon="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <ProposalsChart data={stats?.proposalsByDay || []} />
        <UsersChart data={stats?.usersByDay || []} />
      </div>

      {/* Tone Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <ToneChart data={stats?.toneBreakdown || []} />
      </div>
    </div>
  );
}

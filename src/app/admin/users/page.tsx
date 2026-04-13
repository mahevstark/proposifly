"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminPagination from "../components/AdminPagination";
import { useTheme } from "@/context/ThemeContext";

interface UserRow {
  id: number;
  name: string | null;
  email: string;
  role: string;
  proposal_count: number;
}

const AVATAR_GRADIENTS = [
  "from-blue-500 to-cyan-400", "from-violet-500 to-purple-400",
  "from-rose-500 to-pink-400", "from-amber-500 to-orange-400",
  "from-emerald-500 to-teal-400", "from-sky-500 to-blue-400",
];
const avatarGradient = (id: number) => AVATAR_GRADIENTS[id % AVATAR_GRADIENTS.length];

export default function UsersPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchUsers = useCallback(async (p: number, q: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "20" });
    if (q) params.set("search", q);
    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(page, search); }, [page, search, fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const dividerColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
  const faintDivider = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}>Users</h1>
          <p className="text-sm mt-1" style={{ color: isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)" }}>{total} registered users</p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)" }}
              fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search name or email..."
              className="pl-9 pr-4 py-2.5 w-64 rounded-xl text-sm focus:outline-none transition-all"
              style={{
                background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                border: isLight ? "1px solid rgba(0,0,0,0.10)" : "1px solid rgba(255,255,255,0.10)",
                color: isLight ? "#1a1a2e" : "#ffffff",
              }}
            />
          </div>
          <button type="submit" className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:from-amber-400 hover:to-orange-400 transition-all">
            Search
          </button>
          {search && (
            <button
              type="button"
              onClick={() => { setSearchInput(""); setSearch(""); setPage(1); }}
              className="px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{
                color: isLight ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.50)",
                background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                border: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-7 h-7 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{
              background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
              border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <svg className="w-7 h-7" style={{ color: isLight ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.20)" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <p className="text-sm" style={{ color: isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)" }}>No users found</p>
        </div>
      ) : (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
            background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${dividerColor}` }}>
                  {["User", "Role", "Proposals"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: isLight ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.30)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="transition-colors group" style={{ borderBottom: `1px solid ${faintDivider}` }}>
                    <td className="px-5 py-4">
                      <Link href={`/admin/users/${u.id}`} className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient(u.id)} flex items-center justify-center text-xs font-bold text-white shadow-lg flex-shrink-0`}>
                          {(u.name || u.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-amber-400 transition-colors" style={{ color: isLight ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.90)" }}>{u.name || "—"}</p>
                          <p className="text-[11px] mt-0.5" style={{ color: isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)" }}>{u.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${
                        u.role === "admin"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : isLight
                            ? "bg-black/[0.04] text-black/40 border border-black/[0.08]"
                            : "bg-white/[0.04] text-white/40 border border-white/[0.08]"
                      }`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold" style={{ color: isLight ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.70)" }}>{u.proposal_count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

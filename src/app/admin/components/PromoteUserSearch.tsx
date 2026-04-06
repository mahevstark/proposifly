"use client";

import { useState } from "react";

interface UserRow {
  id: number;
  name: string | null;
  email: string;
  role: string;
  proposal_count: number;
}

interface Props {
  onPromoted: () => void;
  showMsg: (msg: string, type: "success" | "error") => void;
}

export default function PromoteUserSearch({ onPromoted, showMsg }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<UserRow[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) { setSearchResults([]); return; }
    setSearching(true);
    const res = await fetch(`/api/admin/users?search=${encodeURIComponent(searchInput)}&limit=10`);
    const data = await res.json();
    setSearchResults((data.users || []).filter((u: UserRow) => u.role !== "admin"));
    setSearching(false);
  };

  const handlePromote = async (userId: number) => {
    await fetch(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "admin" }),
    });
    showMsg("User promoted to admin", "success");
    setSearchResults([]); setSearchInput("");
    onPromoted();
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white">Promote Existing User</h2>
        <p className="text-[11px] text-white/40 mt-0.5">Search an existing user to grant admin access</p>
      </div>
      <div className="p-5">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or email..."
              className="bg-white/[0.05] border border-white/[0.10] text-white placeholder:text-white/25 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all w-full"
            />
          </div>
          <button type="submit" className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 transition-all">
            Search
          </button>
        </form>

        {searching && (
          <div className="flex justify-center py-6">
            <div className="w-5 h-5 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="mt-4 space-y-2">
            {searchResults.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.08] hover:bg-white/[0.05] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-xs font-bold text-white/40">
                    {(u.name || u.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{u.name || "No Name"}</p>
                    <p className="text-[11px] text-white/40">{u.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePromote(u.id)}
                  className="px-4 py-1.5 rounded-xl text-[11px] font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-500/20 transition-all"
                >
                  Make Admin
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

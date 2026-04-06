"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminPagination from "../../components/AdminPagination";

interface UserDetail { id: number; name: string | null; email: string; role: string; created_at: string; }
interface Proposal { id: number; job_title: string | null; job_description: string; proposal_text: string; tone: string; created_at: string; }
interface PRD { id: number; proposal_id: number; job_title: string | null; budget: string | null; timeline: string | null; client_name: string | null; tools_technologies: string | null; prd_text: string; created_at: string; }

const toneStyles: Record<string, string> = {
  formal: "from-blue-500 to-cyan-500",
  casual: "from-emerald-500 to-green-500",
  persuasive: "from-violet-500 to-purple-500",
};

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg className={`w-4 h-4 text-white/35 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const MetaPill = ({ label }: { label: string }) => (
  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-white/50 bg-white/[0.04] border border-white/[0.07]">{label}</span>
);

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [prds, setPrds] = useState<PRD[]>([]);
  const [tab, setTab] = useState<"proposals" | "prds">("proposals");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [prdCount, setPrdCount] = useState(0);
  const [proposalTotal, setProposalTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setExpandedId(null);
    fetch(`/api/admin/users/${id}?page=${page}&limit=10&tab=${tab}`)
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setPrdCount(data.prdCount ?? 0);
        if (tab === "proposals") {
          setProposals(data.proposals ?? []);
          setProposalTotal(data.total);
        } else {
          setPrds(data.prds ?? []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, page, tab]);
  const switchTab = (t: "proposals" | "prds") => { setTab(t); setPage(1); };

  if (loading && !user) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="inline-flex items-center gap-1.5 text-xs font-medium text-white/35 hover:text-amber-400 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Users
      </Link>

      {user && (
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/[0.04] rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-amber-500/20 flex-shrink-0">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white tracking-tight">{user.name || "No Name"}</h1>
              <p className="text-sm text-white/50 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2.5 mt-3 flex-wrap">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${user.role === "admin" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-white/[0.04] text-white/40 border border-white/[0.08]"}`}>{user.role}</span>
                <span className="text-[11px] text-white/35">Joined {new Date(user.created_at).toLocaleDateString()}</span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/[0.04] border border-white/[0.08] text-white/50">{proposalTotal} proposals</span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/[0.04] border border-white/[0.08] text-white/50">{prdCount} PRDs</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-0 border-b border-white/[0.06]">
        {(["proposals", "prds"] as const).map((t) => (
          <button key={t} onClick={() => switchTab(t)}
            className={`px-5 py-3 text-sm font-semibold transition-all duration-150 capitalize relative ${tab === t ? "text-white border-b-2 border-amber-500 -mb-px" : "text-white/40 hover:text-white/60"}`}>
            {t}
            <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-semibold ${tab === t ? "bg-amber-500/15 text-amber-400" : "bg-white/[0.05] text-white/30"}`}>
              {t === "proposals" ? proposalTotal : prdCount}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-7 h-7 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : tab === "proposals" ? (
        proposals.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-sm text-white/35">No proposals yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.03] hover:border-white/[0.10] transition-all">
                <button onClick={() => setExpandedId(expandedId === p.id ? null : p.id)} className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-medium text-white/90 truncate">{p.job_title || p.job_description.slice(0, 60) + "…"}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold text-white bg-gradient-to-r ${toneStyles[p.tone] || "from-white/20 to-white/10"}`}>{p.tone}</span>
                    </div>
                    <p className="text-[11px] text-white/35 mt-1">{new Date(p.created_at).toLocaleString()}</p>
                  </div>
                  <ChevronIcon open={expandedId === p.id} />
                </button>
                {expandedId === p.id && (
                  <div className="px-5 pb-5 border-t border-white/[0.06] space-y-4 pt-4">
                    <div>
                      <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-2">Job Description</p>
                      <p className="text-sm text-white/60 leading-relaxed">{p.job_description}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-2">Generated Proposal</p>
                      <pre className="text-sm text-white/70 whitespace-pre-wrap font-[inherit] leading-relaxed bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">{p.proposal_text}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      ) : (
        prds.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75" />
              </svg>
            </div>
            <p className="text-sm text-white/35">No PRDs yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prds.map((prd) => (
              <div key={prd.id} className="rounded-2xl border border-white/[0.06] overflow-hidden bg-white/[0.03] hover:border-white/[0.10] transition-all">
                <button onClick={() => setExpandedId(expandedId === prd.id ? null : prd.id)} className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-sm font-medium text-white/90 truncate block">{prd.job_title || "Untitled PRD"}</span>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {prd.client_name && <MetaPill label={prd.client_name} />}
                      {prd.budget && <MetaPill label={prd.budget} />}
                      {prd.timeline && <MetaPill label={prd.timeline} />}
                      {prd.tools_technologies && <MetaPill label={prd.tools_technologies.slice(0, 40) + (prd.tools_technologies.length > 40 ? "…" : "")} />}
                      <span className="text-[11px] text-white/35 ml-auto">{new Date(prd.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <ChevronIcon open={expandedId === prd.id} />
                </button>
                {expandedId === prd.id && (
                  <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
                    <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-2">PRD Document</p>
                    <pre className="text-sm text-white/70 whitespace-pre-wrap font-[inherit] leading-relaxed bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">{prd.prd_text}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

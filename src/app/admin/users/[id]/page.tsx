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
  const [deleteTarget, setDeleteTarget] = useState<{ type: "proposal" | "prd" | "all-proposals" | "all-prds"; id: number; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      let endpoint: string;
      if (deleteTarget.type === "all-proposals") {
        endpoint = `/api/admin/users/${id}/proposals`;
      } else if (deleteTarget.type === "all-prds") {
        endpoint = `/api/admin/users/${id}/prds`;
      } else if (deleteTarget.type === "proposal") {
        endpoint = `/api/admin/proposals/${deleteTarget.id}`;
      } else {
        endpoint = `/api/admin/prds/${deleteTarget.id}`;
      }
      const res = await fetch(endpoint, { method: "DELETE" });
      if (res.ok) {
        if (deleteTarget.type === "all-proposals") {
          setProposals([]);
          setProposalTotal(0);
          setPrds([]);
          setPrdCount(0);
        } else if (deleteTarget.type === "all-prds") {
          setPrds([]);
          setPrdCount(0);
        } else if (deleteTarget.type === "proposal") {
          setProposals((prev) => prev.filter((p) => p.id !== deleteTarget.id));
          setProposalTotal((prev) => prev - 1);
        } else {
          setPrds((prev) => prev.filter((p) => p.id !== deleteTarget.id));
          setPrdCount((prev) => prev - 1);
        }
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

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

      <div className="flex items-center justify-between border-b border-white/[0.06]">
        <div className="flex items-center gap-0">
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
        {((tab === "proposals" && proposalTotal > 0) || (tab === "prds" && prdCount > 0)) && (
          <button
            onClick={() => setDeleteTarget({
              type: tab === "proposals" ? "all-proposals" : "all-prds",
              id: 0,
              title: tab === "proposals" ? `All ${proposalTotal} Proposals` : `All ${prdCount} PRDs`,
            })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all mr-2"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            Delete All
          </button>
        )}
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
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: "proposal", id: p.id, title: p.job_title || p.job_description.slice(0, 40) }); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete Proposal
                      </button>
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
                  <div className="px-5 pb-5 border-t border-white/[0.06] pt-4 space-y-4">
                    <div>
                      <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider mb-2">PRD Document</p>
                      <pre className="text-sm text-white/70 whitespace-pre-wrap font-[inherit] leading-relaxed bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">{prd.prd_text}</pre>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: "prd", id: prd.id, title: prd.job_title || "Untitled PRD" }); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Delete PRD
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} />

      {deleteTarget && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => !deleting && setDeleteTarget(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm bg-[#1a1a2e] border border-white/[0.08] rounded-2xl shadow-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  {deleteTarget.type === "all-proposals" ? "Delete All Proposals" : deleteTarget.type === "all-prds" ? "Delete All PRDs" : deleteTarget.type === "proposal" ? "Delete Proposal" : "Delete PRD"}
                </h3>
                <p className="text-xs text-white/40 mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-6">
              {deleteTarget.type === "all-proposals" || deleteTarget.type === "all-prds" ? (
                <>Are you sure you want to delete <span className="text-white/80 font-medium">{deleteTarget.title}</span> for this user?</>
              ) : (
                <>Are you sure you want to delete <span className="text-white/80 font-medium">&ldquo;{deleteTarget.title}&rdquo;</span>?</>
              )}
              {(deleteTarget.type === "proposal" || deleteTarget.type === "all-proposals") && <span className="block mt-1 text-red-400/70 text-xs">Related PRDs will also be deleted.</span>}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500/80 hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

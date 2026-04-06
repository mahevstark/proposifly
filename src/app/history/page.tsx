"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Proposal } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProposalCard from "@/components/ProposalCard";
import ProposalDrawer from "@/components/ProposalDrawer";
import DeleteModal from "@/components/DeleteModal";
import Pagination from "@/components/Pagination";

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toneFilter, setToneFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/login"); return; }
    fetchProposals();
  }, [user, authLoading]);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (toneFilter !== "all") params.set("tone", toneFilter);
      params.set("sort", sortOrder);
      params.set("page", String(page));
      const res = await fetch(`/api/proposals?${params.toString()}`);
      const data = await res.json();
      setProposals(data.proposals || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch {
      setError("No internet connection. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchProposals(); }, [search, toneFilter, sortOrder, page]);


  const selectedProposal = proposals.find((p) => p.id === selectedId);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/proposals/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setProposals((prev) => prev.filter((p) => p.id !== deleteId));
      if (selectedId === deleteId) { setSelectedId(null); setDrawerOpen(false); }
    } catch {
      setError("Could not delete proposal. Please check your internet connection and try again.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  if (authLoading) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-1/4 w-[400px] h-[400px] bg-vscode-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-[300px] h-[300px] bg-vscode-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vscode-primary/10 border border-vscode-primary/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vscode-primary"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-vscode-heading">Proposal History</h1>
              <p className="text-vscode-text-muted text-sm">
                {totalCount} proposal{totalCount !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
          <Link href="/app" className="btn-primary text-sm px-5 py-2.5 rounded-xl">New Proposal</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 border border-vscode-border/50 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vscode-text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </span>
            <input type="text" placeholder="Search proposals..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-vscode-bg/80 border border-vscode-border text-vscode-heading text-sm placeholder-vscode-text-muted/50 focus:outline-none focus:border-vscode-primary focus:ring-1 focus:ring-vscode-primary/30 transition-all" />
          </div>
          <div className="relative">
            <select value={toneFilter} onChange={(e) => { setToneFilter(e.target.value); setPage(1); }}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl bg-vscode-bg/80 border border-vscode-border text-vscode-heading text-sm focus:outline-none focus:border-vscode-primary focus:ring-1 focus:ring-vscode-primary/30 transition-all cursor-pointer">
              <option value="all">All Tones</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="persuasive">Persuasive</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 text-vscode-text-muted pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
          </div>
          <div className="relative">
            <select value={sortOrder} onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl bg-vscode-bg/80 border border-vscode-border text-vscode-heading text-sm focus:outline-none focus:border-vscode-primary focus:ring-1 focus:ring-vscode-primary/30 transition-all cursor-pointer">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-3 top-1/2 -translate-y-1/2 text-vscode-text-muted pointer-events-none"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-vscode-error/10 border border-vscode-error/20 text-vscode-error text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError("")} className="ml-4 hover:text-vscode-heading transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Proposal List */}
      {loading ? (
        <div className="glass rounded-2xl border border-vscode-border/50 p-12 text-center">
          <div className="inline-flex items-center gap-3 text-vscode-text-muted">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading proposals...
          </div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="glass rounded-2xl border border-vscode-border/50 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-vscode-primary/10 border border-vscode-primary/20 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vscode-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
          </div>
          <p className="text-vscode-text-muted text-lg mb-1">No proposals yet</p>
          <p className="text-vscode-text-muted/60 text-sm mb-6">Generate your first proposal to see it here</p>
          <Link href="/app" className="btn-primary text-sm px-6 py-2.5 rounded-xl">Generate Your First Proposal</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {proposals.map((p) => (
              <ProposalCard key={p.id} proposal={p} isSelected={selectedId === p.id}
                onSelect={(id) => { setSelectedId(id); setDrawerOpen(true); }}
                onDelete={(id) => setDeleteId(id)} formatDate={formatDate} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Delete Modal */}
      {deleteId !== null && (
        <DeleteModal title="Delete Proposal" message="Are you sure you want to delete this proposal? This action cannot be undone."
          deleting={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      )}

      {/* Proposal Drawer */}
      {drawerOpen && selectedProposal && (
        <ProposalDrawer proposal={selectedProposal} onClose={() => setDrawerOpen(false)} formatDate={formatDate} />
      )}
    </div>
  );
}

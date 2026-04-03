"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Proposal } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProposalCard from "@/components/ProposalCard";
import ProposalDrawer from "@/components/ProposalDrawer";
import DeleteModal from "@/components/DeleteModal";

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
      const res = await fetch(`/api/proposals?${params.toString()}`);
      const data = await res.json();
      setProposals(data.proposals || []);
    } catch {
      setError("No internet connection. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchProposals(); }, [search, toneFilter, sortOrder]);

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Proposal History</h1>
          <p className="text-vscode-text-muted text-sm mt-1">
            {proposals.length} proposal{proposals.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        <Link href="/app" className="btn-primary text-sm px-4 py-2">New Proposal</Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text" placeholder="Search proposals..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm placeholder-vscode-text-muted focus:outline-none focus:border-vscode-primary" />
        <select value={toneFilter} onChange={(e) => setToneFilter(e.target.value)}
          className="px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm focus:outline-none focus:border-vscode-primary">
          <option value="all">All Tones</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="persuasive">Persuasive</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm focus:outline-none focus:border-vscode-primary">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-vscode-error/10 border border-vscode-error/30 text-vscode-error text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-4 hover:text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Proposal List */}
      {loading ? (
        <div className="text-center py-12 text-vscode-text-muted">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-vscode-text-muted text-lg mb-4">No proposals yet</p>
          <Link href="/app" className="btn-primary text-sm px-6 py-2">Generate Your First Proposal</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <ProposalCard key={p.id} proposal={p} isSelected={selectedId === p.id}
              onSelect={(id) => { setSelectedId(id); setDrawerOpen(true); }}
              onDelete={(id) => setDeleteId(id)} formatDate={formatDate} />
          ))}
        </div>
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

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Proposal, Tone } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }
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

  useEffect(() => {
    if (user) fetchProposals();
  }, [search, toneFilter, sortOrder]);

  const selectedProposal = proposals.find((p) => p.id === selectedId);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    setDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/proposals/${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setProposals((prev) => prev.filter((p) => p.id !== deleteId));
      if (selectedId === deleteId) {
        setSelectedId(null);
        setDrawerOpen(false);
      }
    } catch {
      setError("Could not delete proposal. Please check your internet connection and try again.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toneColors: Record<string, string> = {
    formal: "bg-blue-500/20 text-blue-400",
    casual: "bg-green-500/20 text-green-400",
    persuasive: "bg-purple-500/20 text-purple-400",
  };

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
        <Link href="/app" className="btn-primary text-sm px-4 py-2">
          New Proposal
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search proposals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm placeholder-vscode-text-muted focus:outline-none focus:border-vscode-primary"
        />
        <select
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value)}
          className="px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm focus:outline-none focus:border-vscode-primary"
        >
          <option value="all">All Tones</option>
          <option value="formal">Formal</option>
          <option value="casual">Casual</option>
          <option value="persuasive">Persuasive</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm focus:outline-none focus:border-vscode-primary"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-vscode-text-muted">Loading proposals...</div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-vscode-text-muted text-lg mb-4">No proposals yet</p>
          <Link href="/app" className="btn-primary text-sm px-6 py-2">
            Generate Your First Proposal
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedId === p.id
                  ? "border-vscode-primary bg-vscode-primary/5"
                  : "border-vscode-border bg-vscode-sidebar hover:border-vscode-primary/50"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">
                      {p.job_title || p.job_description.slice(0, 60) + "..."}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${toneColors[p.tone] || ""}`}>
                      {p.tone}
                    </span>
                  </div>
                  <p className="text-vscode-text-muted text-sm line-clamp-2">
                    {p.proposal_text.slice(0, 150)}...
                  </p>
                  <p className="text-vscode-text-muted text-xs mt-2">{formatDate(p.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/prd/${p.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs px-3 py-1.5 rounded bg-vscode-accent/20 text-vscode-accent hover:bg-vscode-accent/30 transition-colors"
                  >
                    Generate PRD
                  </Link>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
                    className="text-xs px-3 py-1.5 rounded bg-vscode-error/20 text-vscode-error hover:bg-vscode-error/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" onClick={() => !deleting && setDeleteId(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm bg-vscode-sidebar border border-vscode-border rounded-xl shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Proposal</h3>
            <p className="text-vscode-text text-sm mb-6">
              Are you sure you want to delete this proposal? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 rounded text-sm text-vscode-text bg-vscode-hover hover:bg-vscode-border transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded text-sm text-white bg-vscode-error hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Drawer / Sidebar for proposal detail */}
      {drawerOpen && selectedProposal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-vscode-sidebar border-l border-vscode-border z-50 overflow-y-auto shadow-2xl">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedProposal.job_title || "Proposal Details"}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${toneColors[selectedProposal.tone] || ""}`}>
                      {selectedProposal.tone}
                    </span>
                    <span className="text-vscode-text-muted text-xs">
                      {formatDate(selectedProposal.created_at)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="text-vscode-text-muted hover:text-white p-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-sm font-semibold text-vscode-text-muted uppercase tracking-wide mb-2">
                  Job Description
                </h3>
                <div className="bg-vscode-bg rounded-lg p-4 text-vscode-text text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedProposal.job_description}
                </div>
              </div>

              {/* Proposal */}
              <div>
                <h3 className="text-sm font-semibold text-vscode-text-muted uppercase tracking-wide mb-2">
                  Generated Proposal
                </h3>
                <div className="bg-vscode-bg rounded-lg p-4 text-vscode-text text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedProposal.proposal_text}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleCopy(selectedProposal.proposal_text)}
                  className="btn-primary text-sm px-4 py-2"
                >
                  {copied ? "Copied!" : "Copy Proposal"}
                </button>
                <Link
                  href={`/prd/${selectedProposal.id}`}
                  className="text-sm px-4 py-2 rounded bg-vscode-accent/20 text-vscode-accent hover:bg-vscode-accent/30 transition-colors inline-flex items-center"
                >
                  Generate PRD
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

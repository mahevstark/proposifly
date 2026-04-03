"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Proposal, PRDPhase } from "@/types";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import PhaseSelector from "@/components/PhaseSelector";

const DEFAULT_PHASES: PRDPhase[] = [
  { number: 1, title: "Figma Design", enabled: true },
  { number: 2, title: "Frontend Development", enabled: true },
  { number: 3, title: "Backend Development (50%)", enabled: true },
  { number: 4, title: "Remaining Functionality & Integration", enabled: true },
];

export default function PRDPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [phases, setPhases] = useState<PRDPhase[]>(DEFAULT_PHASES);
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [clientName, setClientName] = useState("");
  const [toolsTech, setToolsTech] = useState("");
  const [prdText, setPrdText] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingProposal, setFetchingProposal] = useState(true);
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
    if (!user) { router.push("/login"); return; }
    fetch(`/api/proposals/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.error) setError(data.error); else setProposal(data.proposal); })
      .catch(() => setError("Failed to load proposal"))
      .finally(() => setFetchingProposal(false));
  }, [id, user, authLoading]);

  const handleGenerate = async () => {
    setError(""); setLoading(true); setPrdText("");
    try {
      const res = await fetch("/api/prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: parseInt(id),
          budget, timeline, clientName,
          phases: phases.filter((p) => p.enabled).map((p, i) => ({ number: i + 1, title: p.title, enabled: true })),
          toolsTechnologies: toolsTech,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate PRD");
      setPrdText(data.prd_text);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingProposal) {
    return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-vscode-text-muted">Loading...</div>;
  }

  if (!proposal) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-vscode-error mb-4">{error || "Proposal not found"}</p>
        <Link href="/history" className="btn-primary text-sm px-4 py-2">Back to History</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <Link href="/history" className="text-vscode-primary text-sm hover:underline mb-2 inline-block">&larr; Back to History</Link>
        <h1 className="text-2xl font-bold text-white">PRD Generator</h1>
        <p className="text-vscode-text-muted text-sm mt-1">Generate a Project Requirements Document from your accepted proposal.</p>
      </div>

      <div className="bg-vscode-sidebar border border-vscode-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-vscode-text-muted uppercase tracking-wide mb-2">Based on Proposal</h3>
        <p className="text-vscode-text text-sm line-clamp-3">{proposal.proposal_text.slice(0, 200)}...</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-vscode-text mb-1">Client Name</label>
            <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. John Smith"
              className="w-full px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm placeholder-vscode-text-muted focus:outline-none focus:border-vscode-primary" />
          </div>
          <div>
            <label className="block text-sm text-vscode-text mb-1">Budget</label>
            <input type="text" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $5,000 - $10,000"
              className="w-full px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm placeholder-vscode-text-muted focus:outline-none focus:border-vscode-primary" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-vscode-text mb-1">Timeline</label>
            <input type="text" value={timeline} onChange={(e) => setTimeline(e.target.value)} placeholder="e.g. 4-6 weeks"
              className="w-full px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm placeholder-vscode-text-muted focus:outline-none focus:border-vscode-primary" />
          </div>
          <div>
            <label className="block text-sm text-vscode-text mb-1">Tools & Technologies</label>
            <input type="text" value={toolsTech} onChange={(e) => setToolsTech(e.target.value)} placeholder="e.g. React, Node.js, PostgreSQL"
              className="w-full px-4 py-2 rounded bg-vscode-input border border-vscode-border text-white text-sm placeholder-vscode-text-muted focus:outline-none focus:border-vscode-primary" />
          </div>
        </div>

        <PhaseSelector phases={phases} onToggle={(i) => setPhases((prev) => prev.map((p, j) => j === i ? { ...p, enabled: !p.enabled } : p))} />

        {error && (
          <div className="text-vscode-error text-sm bg-vscode-error/10 border border-vscode-error/30 rounded px-4 py-2">{error}</div>
        )}

        <button onClick={handleGenerate} disabled={loading} className="btn-primary w-full sm:w-auto px-6 py-2.5 disabled:opacity-50">
          {loading ? "Generating PRD..." : "Generate PRD"}
        </button>
      </div>

      {prdText && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Generated PRD</h3>
            <button onClick={() => handleCopy(prdText)} className="text-sm px-4 py-1.5 rounded bg-vscode-primary/20 text-vscode-primary hover:bg-vscode-primary/30 transition-colors">
              {copied ? "Copied!" : "Copy PRD"}
            </button>
          </div>
          <div className="bg-vscode-bg border border-vscode-border rounded-lg p-6 text-vscode-text text-sm leading-relaxed whitespace-pre-wrap" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
            {prdText}
          </div>
        </div>
      )}
    </div>
  );
}

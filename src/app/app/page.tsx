"use client";

import { useState, useEffect } from "react";
import { Tone, PortfolioLink, ProfileLink } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Textarea from "@/components/Textarea";
import ToneSelector from "@/components/ToneSelector";
import OutputBox from "@/components/OutputBox";
import ProposalActions from "@/components/ProposalActions";
import Button from "@/components/Button";
import Link from "next/link";

/** Main proposal generator page */
export default function AppPage() {
  const { user, loading: authLoading } = useAuth();
  const [jobDesc, setJobDesc] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioLink[]>([]);
  const [profiles, setProfiles] = useState<ProfileLink[]>([]);

  /* Load portfolio, profiles, and tone from DB if logged in */
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      Promise.all([
        fetch("/api/portfolio").then((r) => r.json()),
        fetch("/api/preferences").then((r) => r.json()),
        fetch("/api/profiles").then((r) => r.json()),
      ])
        .then(([portfolioData, prefData, profileData]) => {
          setPortfolio(portfolioData.links || []);
          setTone(prefData.tone || "formal");
          setProfiles(profileData.profiles || []);
        })
        .catch(console.error);
    }
  }, [user, authLoading]);

  const activePortfolio = portfolio.filter((p) => p.is_active !== false);
  const activeProfiles = profiles.filter((p) => p.is_active !== false);

  /** Call the generate API */
  const handleGenerate = async () => {
    if (!jobDesc.trim()) {
      setError("Please paste a job description first.");
      return;
    }

    setError("");
    setLoading(true);
    setProposal("");

    try {
      const res = await fetch("/api/generateProposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription: jobDesc,
          tone,
          portfolioLinks: activePortfolio,
          profileLinks: activeProfiles,
          userName: user?.name || "Your Name",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate proposal.");
      }

      setProposal(data.proposal);

      // Save proposal to DB if logged in
      if (user) {
        fetch("/api/proposals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobTitle: jobDesc.slice(0, 100).trim(),
            jobDescription: jobDesc,
            proposalText: data.proposal,
            tone,
          }),
        }).catch(console.error);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 relative">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-vscode-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-vscode-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-vscode-primary/10 border border-vscode-primary/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vscode-primary"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Proposal Generator</h1>
            <p className="text-vscode-text-muted text-sm">
              Paste the job description, pick a tone, and let AI do the rest
            </p>
          </div>
        </div>
      </div>

      {/* Input card */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50 space-y-5">
        <Textarea
          label="Job Description"
          placeholder="Paste the full job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={8}
        />

        <ToneSelector value={tone} onChange={setTone} />

        {/* Status indicators */}
        <div className="text-xs text-vscode-text-muted space-y-1.5 bg-vscode-bg/50 rounded-xl p-3 border border-vscode-border/30">
          {!user ? (
            <span className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vscode-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <Link href="/login" className="text-vscode-primary hover:underline">Sign in</Link>
              {" "}to attach your portfolio and profiles automatically.
            </span>
          ) : (
            <>
              <div className="flex items-center gap-1.5">
                {activePortfolio.length > 0
                  ? <><span className="text-green-400">&#10003;</span> {activePortfolio.length} portfolio link(s) will be attached</>
                  : (
                    <span className="flex items-center gap-1.5">
                      <span className="text-yellow-400">&#9888;</span> No portfolio links —{" "}
                      <Link href="/settings" className="text-vscode-primary hover:underline">add them in Settings</Link>
                    </span>
                  )}
              </div>
              {activeProfiles.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="text-green-400">&#10003;</span> {activeProfiles.length} profile(s) will be attached
                </div>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-vscode-error text-sm bg-vscode-error/10 border border-vscode-error/20 rounded-xl px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleGenerate} loading={loading} className="w-full sm:w-auto">
            Generate Proposal
          </Button>
          {(jobDesc || proposal) && (
            <Button
              variant="secondary"
              onClick={() => { setJobDesc(""); setProposal(""); setError(""); }}
              className="w-full sm:w-auto"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Output section */}
      {(proposal || loading) && (
        <div className="glass rounded-2xl p-6 border border-vscode-border/50 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <h2 className="text-white font-semibold">Generated Proposal</h2>
          </div>
          <OutputBox content={proposal} loading={loading} />
          <ProposalActions content={proposal} />
        </div>
      )}
    </div>
  );
}

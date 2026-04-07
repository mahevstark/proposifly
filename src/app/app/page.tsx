"use client";

import { useState, useEffect, useRef } from "react";
import { Tone, PortfolioLink, ProfileLink, PortfolioCategory } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Textarea from "@/components/Textarea";
import ToneSelector from "@/components/ToneSelector";
import CategoryCheckboxes from "@/components/CategoryCheckboxes";
import OutputBox from "@/components/OutputBox";
import ProposalActions from "@/components/ProposalActions";
import ProposalStatusBar from "@/components/ProposalStatusBar";
import Button from "@/components/Button";

/** Main proposal generator page */
export default function AppPage() {
  const { user, loading: authLoading } = useAuth();
  const proposalRef = useRef<HTMLDivElement>(null);
  const [maintenance, setMaintenance] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [tone, setTone] = useState<Tone>("formal");
  const [proposal, setProposal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [portfolio, setPortfolio] = useState<PortfolioLink[]>([]);
  const [profiles, setProfiles] = useState<ProfileLink[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<PortfolioCategory[]>(["web"]);

  /* Check maintenance mode */
  useEffect(() => {
    fetch("/api/maintenance").then((r) => r.json()).then((d) => setMaintenance(d.maintenance)).catch(() => {});
  }, []);

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

  const activePortfolio = portfolio.filter(
    (p) => p.is_active !== false && selectedCategories.includes((p.category || "web") as PortfolioCategory)
  );
  const activeProfiles = profiles.filter((p) => p.is_active !== false);

  const categoryCounts = portfolio
    .filter((p) => p.is_active !== false)
    .reduce((acc, l) => {
      const cat = (l.category || "web") as PortfolioCategory;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {} as Record<PortfolioCategory, number>);

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

      // Re-check maintenance status after generation
      fetch("/api/maintenance").then((r) => r.json()).then((d) => setMaintenance(d.maintenance)).catch(() => {});

      // Scroll to the generated proposal
      setTimeout(() => {
        proposalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);

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

      {/* Maintenance Banner */}
      {maintenance && (
        <div className="rounded-2xl p-4 border border-red-500/30 bg-red-500/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M2.586 16.726A2 2 0 0 0 4.172 20h15.656a2 2 0 0 0 1.586-3.274L13.586 3.053a2 2 0 0 0-3.172 0z"/></svg>
          </div>
          <div>
            <p className="text-red-600 dark:text-red-400 font-semibold text-sm">System Under Maintenance</p>
            <p className="text-red-500/80 dark:text-red-400/70 text-xs">AI service is temporarily unavailable due to API limits. Proposals will use a basic template until service is restored.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-vscode-primary/10 border border-vscode-primary/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vscode-primary"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-vscode-heading">Proposal Generator</h1>
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

        {/* Category selection */}
        {user && portfolio.length > 0 && (
          <CategoryCheckboxes
            selected={selectedCategories}
            onChange={setSelectedCategories}
            counts={categoryCounts}
          />
        )}

        {/* Status indicators */}
        <ProposalStatusBar user={user} activePortfolio={activePortfolio} activeProfiles={activeProfiles} />

        {error && (
          <div className="flex items-center gap-2 text-vscode-error text-sm bg-vscode-error/10 border border-vscode-error/20 rounded-xl px-4 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleGenerate} loading={loading} disabled={maintenance} className="w-full sm:w-auto">
            {maintenance ? "Under Maintenance" : "Generate Proposal"}
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
        <div ref={proposalRef} className="glass rounded-2xl p-6 border border-vscode-border/50 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
            </div>
            <h2 className="text-vscode-heading font-semibold">Generated Proposal</h2>
          </div>
          <OutputBox content={proposal} loading={loading} />
          <ProposalActions content={proposal} />
        </div>
      )}
    </div>
  );
}

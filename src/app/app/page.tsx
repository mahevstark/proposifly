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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate proposal.");
      }

      setProposal(data.proposal);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Proposal Generator</h1>
        <p className="text-vscode-text-muted text-sm">
          Paste the job description, pick a tone, and let AI do the rest.
        </p>
      </div>

      {/* Input section */}
      <div className="space-y-4">
        <Textarea
          label="Job Description"
          placeholder="Paste the full job description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={8}
        />

        <ToneSelector value={tone} onChange={setTone} />

        {/* Status indicators */}
        <div className="text-xs text-vscode-text-muted space-y-1">
          {!user ? (
            <span>
              <Link href="/login" className="text-vscode-primary hover:underline">Sign in</Link>
              {" "}to attach your portfolio and profiles automatically.
            </span>
          ) : (
            <>
              <div>
                {activePortfolio.length > 0
                  ? `✓ ${activePortfolio.length} portfolio link(s) will be attached`
                  : (
                    <span>
                      ⚠ No portfolio links —{" "}
                      <Link href="/settings" className="text-vscode-primary hover:underline">add them in Settings</Link>
                    </span>
                  )}
              </div>
              {activeProfiles.length > 0 && (
                <div>✓ {activeProfiles.length} profile(s) will be attached</div>
              )}
            </>
          )}
        </div>

        {error && (
          <div className="text-vscode-error text-sm bg-vscode-error/10 border border-vscode-error/30 rounded px-4 py-2">
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
      <OutputBox content={proposal} loading={loading} />
      <ProposalActions content={proposal} />
    </div>
  );
}

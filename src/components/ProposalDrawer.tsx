"use client";

import { useState } from "react";
import Link from "next/link";
import { Proposal } from "@/types";

const toneColors: Record<string, string> = {
  formal: "bg-blue-500/20 text-blue-400",
  casual: "bg-green-500/20 text-green-400",
  persuasive: "bg-purple-500/20 text-purple-400",
};

interface ProposalDrawerProps {
  proposal: Proposal;
  onClose: () => void;
  formatDate: (date: string) => string;
}

export default function ProposalDrawer({ proposal, onClose, formatDate }: ProposalDrawerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposal.proposal_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = proposal.proposal_text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-vscode-overlay/50 z-40 lg:hidden" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-vscode-sidebar border-l border-vscode-border z-50 overflow-y-auto shadow-2xl">
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-vscode-heading">
                {proposal.job_title || "Proposal Details"}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${toneColors[proposal.tone] || ""}`}>
                  {proposal.tone}
                </span>
                <span className="text-vscode-text-muted text-xs">{formatDate(proposal.created_at)}</span>
              </div>
            </div>
            <button onClick={onClose} className="text-vscode-text-muted hover:text-vscode-heading p-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-vscode-text-muted uppercase tracking-wide mb-2">Job Description</h3>
            <div className="bg-vscode-bg rounded-lg p-4 text-vscode-text text-sm leading-relaxed whitespace-pre-wrap">
              {proposal.job_description}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-vscode-text-muted uppercase tracking-wide mb-2">Generated Proposal</h3>
            <div className="bg-vscode-bg rounded-lg p-4 text-vscode-text text-sm leading-relaxed whitespace-pre-wrap">
              {proposal.proposal_text}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleCopy} className="btn-primary text-sm px-4 py-2">
              {copied ? "Copied!" : "Copy Proposal"}
            </button>
            <Link
              href={`/prd/${proposal.id}`}
              className="text-sm px-4 py-2 rounded bg-vscode-accent/20 text-vscode-accent hover:bg-vscode-accent/30 transition-colors inline-flex items-center"
            >
              Generate PRD
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

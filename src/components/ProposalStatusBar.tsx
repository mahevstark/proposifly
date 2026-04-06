"use client";

import Link from "next/link";
import { PortfolioLink, ProfileLink } from "@/types";

interface ProposalStatusBarProps {
  user: { name: string | null; email: string } | null;
  activePortfolio: PortfolioLink[];
  activeProfiles: ProfileLink[];
}

export default function ProposalStatusBar({ user, activePortfolio, activeProfiles }: ProposalStatusBarProps) {
  return (
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
  );
}

import Link from "next/link";
import { Proposal } from "@/types";

const toneColors: Record<string, string> = {
  formal: "bg-blue-500/20 text-blue-400",
  casual: "bg-green-500/20 text-green-400",
  persuasive: "bg-purple-500/20 text-purple-400",
};

interface ProposalCardProps {
  proposal: Proposal;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
}

export default function ProposalCard({ proposal, isSelected, onSelect, onDelete, formatDate }: ProposalCardProps) {
  return (
    <div
      onClick={() => onSelect(proposal.id)}
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? "border-vscode-primary bg-vscode-primary/5"
          : "border-vscode-border bg-vscode-sidebar hover:border-vscode-primary/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium truncate">
              {proposal.job_title || proposal.job_description.slice(0, 60) + "..."}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full ${toneColors[proposal.tone] || ""}`}>
              {proposal.tone}
            </span>
          </div>
          <p className="text-vscode-text-muted text-sm line-clamp-2">
            {proposal.proposal_text.slice(0, 150)}...
          </p>
          <p className="text-vscode-text-muted text-xs mt-2">{formatDate(proposal.created_at)}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/prd/${proposal.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs px-3 py-1.5 rounded bg-vscode-accent/20 text-vscode-accent hover:bg-vscode-accent/30 transition-colors"
          >
            Generate PRD
          </Link>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(proposal.id); }}
            className="text-xs px-3 py-1.5 rounded bg-vscode-error/20 text-vscode-error hover:bg-vscode-error/30 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

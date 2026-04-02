"use client";

import { PortfolioLink } from "@/types";

interface PortfolioListProps {
  links: PortfolioLink[];
  onEdit: (link: PortfolioLink) => void;
  onDelete: (id: string | number) => void;
  onToggle?: (id: string | number, is_active: boolean) => void;
}

/** Displays portfolio links with edit/delete/toggle actions */
export default function PortfolioList({ links, onEdit, onDelete, onToggle }: PortfolioListProps) {
  if (links.length === 0) {
    return (
      <div className="card text-center text-vscode-text-muted py-8">
        No portfolio links yet. Add your first one below.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {links.map((link) => (
        <div
          key={link.id}
          className={`card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-4 ${
            link.is_active === false ? "opacity-50" : ""
          }`}
        >
          {/* Toggle switch */}
          {onToggle && (
            <button
              onClick={() => onToggle(link.id, !link.is_active)}
              className={`shrink-0 w-10 h-5 rounded-full relative transition-colors ${
                link.is_active !== false
                  ? "bg-vscode-primary"
                  : "bg-vscode-border"
              }`}
              title={link.is_active !== false ? "Active — click to deactivate" : "Inactive — click to activate"}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  link.is_active !== false ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="text-white font-medium text-sm truncate">{link.title}</h3>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-vscode-primary text-xs hover:underline truncate block"
            >
              {link.url}
            </a>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onEdit(link)}
              className="text-xs px-3 py-1.5 rounded bg-vscode-hover text-vscode-text hover:text-white transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(link.id)}
              className="text-xs px-3 py-1.5 rounded bg-vscode-hover text-vscode-error hover:bg-vscode-error hover:text-white transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

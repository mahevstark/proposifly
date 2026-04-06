"use client";

import { PortfolioCategory, PORTFOLIO_CATEGORIES } from "@/types";

interface CategoryTabsProps {
  active: PortfolioCategory;
  onChange: (category: PortfolioCategory) => void;
  counts?: Record<PortfolioCategory, number>;
}

export default function CategoryTabs({ active, onChange, counts }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {PORTFOLIO_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
            active === cat.value
              ? "bg-vscode-primary/20 text-vscode-primary border border-vscode-primary/40"
              : "bg-vscode-hover/50 text-vscode-text-muted border border-vscode-border/30 hover:text-white hover:border-vscode-border/60"
          }`}
        >
          <span>{cat.icon}</span>
          <span>{cat.label}</span>
          {counts && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              active === cat.value
                ? "bg-vscode-primary/30 text-vscode-primary"
                : "bg-vscode-border/30 text-vscode-text-muted"
            }`}>
              {counts[cat.value] || 0}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

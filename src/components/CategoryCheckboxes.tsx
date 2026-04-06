"use client";

import { PortfolioCategory, PORTFOLIO_CATEGORIES } from "@/types";

interface CategoryCheckboxesProps {
  selected: PortfolioCategory[];
  onChange: (categories: PortfolioCategory[]) => void;
  counts?: Record<PortfolioCategory, number>;
}

export default function CategoryCheckboxes({ selected, onChange, counts }: CategoryCheckboxesProps) {
  const toggle = (cat: PortfolioCategory) => {
    if (selected.includes(cat)) {
      onChange(selected.filter((c) => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-vscode-text-muted uppercase tracking-wider">
        Include in Proposal
      </label>
      <div className="flex gap-2 flex-wrap">
        {PORTFOLIO_CATEGORIES.map((cat) => {
          const count = counts?.[cat.value] || 0;
          const isSelected = selected.includes(cat.value);
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => toggle(cat.value)}
              disabled={count === 0}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                count === 0
                  ? "opacity-30 cursor-not-allowed bg-vscode-hover/30 text-vscode-text-muted border border-vscode-border/20"
                  : isSelected
                  ? "bg-vscode-primary/20 text-vscode-primary border border-vscode-primary/40"
                  : "bg-vscode-hover/50 text-vscode-text-muted border border-vscode-border/30 hover:text-vscode-heading"
              }`}
            >
              <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                isSelected && count > 0
                  ? "bg-vscode-primary border-vscode-primary text-white"
                  : "border-vscode-border"
              }`}>
                {isSelected && count > 0 && "✓"}
              </span>
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {count > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-vscode-border/30">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { PRDPhase } from "@/types";

interface PhaseSelectorProps {
  phases: PRDPhase[];
  onToggle: (index: number) => void;
}

export default function PhaseSelector({ phases, onToggle }: PhaseSelectorProps) {
  // Calculate display numbers for enabled phases
  const getDisplayNumber = (index: number): number => {
    let count = 0;
    for (let j = 0; j <= index; j++) {
      if (phases[j].enabled) count++;
    }
    return count;
  };

  return (
    <div>
      <label className="block text-sm text-vscode-text mb-2">
        Execution Phases
        <span className="text-vscode-text-muted ml-2">(uncheck to remove, numbering auto-updates)</span>
      </label>
      <div className="space-y-2">
        {phases.map((phase, index) => (
          <label
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
              phase.enabled
                ? "border-vscode-primary/50 bg-vscode-primary/5"
                : "border-vscode-border bg-vscode-sidebar opacity-60"
            }`}
          >
            <input
              type="checkbox"
              checked={phase.enabled}
              onChange={() => onToggle(index)}
              className="w-4 h-4 rounded border-vscode-border text-vscode-primary focus:ring-vscode-primary bg-vscode-input"
            />
            <span className="text-vscode-heading text-sm">
              {phase.enabled && (
                <span className="text-vscode-primary font-semibold mr-2">
                  Phase {getDisplayNumber(index)}:
                </span>
              )}
              {phase.title}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

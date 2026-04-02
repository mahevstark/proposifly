"use client";

import { Tone } from "@/types";

interface ToneSelectorProps {
  value: Tone;
  onChange: (tone: Tone) => void;
}

const tones: { value: Tone; label: string; icon: string }[] = [
  { value: "formal", label: "Formal", icon: "🎩" },
  { value: "casual", label: "Casual", icon: "😎" },
  { value: "persuasive", label: "Persuasive", icon: "🎯" },
];

/** Tone/style selector with visual toggle buttons */
export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div>
      <label className="block text-sm text-vscode-text-muted mb-1.5">Tone / Style</label>
      <div className="flex gap-2">
        {tones.map((t) => (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={`flex-1 py-2.5 px-3 rounded border text-sm font-medium transition-all duration-200 ${
              value === t.value
                ? "bg-vscode-primary border-vscode-primary text-white"
                : "bg-vscode-input border-vscode-border text-vscode-text hover:border-vscode-primary"
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

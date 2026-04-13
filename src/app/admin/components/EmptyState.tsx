"use client";

import { useTheme } from "@/context/ThemeContext";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-vscode-primary/10 border border-vscode-primary/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-vscode-primary" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d={icon || "M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25"} />
        </svg>
      </div>
      <h3
        className="text-lg font-semibold mb-1"
        style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}
      >{title}</h3>
      <p
        className="text-sm text-center max-w-sm"
        style={{ color: isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)" }}
      >{description}</p>
    </div>
  );
}

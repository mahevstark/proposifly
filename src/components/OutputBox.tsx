"use client";

interface OutputBoxProps {
  content: string;
  loading?: boolean;
}

/** Displays the generated proposal with a code-editor feel */
export default function OutputBox({ content, loading }: OutputBoxProps) {
  if (loading) {
    return (
      <div className="card flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-vscode-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-vscode-text-muted text-sm">Generating proposal...</span>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="card flex items-center justify-center min-h-[200px] text-vscode-text-muted">
        Your generated proposal will appear here.
      </div>
    );
  }

  return (
    <div className="card min-h-[200px]">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-vscode-border">
        <span className="w-3 h-3 rounded-full bg-vscode-error" />
        <span className="w-3 h-3 rounded-full bg-vscode-accent" />
        <span className="w-3 h-3 rounded-full bg-vscode-success" />
        <span className="ml-2 text-xs text-vscode-text-muted">proposal.txt</span>
      </div>
      <pre className="whitespace-pre-wrap break-words overflow-wrap-anywhere text-sm leading-relaxed text-vscode-text font-sans" style={{ overflowWrap: "anywhere", wordBreak: "break-word" }}>
        {content}
      </pre>
    </div>
  );
}

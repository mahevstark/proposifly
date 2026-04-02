"use client";

import { useState } from "react";
import Button from "./Button";

interface ProposalActionsProps {
  content: string;
}

/** Copy to clipboard + download as .txt buttons */
export default function ProposalActions({ content }: ProposalActionsProps) {
  const [copied, setCopied] = useState(false);

  /** Copy proposal text to clipboard */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Failed to copy. Please select and copy manually.");
    }
  };

  /** Download proposal as .txt file */
  const handleDownloadTxt = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "proposal.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content) return null;

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleCopy} variant="secondary">
        {copied ? "✓ Copied!" : "📋 Copy"}
      </Button>
      <Button onClick={handleDownloadTxt} variant="secondary">
        📄 Download .txt
      </Button>
    </div>
  );
}

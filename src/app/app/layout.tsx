import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Proposal — Proposifly | Free AI Proposal Generator",
  description: "Paste a job description, pick your tone, and generate a winning freelance proposal with AI in seconds. Free forever.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

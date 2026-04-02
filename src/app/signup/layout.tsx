import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up Free — Proposifly | AI Proposal Generator",
  description: "Create your free Proposifly account. Save portfolio links, choose your tone, and generate winning proposals with AI.",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

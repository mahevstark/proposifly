import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — Proposifly | Free AI Proposal Generator",
  description: "Sign in to Proposifly to access your saved portfolios and generate AI-powered proposals.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Proposifly | Manage Portfolio & Preferences",
  description: "Save your portfolio links and set your default tone. Your portfolios auto-attach to every AI-generated proposal.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

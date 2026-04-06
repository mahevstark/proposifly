import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proposifly — Free AI Proposal Generator | Win More Freelance Clients",
  description:
    "Generate winning freelance proposals in seconds with AI. Paste a job description, pick your tone, auto-attach your portfolio — completely free. No credit card required.",
  keywords: [
    "AI proposal generator",
    "freelance proposal writer",
    "free proposal tool",
    "AI proposal writer",
    "Upwork proposal generator",
    "Fiverr proposal writer",
    "freelance bid writer",
    "proposal generator free",
    "AI cover letter",
    "portfolio proposal tool",
  ],
  authors: [{ name: "Proposifly" }],
  openGraph: {
    title: "Proposifly — Free AI Proposal Generator",
    description:
      "Generate winning freelance proposals in seconds. Paste a job description, pick your tone, auto-attach your portfolio — completely free.",
    type: "website",
    locale: "en_US",
    siteName: "Proposifly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Proposifly — Free AI Proposal Generator",
    description:
      "Generate winning freelance proposals in seconds with AI. Completely free, no credit card required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Root layout with Header + Footer wrapping all pages */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://proposifly.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1e1e1e" />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

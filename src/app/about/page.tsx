import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Proposifly | Free AI Proposal & PRD Generator",
  description: "Learn about Proposifly — the free AI-powered tool that helps freelancers generate winning proposals and project requirement documents in seconds.",
};

const features = [
  { icon: "🤖", label: "AI Proposal Generator", desc: "Professional proposals in under 10 seconds with 3 tone options" },
  { icon: "📜", label: "Proposal History", desc: "Auto-saved proposals with search, tone filter, and sort" },
  { icon: "📄", label: "PRD Generator", desc: "Turn proposals into project requirement documents with customizable phases, budget, timeline, and tools" },
  { icon: "🔗", label: "Portfolio & Profile Links", desc: "Save once, auto-attach to every proposal with toggle control" },
  { icon: "🔄", label: "Dynamic Signing", desc: "Proposals automatically end with your account name" },
];

const steps = [
  "Sign up for free and save your portfolio links and profiles (GitHub, LinkedIn, Behance, etc.)",
  "Toggle which portfolio links and profiles to include — they auto-attach to every proposal",
  "Paste any job description and choose your preferred tone — formal, casual, or persuasive",
  "AI generates a polished proposal with your portfolio, profiles, and name automatically attached",
  "Every proposal is saved to your history — search, filter by tone, and access anytime",
  "Generate a Project Requirements Document (PRD) from any saved proposal — with phases, budget, timeline, and tools",
  "Copy proposals and PRDs with one click — ready to send",
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-vscode-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Hero header */}
      <div className="glass rounded-2xl p-8 border border-vscode-border/50 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-vscode-primary/10 border border-vscode-primary/20 mb-4">
          <span className="text-3xl">P</span>
        </div>
        <h1 className="text-3xl font-bold text-vscode-heading mb-3">About Proposifly</h1>
        <p className="text-vscode-text leading-relaxed text-lg max-w-2xl mx-auto">
          Proposifly is a free AI-powered proposal and PRD generator built for freelancers who want to win more clients without spending hours writing proposals and project documents.
        </p>
      </div>

      {/* Mission */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-vscode-heading">Our Mission</h2>
        </div>
        <p className="text-vscode-text leading-relaxed mb-3">
          Writing proposals is one of the most time-consuming parts of freelancing. You find the perfect job, but then spend 20-30 minutes crafting a proposal — and sometimes you don&apos;t even get a response. We built Proposifly to change that.
        </p>
        <p className="text-vscode-text leading-relaxed">
          Our goal is simple: help freelancers generate professional, tailored proposals and project documents in seconds — completely free.
        </p>
      </div>

      {/* Key Features */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-vscode-heading">Key Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.label} className="flex items-start gap-3 bg-vscode-bg/40 rounded-xl p-4 border border-vscode-border/30">
              <span className="text-xl mt-0.5">{f.icon}</span>
              <div>
                <p className="text-vscode-primary font-medium text-sm">{f.label}</p>
                <p className="text-vscode-text-muted text-xs leading-relaxed mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
          </div>
          <h2 className="text-xl font-semibold text-vscode-heading">What You Can Do</h2>
        </div>
        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 py-2">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vscode-primary/10 border border-vscode-primary/20 flex items-center justify-center text-vscode-primary text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-vscode-text leading-relaxed text-sm">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Free + Built By */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6 border border-vscode-border/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
              <span className="text-yellow-400 text-sm">$0</span>
            </div>
            <h2 className="text-xl font-semibold text-vscode-heading">Why Free?</h2>
          </div>
          <p className="text-vscode-text leading-relaxed text-sm">
            We believe every freelancer deserves access to tools that help them succeed — regardless of their budget. Proposifly is free to use with no hidden charges, no trial periods, and no credit card required.
          </p>
        </div>

        <div className="glass rounded-2xl p-6 border border-vscode-border/50">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <h2 className="text-xl font-semibold text-vscode-heading">Built By Freelancers</h2>
          </div>
          <p className="text-vscode-text leading-relaxed text-sm">
            Created by Badar Madni — a full-stack developer with 10+ years of experience who understands the freelance hustle. After writing thousands of proposals manually, the idea was born: let AI handle the repetitive work.
          </p>
        </div>
      </div>

      {/* Contact + CTA */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50 text-center">
        <h2 className="text-xl font-semibold text-vscode-heading mb-2">Get In Touch</h2>
        <p className="text-vscode-text leading-relaxed mb-6">
          Have feedback, questions, or feature requests? Reach out at support@proposifly.app
        </p>
        <Link href="/app" className="btn-primary text-center text-lg px-8 py-3 inline-block rounded-xl">
          Start Generating Proposals — Free
        </Link>
      </div>
    </div>
  );
}

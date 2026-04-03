import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — Proposifly | Free AI Proposal & PRD Generator",
  description: "Learn about Proposifly — the free AI-powered tool that helps freelancers generate winning proposals and project requirement documents in seconds.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">About Proposifly</h1>
        <p className="text-vscode-text leading-relaxed text-lg">
          Proposifly is a free AI-powered proposal and PRD generator built for freelancers who want to win more clients without spending hours writing proposals and project documents.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Our Mission</h2>
        <p className="text-vscode-text leading-relaxed">
          Writing proposals is one of the most time-consuming parts of freelancing. You find the perfect job, but then spend 20-30 minutes crafting a proposal — and sometimes you don&apos;t even get a response. We built Proposifly to change that.
        </p>
        <p className="text-vscode-text leading-relaxed">
          Our goal is simple: help freelancers generate professional, tailored proposals and project documents in seconds — completely free.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">What You Can Do</h2>
        <div className="space-y-3 text-vscode-text leading-relaxed">
          <p>1. Sign up for free and save your portfolio links and profiles (GitHub, LinkedIn, Behance, etc.)</p>
          <p>2. Toggle which portfolio links and profiles to include — they auto-attach to every proposal</p>
          <p>3. Paste any job description and choose your preferred tone — formal, casual, or persuasive</p>
          <p>4. AI generates a polished proposal with your portfolio, profiles, and name automatically attached</p>
          <p>5. Every proposal is saved to your history — search, filter by tone, and access anytime</p>
          <p>6. Generate a Project Requirements Document (PRD) from any saved proposal — with phases, budget, timeline, and tools</p>
          <p>7. Copy proposals and PRDs with one click — ready to send</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Key Features</h2>
        <div className="space-y-3 text-vscode-text leading-relaxed">
          <p><span className="text-vscode-primary font-medium">AI Proposal Generator</span> — Professional proposals in under 10 seconds with 3 tone options</p>
          <p><span className="text-vscode-primary font-medium">Proposal History</span> — Auto-saved proposals with search, tone filter, and sort</p>
          <p><span className="text-vscode-primary font-medium">PRD Generator</span> — Turn proposals into project requirement documents with customizable phases, budget, timeline, and tools</p>
          <p><span className="text-vscode-primary font-medium">Portfolio & Profile Links</span> — Save once, auto-attach to every proposal with toggle control</p>
          <p><span className="text-vscode-primary font-medium">Dynamic Signing</span> — Proposals automatically end with your account name</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Why Free?</h2>
        <p className="text-vscode-text leading-relaxed">
          We believe every freelancer deserves access to tools that help them succeed — regardless of their budget. Proposifly is free to use with no hidden charges, no trial periods, and no credit card required.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Built By Freelancers, For Freelancers</h2>
        <p className="text-vscode-text leading-relaxed">
          Proposifly was created by Badar Madni — a full-stack developer with 10+ years of experience who understands the freelance hustle. After writing thousands of proposals manually, the idea was born: why not let AI handle the repetitive work so you can focus on what matters — delivering great work to your clients.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Get In Touch</h2>
        <p className="text-vscode-text leading-relaxed">
          Have feedback, questions, or feature requests? We&apos;d love to hear from you. Reach out at support@proposifly.app.
        </p>
      </section>

      <div className="pt-4">
        <Link href="/app" className="btn-primary text-center text-lg px-8 py-3 inline-block">
          Start Generating Proposals — Free
        </Link>
      </div>
    </div>
  );
}

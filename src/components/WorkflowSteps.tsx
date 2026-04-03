"use client";

import AnimateOnScroll from "@/components/AnimateOnScroll";

const steps = [
  { num: "01", title: "Sign Up Free", desc: "Create your free account in seconds — no credit card needed.", icon: "👤" },
  { num: "02", title: "Add Portfolio & Profiles", desc: "Save your portfolio links and profiles (GitHub, LinkedIn, etc.). Toggle which ones to include.", icon: "🔗" },
  { num: "03", title: "Paste & Generate", desc: "Paste any job description, pick your tone, and AI generates a polished proposal with your name and links attached.", icon: "🤖" },
  { num: "04", title: "History & Search", desc: "Every proposal is auto-saved. Search, filter by tone, and access any proposal from your history.", icon: "📜" },
  { num: "05", title: "Generate PRD", desc: "Turn any proposal into a Project Requirements Document with phases, budget, timeline, and tools.", icon: "📄" },
];

/** Five-step workflow section for landing page */
export default function WorkflowSteps() {
  return (
    <section className="py-20 px-4 section-gradient">
      <AnimateOnScroll animation="fade-up">
        <h2 className="section-heading">How It Works</h2>
        <p className="section-subheading">From signup to PRD — everything in one place</p>
      </AnimateOnScroll>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.num} animation="fade-up" delay={i * 150}>
              <div className="text-center relative group">
                <div className="relative mx-auto mb-5 w-20 h-20 rounded-2xl bg-vscode-bg-light border border-vscode-border flex flex-col items-center justify-center group-hover:border-vscode-primary/50 group-hover:shadow-lg group-hover:shadow-vscode-primary/10 group-hover:-translate-y-2 transition-all duration-300">
                  <span className="text-2xl mb-1">{step.icon}</span>
                  <span className="text-vscode-primary text-xs font-bold">{step.num}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                <p className="text-vscode-text-muted text-sm leading-relaxed px-2">{step.desc}</p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}

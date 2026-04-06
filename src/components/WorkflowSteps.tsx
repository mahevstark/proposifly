"use client";

import AnimateOnScroll from "@/components/AnimateOnScroll";

const steps = [
  {
    num: "01", title: "Sign Up Free",
    desc: "Create your free account in seconds — no credit card needed.",
    icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0",
  },
  {
    num: "02", title: "Add Portfolio & Profiles",
    desc: "Save your portfolio links and profiles. Toggle which ones to include.",
    icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.813a4.5 4.5 0 00-6.364-6.364L4.5 8.25l4.5 4.5",
  },
  {
    num: "03", title: "Paste & Generate",
    desc: "Paste any job description, pick your tone, and AI generates a polished proposal.",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846",
  },
  {
    num: "04", title: "History & Search",
    desc: "Every proposal is auto-saved. Search, filter by tone, and access anytime.",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    num: "05", title: "Generate PRD",
    desc: "Turn any proposal into a Project Requirements Document with phases, budget, timeline.",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25",
  },
];

function StepIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-vscode-primary shrink-0">
      <path d={path} />
    </svg>
  );
}

export default function WorkflowSteps() {
  return (
    <section className="py-20 px-4 section-gradient">
      <AnimateOnScroll animation="fade-up">
        <h2 className="section-heading">How It Works</h2>
        <p className="section-subheading">From signup to PRD — everything in one place</p>
      </AnimateOnScroll>

      <div className="max-w-4xl mx-auto">
        {/* Mobile: vertical left-spine timeline */}
        <div className="flex flex-col md:hidden">
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.num} animation="fade-right" delay={i * 150}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vscode-primary to-blue-400 text-white font-bold flex items-center justify-center shadow-lg shadow-vscode-primary/20 shrink-0 z-10 text-sm">
                    {step.num}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 my-1 transition-all duration-700 bg-gradient-to-b from-vscode-primary/40 to-vscode-primary/10 min-h-[2.5rem]" />
                  )}
                </div>
                <div className="pb-8 pt-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <StepIcon path={step.icon} />
                    <h3 className="text-vscode-heading font-bold text-lg">{step.title}</h3>
                  </div>
                  <p className="text-vscode-text-muted text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Desktop: alternating zigzag timeline */}
        <div className="hidden md:block relative">
          {/* Central vertical spine */}
          <div className="absolute left-1/2 top-6 bottom-6 -translate-x-1/2 w-px transition-all duration-700 bg-gradient-to-b from-vscode-primary/40 via-vscode-primary/20 to-vscode-primary/10" />

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <AnimateOnScroll key={step.num} animation={isLeft ? "fade-right" : "fade-left"} delay={i * 150}>
                  <div className={`flex items-center gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"}`}>
                    {/* Content card */}
                    <div className={`w-[calc(50%-2.5rem)] ${isLeft ? "pr-6 text-right" : "pl-6 text-left"}`}>
                      <div className={`inline-block bg-vscode-bg-light border border-vscode-border rounded-xl p-5 hover:border-vscode-primary/40 hover:shadow-lg hover:shadow-vscode-primary/10 transition-all duration-500 group`}>
                        <div className={`flex items-center gap-2 mb-2 ${isLeft ? "justify-end" : "justify-start"}`}>
                          <StepIcon path={step.icon} />
                          <h3 className="text-vscode-heading font-bold text-lg">{step.title}</h3>
                        </div>
                        <p className="text-vscode-text-muted text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>

                    {/* Center node */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-vscode-primary to-blue-400 text-white font-bold text-sm flex items-center justify-center shadow-lg shadow-vscode-primary/20 shrink-0 z-10 pulse-glow">
                      {step.num}
                    </div>

                    {/* Spacer */}
                    <div className="w-[calc(50%-2.5rem)]" />
                  </div>
                  {i < steps.length - 1 && <div className="h-6" />}
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

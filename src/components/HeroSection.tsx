import Link from "next/link";

const stats = [
  { value: "10s", label: "Generation" },
  { value: "3", label: "Tones" },
  { value: "PRD", label: "Builder" },
  { value: "Free", label: "Forever" },
];

export default function HeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden min-h-[92vh] flex items-center">

      {/* Ambient orbs — layered depth */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-64 -right-64 w-[560px] h-[560px] bg-vscode-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-48 -left-48 w-[480px] h-[480px] bg-vscode-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[260px] h-[200px] bg-vscode-success/5 rounded-full blur-3xl" />
      </div>

      {/* Floating decorative artifact */}
      <div
        className="animate-float absolute right-8 top-24 md:right-16 md:top-28 lg:right-24 pointer-events-none hidden md:block"
        aria-hidden="true"
      >
        <div className="glass w-52 h-32 rounded-2xl p-4 opacity-60">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-vscode-success animate-pulse" />
            <span className="text-vscode-text-muted text-xs font-mono">proposal.ai</span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 bg-vscode-primary/30 rounded-full w-full" />
            <div className="h-2 bg-vscode-border/40 rounded-full w-4/5" />
            <div className="h-2 bg-vscode-border/40 rounded-full w-3/5" />
          </div>
          <div className="mt-3 flex gap-1.5">
            <div className="h-5 w-12 bg-vscode-primary/40 rounded text-[9px] flex items-center justify-center text-vscode-primary font-semibold">Send</div>
            <div className="h-5 w-14 bg-vscode-border/30 rounded text-[9px] flex items-center justify-center text-vscode-text-muted">Preview</div>
          </div>
        </div>
      </div>

      <div className="relative w-full text-center py-28 md:py-36 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Badge */}
          <div className="animate-fade-in-up flex justify-center mb-10">
            <span className="glass inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-vscode-success text-sm font-semibold tracking-wide border-vscode-success/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vscode-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-vscode-success" />
              </span>
              100% Free — No Credit Card Required
            </span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up animate-delay-100 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] text-vscode-heading mb-7">
            Stop Writing Proposals
            <br />
            <span className="glow-text">Manually.</span>
            <br className="hidden sm:block" />
            <span className="text-vscode-heading"> Let AI </span>
            <span className="glow-text">Win You Clients.</span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-in-up animate-delay-200 text-lg md:text-xl text-vscode-text-muted max-w-2xl mx-auto leading-relaxed mb-11">
            Generate tailored, client-ready proposals in 10 seconds. Pick your tone,
            attach your portfolio, and close deals — no templates, no guesswork.
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up animate-delay-300 flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/app"
              className="btn-primary pulse-glow text-lg px-8 py-4 rounded-xl font-bold w-full sm:w-auto"
            >
              Start Generating — It&apos;s Free
            </Link>
            <Link
              href="/signup"
              className="btn-secondary text-lg px-8 py-4 rounded-xl font-semibold w-full sm:w-auto"
            >
              Sign Up &amp; Save Portfolio
            </Link>
          </div>

          {/* Stats Row */}
          <div className="animate-fade-in-up animate-delay-400 max-w-2xl mx-auto">
            <div className="glass grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-vscode-border/20 rounded-2xl overflow-hidden">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center py-6 px-4 hover:bg-vscode-primary/5 transition-colors duration-300"
                >
                  <span className="glow-text text-2xl md:text-3xl font-extrabold leading-none mb-1.5 tracking-tight">
                    {value}
                  </span>
                  <span className="text-vscode-text-muted text-xs uppercase tracking-widest font-medium">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

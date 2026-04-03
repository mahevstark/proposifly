import Link from "next/link";

/** Landing page hero with headline and CTA */
export default function HeroSection() {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-vscode-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-vscode-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative text-center py-20 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <span className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vscode-success/10 border border-vscode-success/20 text-vscode-success text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-vscode-success animate-pulse" />
            100% Free — No Credit Card Required
          </span>

          <h1 className="animate-fade-in-up animate-delay-100 text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            AI Proposals, PRDs &{" "}
            <span className="glow-text">History</span> — All Free
          </h1>

          <p className="animate-fade-in-up animate-delay-200 text-vscode-text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Generate professional proposals in 10 seconds, save them to history, and create Project Requirements Documents — with your portfolio, profiles, and name auto-attached.
          </p>

          <div className="animate-fade-in-up animate-delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/app" className="btn-primary text-center text-lg px-8 py-3.5 pulse-glow">
              Start Generating — It&apos;s Free
            </Link>
            <Link href="/signup" className="btn-secondary text-center text-lg px-8 py-3.5">
              Sign Up & Save Portfolio
            </Link>
          </div>

          {/* Stats bar */}
          <div className="animate-fade-in-up animate-delay-400 mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">10s</div>
              <div className="text-vscode-text-muted text-sm mt-1">Per Proposal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">3</div>
              <div className="text-vscode-text-muted text-sm mt-1">Tone Options</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">PRD</div>
              <div className="text-vscode-text-muted text-sm mt-1">Generator Built-in</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">Free</div>
              <div className="text-vscode-text-muted text-sm mt-1">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

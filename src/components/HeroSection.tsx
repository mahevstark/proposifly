import Link from "next/link";

/** Landing page hero with headline and CTA */
export default function HeroSection() {
  return (
    <section className="text-center py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium mb-6">
          100% Free — No Credit Card Required
        </span>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Win More Clients with{" "}
          <span className="text-vscode-primary">AI Proposals</span>
        </h1>
        <p className="text-vscode-text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          Paste a job description, pick your tone, and get a polished proposal
          with your portfolio auto-attached — in seconds. Completely free.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/app" className="btn-primary text-center text-lg px-8 py-3">
            Start Generating — It&apos;s Free →
          </Link>
          <Link href="/signup" className="btn-secondary text-center text-lg px-8 py-3">
            Sign Up & Save Portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}

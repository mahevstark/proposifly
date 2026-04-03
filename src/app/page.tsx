import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import WorkflowSteps from "@/components/WorkflowSteps";
import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Proposals",
    description: "Advanced AI writes tailored, professional proposals that match job requirements — in under 10 seconds.",
  },
  {
    icon: "🔗",
    title: "Auto Portfolio Attach",
    description: "Save your portfolio links once. They automatically get numbered and attached to every proposal you generate.",
  },
  {
    icon: "🎨",
    title: "3 Tone Options",
    description: "Choose formal, casual, or persuasive tone to match the client's style and project requirements.",
  },
  {
    icon: "📄",
    title: "PRD Generator",
    description: "Turn any accepted proposal into a professional Project Requirements Document with phases, budget, timeline, and tools.",
  },
  {
    icon: "📜",
    title: "Proposal History",
    description: "Every proposal you generate is automatically saved. Search, filter by tone, and access them anytime.",
  },
  {
    icon: "👤",
    title: "Profile Links",
    description: "Add your GitHub, LinkedIn, Behance, and other profiles. They get auto-attached below your portfolio in every proposal.",
  },
  {
    icon: "📋",
    title: "Copy & Download",
    description: "One-click copy to clipboard or download as .txt file — ready to paste and send to the client.",
  },
  {
    icon: "💰",
    title: "Completely Free",
    description: "No hidden charges, no credit card, no trial period. Free forever for every freelancer.",
  },
  {
    icon: "🔄",
    title: "Dynamic Signing",
    description: "Proposals automatically end with your account name — no more manual editing of 'Best regards' every time.",
  },
];

const testimonials = [
  { quote: "I used to spend 30 minutes per proposal. Now it takes 10 seconds.", name: "Freelance Developer" },
  { quote: "The PRD feature alone is worth it. Clients love the professionalism.", name: "Full-Stack Engineer" },
  { quote: "Having all my proposals saved with search and filters is a game changer.", name: "UI/UX Designer" },
];

/** Landing page */
export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Features grid */}
      <section className="py-20 px-4">
        <h2 className="section-heading">Everything You Need to Win Clients</h2>
        <p className="section-subheading">
          From AI proposal writing to PRD generation — Proposifly is the complete toolkit for freelancers
        </p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <WorkflowSteps />

      {/* Testimonials */}
      <section className="py-20 px-4">
        <h2 className="section-heading">What Freelancers Say</h2>
        <p className="section-subheading">Join freelancers who are winning more clients with less effort</p>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass p-6 text-center">
              <p className="text-vscode-text leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-vscode-primary text-sm font-medium">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-vscode-primary/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="section-heading">Ready to Win More Clients?</h2>
          <p className="text-vscode-text-muted mb-10 text-lg leading-relaxed">
            Sign up for free, save your portfolio and profile links, and start generating winning proposals with PRD support — in seconds. No credit card. No catch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn-primary text-center text-lg px-10 py-3.5">
              Get Started Free
            </Link>
            <Link href="/app" className="btn-secondary text-center text-lg px-10 py-3.5">
              Try Without Signing Up
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

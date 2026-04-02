import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import WorkflowSteps from "@/components/WorkflowSteps";
import Link from "next/link";

const features = [
  {
    icon: "🤖",
    title: "AI-Powered Writing",
    description: "GPT-4 or Claude writes tailored proposals that match the job requirements perfectly.",
  },
  {
    icon: "🔗",
    title: "Auto Portfolio Insert",
    description: "Save your portfolio links once, and they automatically appear in every proposal you generate.",
  },
  {
    icon: "🎨",
    title: "Multiple Tones",
    description: "Choose formal, casual, or persuasive tone to match the client's vibe.",
  },
  {
    icon: "📋",
    title: "Copy & Download",
    description: "One-click copy to clipboard or download as .txt file — ready to send.",
  },
  {
    icon: "💰",
    title: "Completely Free",
    description: "No hidden charges, no credit card, no trial period. Free forever.",
  },
  {
    icon: "💾",
    title: "Save & Reuse",
    description: "Sign up to save your portfolios. Select which ones to include — they auto-attach to every proposal.",
  },
];

/** Landing page — hero, features, workflow explanation */
export default function HomePage() {
  return (
    <div>
      <HeroSection />

      {/* Features grid */}
      <section className="py-16 px-4 bg-vscode-sidebar/50">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
          Why Proposifly?
        </h2>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <WorkflowSteps />

      {/* CTA section */}
      <section className="py-16 px-4 bg-vscode-sidebar/50 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Ready to Win More Clients?
        </h2>
        <p className="text-vscode-text-muted mb-8 max-w-xl mx-auto">
          Sign up for free, save your portfolio links, and start generating winning proposals in seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup" className="btn-primary text-center text-lg px-8 py-3">
            Sign Up Free
          </Link>
          <Link href="/app" className="btn-secondary text-center text-lg px-8 py-3">
            Try Without Signing Up
          </Link>
        </div>
      </section>
    </div>
  );
}

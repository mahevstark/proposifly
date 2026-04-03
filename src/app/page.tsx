import HeroSection from "@/components/HeroSection";
import WorkflowSteps from "@/components/WorkflowSteps";
import { AnimatedFeatures, AnimatedTestimonials, AnimatedCTA } from "@/components/AnimatedSections";

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
      <AnimatedFeatures features={features} />
      <WorkflowSteps />
      <AnimatedTestimonials testimonials={testimonials} />
      <AnimatedCTA />
    </div>
  );
}

"use client";

import FeatureCard from "@/components/FeatureCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import Link from "next/link";

interface Feature { icon: string; title: string; description: string; }
interface Testimonial { quote: string; name: string; role?: string; }

const Star = () => (
  <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export function AnimatedFeatures({ features }: { features: Feature[] }) {
  const [first, second, ...rest] = features;
  return (
    <section className="py-20 px-4 section-gradient">
      <AnimateOnScroll animation="fade-up">
        <h2 className="section-heading">Everything You Need to Win Clients</h2>
        <p className="section-subheading">From AI proposal writing to PRD generation — Proposifly is the complete toolkit for freelancers</p>
      </AnimateOnScroll>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimateOnScroll animation="zoom-in" delay={0} className="lg:col-span-2">
          <FeatureCard {...first} />
        </AnimateOnScroll>
        <AnimateOnScroll animation="zoom-in" delay={80}>
          <FeatureCard {...second} />
        </AnimateOnScroll>
        {rest.map((f, i) => (
          <AnimateOnScroll key={f.title} animation="zoom-in" delay={(i + 2) * 80}>
            <FeatureCard {...f} />
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}

export function AnimatedTestimonials({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <section className="py-20 px-4">
      <AnimateOnScroll animation="fade-up">
        <h2 className="section-heading">Loved by Freelancers Worldwide</h2>
        <p className="section-subheading">Join freelancers who are winning more clients with less effort</p>
      </AnimateOnScroll>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <AnimateOnScroll key={t.name} animation="zoom-in" delay={i * 150}>
            <div className="glass border-l-2 border-vscode-primary p-6 h-full flex flex-col gap-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => <Star key={j} />)}
              </div>
              <p className="italic text-vscode-text text-base leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="text-vscode-primary font-semibold text-sm">{t.name}</p>
                {t.role && <p className="text-vscode-text-muted text-xs">{t.role}</p>}
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}

export function AnimatedCTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background orb */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-vscode-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-vscode-accent/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-blue-500/5 rounded-full blur-2xl" />
      </div>
      {/* Floating decorative elements */}
      <div className="absolute top-12 left-12 w-3 h-3 rounded-full bg-vscode-primary/40 animate-float hidden lg:block" />
      <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-vscode-accent/50 animate-float hidden lg:block" style={{ animationDelay: "1s" }} />
      <div className="absolute bottom-16 left-1/4 w-2 h-2 rounded-full bg-blue-400/40 animate-float hidden lg:block" style={{ animationDelay: "2s" }} />
      <div className="absolute bottom-12 right-1/3 w-3 h-3 rounded-full bg-vscode-primary/30 animate-float hidden lg:block" style={{ animationDelay: "0.5s" }} />

      <AnimateOnScroll animation="zoom-in" className="relative max-w-2xl mx-auto text-center">
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
      </AnimateOnScroll>
    </section>
  );
}

export default function AnimatedSections({
  features,
  testimonials,
}: {
  features: Feature[];
  testimonials: Testimonial[];
}) {
  return (
    <>
      <AnimatedFeatures features={features} />
      <AnimatedTestimonials testimonials={testimonials} />
      <AnimatedCTA />
    </>
  );
}

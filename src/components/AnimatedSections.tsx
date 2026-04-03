"use client";

import FeatureCard from "@/components/FeatureCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import Link from "next/link";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  quote: string;
  name: string;
}

export function AnimatedFeatures({ features }: { features: Feature[] }) {
  return (
    <section className="py-20 px-4">
      <AnimateOnScroll animation="fade-up">
        <h2 className="section-heading">Everything You Need to Win Clients</h2>
        <p className="section-subheading">
          From AI proposal writing to PRD generation — Proposifly is the complete toolkit for freelancers
        </p>
      </AnimateOnScroll>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <AnimateOnScroll key={f.title} animation="zoom-in" delay={i * 100}>
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
        <h2 className="section-heading">What Freelancers Say</h2>
        <p className="section-subheading">Join freelancers who are winning more clients with less effort</p>
      </AnimateOnScroll>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <AnimateOnScroll key={t.name} animation="fade-up" delay={i * 150}>
            <div className="glass p-6 text-center h-full">
              <p className="text-vscode-text leading-relaxed mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-vscode-primary text-sm font-medium">— {t.name}</p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}

export function AnimatedCTA() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-vscode-primary/5 rounded-full blur-3xl" />
      </div>
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

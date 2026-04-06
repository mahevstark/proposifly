"use client";

import AnimateOnScroll from "@/components/AnimateOnScroll";

const platforms = [
  { name: "Upwork", domain: "upwork.com", color: "#14a800" },
  { name: "Fiverr", domain: "fiverr.com", color: "#1dbf73" },
  { name: "Freelancer", domain: "freelancer.com", color: "#29B2FE" },
  { name: "Toptal", domain: "toptal.com", color: "#204ECF" },
  { name: "PeoplePerHour", domain: "peopleperhour.com", color: "#F57C00" },
  { name: "Guru", domain: "guru.com", color: "#5BA71B" },
  { name: "99designs", domain: "99designs.com", color: "#FF5722" },
  { name: "Behance", domain: "behance.net", color: "#1769FF" },
  { name: "Dribbble", domain: "dribbble.com", color: "#EA4C89" },
  { name: "FlexJobs", domain: "flexjobs.com", color: "#2BAE66" },
];

function PlatformCard({ name, domain, color }: (typeof platforms)[0]) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-xl border border-vscode-border bg-vscode-bg-light hover:border-vscode-primary/40 transition-all duration-300 cursor-default select-none mx-3 group">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`}
        alt={`${name} logo`}
        width={28}
        height={28}
        className="w-7 h-7 rounded-lg object-contain group-hover:scale-110 transition-transform duration-300"
        loading="lazy"
      />
      <span className="text-sm font-bold tracking-tight whitespace-nowrap" style={{ color }}>
        {name}
      </span>
    </div>
  );
}

const row1 = [...platforms, ...platforms];
const row2 = [...platforms.slice(5), ...platforms.slice(0, 5), ...platforms.slice(5), ...platforms.slice(0, 5)];

export default function PlatformsSection() {
  return (
    <section className="py-24 px-4 section-gradient overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .marquee-track        { animation: marquee         30s linear infinite; }
        .marquee-track-rev    { animation: marquee-reverse 25s linear infinite; }
        .marquee-track:hover,
        .marquee-track-rev:hover { animation-play-state: paused; }
      `}} />

      <AnimateOnScroll animation="fade-up">
        <h2 className="section-heading">Trusted by Freelancers on Top Platforms</h2>
        <p className="section-subheading">
          Proposifly crafts winning proposals optimized for every major freelance marketplace
        </p>
      </AnimateOnScroll>

      <div className="max-w-6xl mx-auto mt-12 space-y-4">
        <div className="relative overflow-hidden" aria-hidden="true">
          <div className="flex marquee-track" style={{ width: "max-content" }}>
            {row1.map((p, i) => <PlatformCard key={`r1-${i}`} {...p} />)}
          </div>
        </div>
        <div className="relative overflow-hidden" aria-hidden="true">
          <div className="flex marquee-track-rev" style={{ width: "max-content" }}>
            {row2.map((p, i) => <PlatformCard key={`r2-${i}`} {...p} />)}
          </div>
        </div>
      </div>

      <AnimateOnScroll animation="fade-up" delay={400}>
        <p className="mt-10 text-center text-vscode-text-muted text-sm">
          Works with{" "}
          <span className="text-vscode-primary font-semibold">50+ freelance platforms</span>
          {" "}— if they accept proposals, Proposifly works there.
        </p>
      </AnimateOnScroll>
    </section>
  );
}

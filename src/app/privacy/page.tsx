import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Proposifly",
  description: "Learn how Proposifly collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    text: "When you create an account on Proposifly, we collect your name, email address, and password (stored securely as a hash). We also store portfolio links, profile URLs (GitHub, LinkedIn, etc.), and tone preferences that you voluntarily add to your account.",
  },
  {
    title: "2. How We Use Your Information",
    text: "Your information is used solely to provide the Proposifly service — generating AI-powered proposals and Project Requirements Documents (PRDs) with your saved portfolio and profile links. Your account name is used to sign proposals automatically. We do not sell, rent, or share your personal data with third parties for marketing purposes.",
  },
  {
    title: "3. AI-Generated Content",
    text: "Job descriptions you submit are sent to third-party AI providers (such as Groq, OpenAI, or Google) to generate proposals and PRDs. These providers may process the text according to their own privacy policies. We do not permanently store the job descriptions you submit, but generated proposals and PRDs are saved to your account history for your convenience.",
  },
  {
    title: "4. Data Storage",
    text: "Your generated proposals and PRDs are stored in our database and associated with your account. You can view them in your Proposal History, and delete them at any time. Deleted proposals and their associated PRDs are permanently removed.",
  },
  {
    title: "5. Cookies",
    text: "We use a single authentication cookie to keep you signed in. We may also use cookies from third-party advertising partners (such as Google AdSense) to display relevant ads. You can manage cookie preferences through your browser settings.",
  },
  {
    title: "6. Data Security",
    text: "We take reasonable measures to protect your data, including password hashing and secure HTTP-only cookies. However, no method of electronic transmission or storage is 100% secure.",
  },
  {
    title: "7. Your Rights",
    text: "You may update or delete your account and associated data at any time through the Settings page. You can delete individual proposals from the History page. If you wish to request full data deletion, please contact us.",
  },
  {
    title: "8. Third-Party Advertising",
    text: "We may display ads through Google AdSense or similar networks. These services may use cookies and similar technologies to serve ads based on your browsing activity. You can opt out of personalized advertising at www.aboutads.info.",
  },
  {
    title: "9. Changes to This Policy",
    text: "We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.",
  },
  {
    title: "10. Contact",
    text: "If you have any questions about this Privacy Policy, please contact us at support@proposifly.app.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 relative">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-vscode-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="glass rounded-2xl p-8 border border-vscode-border/50 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-vscode-primary/10 border border-vscode-primary/20 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vscode-primary"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-1">Privacy Policy</h1>
        <p className="text-vscode-text-muted text-sm">Last updated: April 2025</p>
      </div>

      {/* Sections */}
      {sections.map((s, i) => (
        <div key={i} className="glass rounded-2xl p-6 border border-vscode-border/50">
          <h2 className="text-lg font-semibold text-white mb-3">{s.title}</h2>
          <p className="text-vscode-text leading-relaxed text-sm">{s.text}</p>
        </div>
      ))}
    </div>
  );
}

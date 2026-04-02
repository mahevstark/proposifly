import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Proposifly",
  description: "Learn how Proposifly collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
      <p className="text-vscode-text-muted text-sm">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
        <p className="text-vscode-text leading-relaxed">
          When you create an account on Proposifly, we collect your name, email address, and password (stored securely as a hash). We also store portfolio links and profile URLs that you voluntarily add to your account.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
        <p className="text-vscode-text leading-relaxed">
          Your information is used solely to provide the Proposifly service — generating AI-powered proposals with your saved portfolio and profile links. We do not sell, rent, or share your personal data with third parties for marketing purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">3. AI-Generated Content</h2>
        <p className="text-vscode-text leading-relaxed">
          Job descriptions you submit are sent to third-party AI providers (such as Groq, OpenAI, or Google) to generate proposals. These providers may process the text according to their own privacy policies. We do not permanently store the job descriptions you submit.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">4. Cookies</h2>
        <p className="text-vscode-text leading-relaxed">
          We use a single authentication cookie to keep you signed in. We may also use cookies from third-party advertising partners (such as Google AdSense) to display relevant ads. You can manage cookie preferences through your browser settings.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">5. Data Security</h2>
        <p className="text-vscode-text leading-relaxed">
          We take reasonable measures to protect your data, including password hashing and secure HTTP-only cookies. However, no method of electronic transmission or storage is 100% secure.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">6. Your Rights</h2>
        <p className="text-vscode-text leading-relaxed">
          You may update or delete your account and associated data at any time through the Settings page. If you wish to request full data deletion, please contact us.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">7. Third-Party Advertising</h2>
        <p className="text-vscode-text leading-relaxed">
          We may display ads through Google AdSense or similar networks. These services may use cookies and similar technologies to serve ads based on your browsing activity. You can opt out of personalized advertising at www.aboutads.info.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">8. Changes to This Policy</h2>
        <p className="text-vscode-text leading-relaxed">
          We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">9. Contact</h2>
        <p className="text-vscode-text leading-relaxed">
          If you have any questions about this Privacy Policy, please contact us at support@proposifly.app.
        </p>
      </section>
    </div>
  );
}

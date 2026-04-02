import Link from "next/link";

/** Footer with links and copyright */
export default function Footer() {
  return (
    <footer className="bg-vscode-sidebar border-t border-vscode-border mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-vscode-text-muted">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <a href="mailto:support@proposifly.app" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-vscode-text-muted">
          <span>&copy; {new Date().getFullYear()} Proposifly — Free AI Proposal Generator</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-vscode-success inline-block" />
            Ready
          </span>
        </div>
      </div>
    </footer>
  );
}

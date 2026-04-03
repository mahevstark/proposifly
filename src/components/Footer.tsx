import Link from "next/link";

/** Footer with links and copyright */
export default function Footer() {
  return (
    <footer className="bg-vscode-sidebar/50 border-t border-white/5 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-vscode-primary to-blue-400 flex items-center justify-center text-white font-bold text-xs">
              P
            </div>
            <span className="text-white font-semibold">Proposifly</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-vscode-text-muted">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <a href="mailto:support@proposifly.app" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-white/5 text-xs text-vscode-text-muted">
          <span>&copy; {new Date().getFullYear()} Proposifly — Free AI Proposal Generator</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-vscode-success inline-block animate-pulse" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}

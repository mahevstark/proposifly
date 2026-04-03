"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/** Main navigation header */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/app", label: "Generator" },
    ...(user ? [
      { href: "/history", label: "History" },
      { href: "/settings", label: "Settings" },
    ] : []),
  ];

  return (
    <header className="bg-vscode-sidebar/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vscode-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-vscode-primary/30 transition-all duration-300">
            P
          </div>
          <span className="text-white font-semibold text-lg group-hover:text-vscode-primary transition-colors">
            Proposifly
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-vscode-text hover:bg-white/5 hover:text-white transition-all duration-200 text-sm"
            >
              {link.label}
            </Link>
          ))}

          {/* Auth buttons */}
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
                  <span className="text-vscode-text-muted text-sm">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg text-vscode-text-muted hover:bg-white/5 hover:text-white transition-all duration-200 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/10">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg text-vscode-text hover:bg-white/5 hover:text-white transition-all duration-200 text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-vscode-text hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-white/5 bg-vscode-sidebar/95 backdrop-blur-xl px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-vscode-text hover:bg-white/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {!loading && (
            <>
              {user ? (
                <>
                  <div className="px-4 py-3 text-vscode-text-muted text-sm border-t border-white/5 mt-2 pt-3">
                    {user.name || user.email}
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 text-vscode-text hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="border-t border-white/5 mt-2 pt-2 space-y-1">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-vscode-text hover:bg-white/5 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-vscode-primary hover:bg-white/5 rounded-lg transition-colors font-medium"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      )}
    </header>
  );
}

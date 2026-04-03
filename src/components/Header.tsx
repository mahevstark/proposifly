"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

/** Main navigation header - VS Code inspired top bar */
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
    <header className="bg-vscode-sidebar border-b border-vscode-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-vscode-primary text-xl font-bold">⚡</span>
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
              className="px-4 py-2 rounded text-vscode-text hover:bg-vscode-hover hover:text-white transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}

          {/* Auth buttons */}
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-vscode-text-muted text-sm">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded text-vscode-text hover:bg-vscode-hover hover:text-white transition-colors text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 ml-4">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded text-vscode-text hover:bg-vscode-hover hover:text-white transition-colors text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-vscode-text hover:text-white"
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
        <nav className="md:hidden border-t border-vscode-border bg-vscode-sidebar px-4 py-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-vscode-text hover:bg-vscode-hover rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {!loading && (
            <>
              {user ? (
                <>
                  <div className="px-4 py-3 text-vscode-text-muted text-sm border-t border-vscode-border mt-2 pt-3">
                    {user.name || user.email}
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 text-vscode-text hover:bg-vscode-hover rounded transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="border-t border-vscode-border mt-2 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-vscode-text hover:bg-vscode-hover rounded transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-vscode-primary hover:bg-vscode-hover rounded transition-colors"
                  >
                    Sign Up
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

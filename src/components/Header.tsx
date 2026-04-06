"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

/** Main navigation header */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/app", label: "Generator" },
    ...(user ? [
      { href: "/history", label: "History" },
      { href: "/settings", label: "Settings" },
    ] : []),
  ];

  return (
    <header className="bg-vscode-sidebar/80 backdrop-blur-xl border-b border-vscode-glass/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vscode-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg group-hover:shadow-vscode-primary/30 transition-all duration-300">
            P
          </div>
          <span className="text-vscode-heading font-semibold text-lg group-hover:text-vscode-primary transition-colors">
            Proposifly
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-vscode-text hover:bg-vscode-glass/5 hover:text-vscode-heading transition-all duration-200 text-sm"
            >
              {link.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-vscode-text-muted hover:bg-vscode-glass/5 hover:text-vscode-heading transition-all duration-200 ml-1"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          {/* Auth buttons */}
          {!loading && (
            <>
              {user ? (
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-vscode-glass/10">
                  <span className="text-vscode-text-muted text-sm">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={logout}
                    className="px-4 py-2 rounded-lg text-vscode-text-muted hover:bg-vscode-glass/5 hover:text-vscode-heading transition-all duration-200 text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-vscode-glass/10">
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg text-vscode-text hover:bg-vscode-glass/5 hover:text-vscode-heading transition-all duration-200 text-sm"
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

        {/* Mobile: theme toggle + hamburger */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 text-vscode-text-muted hover:text-vscode-heading rounded-lg hover:bg-vscode-glass/5 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-vscode-text hover:text-vscode-heading rounded-lg hover:bg-vscode-glass/5 transition-colors"
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
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-vscode-glass/5 bg-vscode-sidebar/95 backdrop-blur-xl px-4 py-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-vscode-text hover:bg-vscode-glass/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {!loading && (
            <>
              {user ? (
                <>
                  <div className="px-4 py-3 text-vscode-text-muted text-sm border-t border-vscode-glass/5 mt-2 pt-3">
                    {user.name || user.email}
                  </div>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-3 text-vscode-text hover:bg-vscode-glass/5 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="border-t border-vscode-glass/5 mt-2 pt-2 space-y-1">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-vscode-text hover:bg-vscode-glass/5 rounded-lg transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 text-vscode-primary hover:bg-vscode-glass/5 rounded-lg transition-colors font-medium"
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

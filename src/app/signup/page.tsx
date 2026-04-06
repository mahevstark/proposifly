"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const err = await signup(email, password, name);
    setLoading(false);

    if (err) {
      setError(err);
    } else {
      router.push("/app");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-vscode-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-vscode-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-vscode-primary/10 border border-vscode-primary/20 mb-4">
            <span className="text-3xl">P</span>
          </div>
          <h1 className="text-3xl font-bold text-vscode-heading mb-2">Create Account</h1>
          <p className="text-vscode-text-muted">
            Sign up to save your portfolio and generate proposals
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-vscode-border/50 shadow-2xl shadow-vscode-overlay/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-vscode-text text-sm font-medium mb-1.5">Name</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vscode-text-muted text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-vscode-bg/80 border border-vscode-border rounded-xl pl-9 pr-4 py-3 text-vscode-heading placeholder-vscode-text-muted/50 focus:border-vscode-primary focus:ring-1 focus:ring-vscode-primary/30 focus:outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-vscode-text text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vscode-text-muted text-sm">@</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-vscode-bg/80 border border-vscode-border rounded-xl pl-9 pr-4 py-3 text-vscode-heading placeholder-vscode-text-muted/50 focus:border-vscode-primary focus:ring-1 focus:ring-vscode-primary/30 focus:outline-none transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-vscode-text text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-vscode-text-muted text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-vscode-bg/80 border border-vscode-border rounded-xl pl-9 pr-4 py-3 text-vscode-heading placeholder-vscode-text-muted/50 focus:border-vscode-primary focus:ring-1 focus:ring-vscode-primary/30 focus:outline-none transition-all"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-vscode-error text-sm bg-vscode-error/10 border border-vscode-error/20 rounded-xl px-4 py-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                {error}
              </div>
            )}

            <Button onClick={() => {}} loading={loading} className="w-full !py-3 !rounded-xl !text-base" type="submit">
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-vscode-border/30 text-center">
            <p className="text-vscode-text-muted text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-vscode-primary hover:text-vscode-primary/80 font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-vscode-text-muted/50 text-xs mt-6">
          Free forever. No credit card required.
        </p>
      </div>
    </div>
  );
}

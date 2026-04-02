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
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-vscode-sidebar border border-vscode-border rounded-lg p-8">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">Create Account</h1>
        <p className="text-vscode-text-muted text-sm text-center mb-8">
          Sign up to save your portfolio and generate proposals.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-vscode-text text-sm mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-vscode-bg border border-vscode-border rounded px-4 py-2.5 text-white placeholder-vscode-text-muted focus:border-vscode-primary focus:outline-none transition-colors"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-vscode-text text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-vscode-bg border border-vscode-border rounded px-4 py-2.5 text-white placeholder-vscode-text-muted focus:border-vscode-primary focus:outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-vscode-text text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-vscode-bg border border-vscode-border rounded px-4 py-2.5 text-white placeholder-vscode-text-muted focus:border-vscode-primary focus:outline-none transition-colors"
              placeholder="Min 6 characters"
            />
          </div>

          {error && (
            <div className="text-vscode-error text-sm bg-vscode-error/10 border border-vscode-error/30 rounded px-4 py-2">
              {error}
            </div>
          )}

          <Button onClick={() => {}} loading={loading} className="w-full" type="submit">
            Create Account
          </Button>
        </form>

        <p className="text-vscode-text-muted text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-vscode-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

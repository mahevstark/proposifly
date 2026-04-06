"use client";

import { useState } from "react";

interface Props {
  onCreated: () => void;
  onClose: () => void;
  showMsg: (msg: string, type: "success" | "error") => void;
}

export default function CreateAdminForm({ onCreated, onClose, showMsg }: Props) {
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    const res = await fetch("/api/admin/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, email: newEmail, password: newPassword }),
    });
    const data = await res.json();
    setCreating(false);

    if (!res.ok) {
      showMsg(data.error || "Failed to create admin", "error");
      return;
    }

    setCreatedCreds({ email: newEmail, password: newPassword });
    setNewName(""); setNewEmail(""); setNewPassword("");
    showMsg("Sub-admin created successfully!", "success");
    onCreated();
  };

  const handleCopy = () => {
    if (!createdCreds) return;
    const text = `Admin Login Credentials\nEmail: ${createdCreds.email}\nPassword: ${createdCreds.password}\nLogin URL: ${window.location.origin}/admin/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls = "bg-white/[0.05] border border-white/[0.10] text-white placeholder:text-white/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all w-full";
  const labelCls = "block text-[11px] font-semibold text-white/35 uppercase tracking-wider mb-1.5";

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white">Create New Sub-Admin</h2>
        <p className="text-[11px] text-white/40 mt-0.5">Create credentials and share with the new admin</p>
      </div>
      <div className="p-5">
        {createdCreds ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-emerald-400">Sub-Admin Created!</span>
              </div>
              <div className="space-y-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-white/40">Email:</span>
                  <span className="text-white font-semibold">{createdCreds.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40">Password:</span>
                  <span className="text-white font-semibold">{createdCreds.password}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40">Login URL:</span>
                  <span className="text-amber-400 font-semibold">{typeof window !== "undefined" ? window.location.origin : ""}/admin/login</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                {copied ? "Copied!" : "Copy Credentials"}
              </button>
              <button
                onClick={() => { setCreatedCreds(null); onClose(); }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white/60 border border-white/[0.08] hover:bg-white/[0.05] hover:text-white transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Name</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className={inputCls} placeholder="Full name" required />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className={inputCls} placeholder="email@example.com" required />
              </div>
            </div>
            <div>
              <label className={labelCls}>Password</label>
              <input type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputCls} placeholder="Min 6 characters" required minLength={6} />
            </div>
            <button type="submit" disabled={creating} className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 disabled:opacity-40 transition-all flex items-center gap-2">
              {creating && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              {creating ? "Creating..." : "Create Sub-Admin"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

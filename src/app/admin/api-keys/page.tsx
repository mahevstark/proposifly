"use client";

import { useEffect, useState } from "react";
import ProviderCard from "../components/ProviderCard";

interface ApiKeyRow {
  id: number;
  provider: string;
  api_key_masked: string;
  is_active: boolean;
  updated_at: string;
}

const PROVIDERS = [
  { value: "openai", label: "OpenAI", sub: "GPT-4", gradient: "from-emerald-500 to-green-600", shadow: "shadow-emerald-500/20", dot: "bg-emerald-400" },
  { value: "groq", label: "Groq", sub: "Llama 3.3", gradient: "from-orange-500 to-amber-600", shadow: "shadow-orange-500/20", dot: "bg-orange-400" },
  { value: "gemini", label: "Gemini", sub: "Google AI", gradient: "from-blue-500 to-cyan-600", shadow: "shadow-blue-500/20", dot: "bg-blue-400" },
  { value: "claude", label: "Claude", sub: "Anthropic", gradient: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/20", dot: "bg-violet-400" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState<string | null>(null);
  const [formKey, setFormKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchKeys = async () => {
    const res = await fetch("/api/admin/api-keys");
    const data = await res.json();
    setKeys(data.keys || []);
    setLoading(false);
  };

  useEffect(() => { fetchKeys(); }, []);

  const getKey = (provider: string) => keys.find((k) => k.provider === provider);
  const getP = (val: string) => PROVIDERS.find((p) => p.value === val)!;
  const activeKey = keys.find((k) => k.is_active);

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(""), 3000); };

  const handleSave = async (provider: string) => {
    if (!formKey.trim()) return;
    setSaving(true);
    await fetch("/api/admin/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, apiKey: formKey, setActive: false }),
    });
    setFormKey(""); setEditingProvider(null); setSaving(false);
    showMsg(`${getP(provider).label} key saved`);
    fetchKeys();
  };

  const handleActivate = async (id: number, provider: string) => {
    await fetch(`/api/admin/api-keys/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setActive: true }),
    });
    showMsg(`${getP(provider).label} is now active`);
    fetchKeys();
  };

  const handleDelete = async (id: number, provider: string) => {
    if (!confirm(`Delete ${getP(provider).label} key?`)) return;
    await fetch(`/api/admin/api-keys/${id}`, { method: "DELETE" });
    showMsg(`${getP(provider).label} key deleted`);
    fetchKeys();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">API Keys</h1>
        <p className="text-sm text-white/40 mt-1">Configure AI providers. The active one powers proposal generation.</p>
      </div>

      {message && (
        <div className="rounded-xl px-4 py-3 border border-emerald-500/20 bg-emerald-500/10 text-sm text-emerald-400">
          {message}
        </div>
      )}

      {/* Active Provider Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white/35 uppercase tracking-wider">Currently Active</p>
            <p className="text-xl font-bold text-white">
              {activeKey ? getP(activeKey.provider).label : "No provider selected"}
            </p>
            {activeKey && (
              <p className="text-[11px] text-white/40 mt-0.5">Key: <span className="font-mono">{activeKey.api_key_masked}</span></p>
            )}
          </div>
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROVIDERS.map((p) => {
          const existing = getKey(p.value);
          return (
            <ProviderCard
              key={p.value}
              provider={p}
              existing={existing}
              isEditing={editingProvider === p.value}
              formKey={formKey}
              saving={saving}
              onSetFormKey={setFormKey}
              onStartEdit={() => { setEditingProvider(p.value); setFormKey(""); }}
              onCancelEdit={() => { setEditingProvider(null); setFormKey(""); }}
              onSave={() => handleSave(p.value)}
              onActivate={() => existing && handleActivate(existing.id, p.value)}
              onDelete={() => existing && handleDelete(existing.id, p.value)}
            />
          );
        })}
      </div>
    </div>
  );
}

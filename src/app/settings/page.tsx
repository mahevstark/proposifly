"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ProfileLink, Tone } from "@/types";
import PortfolioList from "@/components/PortfolioList";
import PortfolioForm from "@/components/PortfolioForm";
import ProfileList from "@/components/ProfileList";
import ProfileForm from "@/components/ProfileForm";
import ToneSelector from "@/components/ToneSelector";
import CategoryTabs from "@/components/CategoryTabs";
import usePortfolio from "@/hooks/usePortfolio";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const portfolio = usePortfolio(user);
  const [profiles, setProfiles] = useState<ProfileLink[]>([]);
  const [tone, setTone] = useState<Tone>("formal");
  const [profilesLoading, setProfilesLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      fetch("/api/preferences").then((r) => r.json()),
      fetch("/api/profiles").then((r) => r.json()),
    ])
      .then(([prefData, profileData]) => {
        setTone(prefData.tone || "formal");
        setProfiles(profileData.profiles || []);
      })
      .catch(console.error)
      .finally(() => setProfilesLoading(false));
  }, [user]);

  const handleAddProfile = async (platform: string, url: string) => {
    const res = await fetch("/api/profiles", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, url }),
    });
    const data = await res.json();
    if (res.ok) setProfiles([data.profile, ...profiles]);
  };

  const handleDeleteProfile = async (id: string | number) => {
    const res = await fetch("/api/profiles", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setProfiles(profiles.filter((p) => p.id !== id));
  };

  const handleToggleProfile = async (id: string | number, is_active: boolean) => {
    const res = await fetch("/api/profiles", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active }),
    });
    if (res.ok) setProfiles(profiles.map((p) => (p.id === id ? { ...p, is_active } : p)));
  };

  const handleToneChange = async (t: Tone) => {
    setTone(t);
    await fetch("/api/preferences", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tone: t }),
    });
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="inline-flex items-center gap-3 text-vscode-text-muted">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Loading...
        </div>
      </div>
    );
  }

  const isLoading = portfolio.loading || profilesLoading;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 right-1/3 w-[400px] h-[400px] bg-vscode-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-vscode-primary/3 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vscode-primary/10 border border-vscode-primary/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-vscode-primary"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-vscode-text-muted text-sm">Manage your portfolio links, profiles, and default tone</p>
          </div>
        </div>
      </div>

      {/* Default tone */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 6V2H8"/><path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Default Tone</h2>
        </div>
        <ToneSelector value={tone} onChange={handleToneChange} />
      </div>

      {/* Portfolio management with category tabs */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Portfolio Links</h2>
        </div>
        <p className="text-vscode-text-muted text-xs mb-4 ml-10">
          Organize your projects by category. Toggle on/off to control which ones appear in proposals.
        </p>
        {isLoading ? (
          <div className="flex items-center gap-2 text-vscode-text-muted text-sm py-4">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            <CategoryTabs active={portfolio.activeCategory} onChange={portfolio.setActiveCategory} counts={portfolio.counts} />
            <PortfolioList links={portfolio.filteredLinks} onEdit={portfolio.setEditing} onDelete={portfolio.handleDelete} onToggle={portfolio.handleToggle} />
            <PortfolioForm editingLink={portfolio.editing} onSave={portfolio.handleSave} onCancel={() => portfolio.setEditing(null)} activeCategory={portfolio.activeCategory} />
          </div>
        )}
      </div>

      {/* Profiles management */}
      <div className="glass rounded-2xl p-6 border border-vscode-border/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Profiles (Optional)</h2>
        </div>
        <p className="text-vscode-text-muted text-xs mb-4 ml-10">
          Add your GitHub, LinkedIn, or other profiles. Enable them to auto-attach in proposals.
        </p>
        {isLoading ? (
          <div className="flex items-center gap-2 text-vscode-text-muted text-sm py-4">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Loading...
          </div>
        ) : (
          <div className="space-y-4">
            <ProfileList profiles={profiles} onDelete={handleDeleteProfile} onToggle={handleToggleProfile} />
            <ProfileForm onSave={handleAddProfile} />
          </div>
        )}
      </div>
    </div>
  );
}

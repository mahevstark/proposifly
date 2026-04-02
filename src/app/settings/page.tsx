"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { PortfolioLink, ProfileLink, Tone } from "@/types";
import PortfolioList from "@/components/PortfolioList";
import PortfolioForm from "@/components/PortfolioForm";
import ProfileList from "@/components/ProfileList";
import ProfileForm from "@/components/ProfileForm";
import ToneSelector from "@/components/ToneSelector";

/** Settings page — manage portfolio links, profiles, and default tone (requires login) */
export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<PortfolioLink[]>([]);
  const [profiles, setProfiles] = useState<ProfileLink[]>([]);
  const [editing, setEditing] = useState<PortfolioLink | null>(null);
  const [tone, setTone] = useState<Tone>("formal");
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  // Load data from DB
  useEffect(() => {
    if (!user) return;

    Promise.all([
      fetch("/api/portfolio").then((r) => r.json()),
      fetch("/api/preferences").then((r) => r.json()),
      fetch("/api/profiles").then((r) => r.json()),
    ])
      .then(([portfolioData, prefData, profileData]) => {
        setLinks(portfolioData.links || []);
        setTone(prefData.tone || "formal");
        setProfiles(profileData.profiles || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  /** Save or update a portfolio link */
  const handleSave = async (link: PortfolioLink) => {
    if (editing) {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: link.id, title: link.title, url: link.url }),
      });
      const data = await res.json();
      if (res.ok) {
        setLinks(links.map((l) => (l.id === link.id ? data.link : l)));
      }
    } else {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: link.title, url: link.url }),
      });
      const data = await res.json();
      if (res.ok) {
        setLinks([data.link, ...links]);
      }
    }
    setEditing(null);
  };

  /** Delete a portfolio link */
  const handleDelete = async (id: string | number) => {
    const res = await fetch("/api/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setLinks(links.filter((l) => l.id !== id));
    }
  };

  /** Toggle portfolio link active/inactive */
  const handleToggle = async (id: string | number, is_active: boolean) => {
    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active }),
    });
    if (res.ok) {
      setLinks(links.map((l) => (l.id === id ? { ...l, is_active } : l)));
    }
  };

  /** Add a profile */
  const handleAddProfile = async (platform: string, url: string) => {
    const res = await fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform, url }),
    });
    const data = await res.json();
    if (res.ok) {
      setProfiles([data.profile, ...profiles]);
    }
  };

  /** Delete a profile */
  const handleDeleteProfile = async (id: string | number) => {
    const res = await fetch("/api/profiles", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setProfiles(profiles.filter((p) => p.id !== id));
    }
  };

  /** Toggle profile active/inactive */
  const handleToggleProfile = async (id: string | number, is_active: boolean) => {
    const res = await fetch("/api/profiles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active }),
    });
    if (res.ok) {
      setProfiles(profiles.map((p) => (p.id === id ? { ...p, is_active } : p)));
    }
  };

  /** Update default tone */
  const handleToneChange = async (t: Tone) => {
    setTone(t);
    await fetch("/api/preferences", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tone: t }),
    });
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-vscode-text-muted">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-vscode-text-muted text-sm">
          Manage your portfolio links, profiles, and default tone preference.
        </p>
      </div>

      {/* Default tone */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-white">Default Tone</h2>
        <ToneSelector value={tone} onChange={handleToneChange} />
      </section>

      {/* Portfolio management */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Portfolio Links</h2>
          <p className="text-vscode-text-muted text-xs mt-1">
            Add your project links. Toggle on/off to control which ones appear in proposals.
          </p>
        </div>
        {loading ? (
          <div className="text-vscode-text-muted text-sm">Loading...</div>
        ) : (
          <>
            <PortfolioList links={links} onEdit={setEditing} onDelete={handleDelete} onToggle={handleToggle} />
            <PortfolioForm editingLink={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
          </>
        )}
      </section>

      {/* Profiles management */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Profiles (Optional)</h2>
          <p className="text-vscode-text-muted text-xs mt-1">
            Add your GitHub, LinkedIn, or other profiles. Enable them to auto-attach in proposals.
          </p>
        </div>
        {loading ? (
          <div className="text-vscode-text-muted text-sm">Loading...</div>
        ) : (
          <>
            <ProfileList profiles={profiles} onDelete={handleDeleteProfile} onToggle={handleToggleProfile} />
            <ProfileForm onSave={handleAddProfile} />
          </>
        )}
      </section>
    </div>
  );
}

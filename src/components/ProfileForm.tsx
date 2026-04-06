"use client";

import { useState } from "react";
import { PLATFORMS } from "@/types";
import Button from "./Button";

interface ProfileFormProps {
  onSave: (platform: string, url: string) => void;
}

/** Form to add a profile link with platform dropdown */
export default function ProfileForm({ onSave }: ProfileFormProps) {
  const [platform, setPlatform] = useState("github");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSave(platform, url.trim());
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-vscode-heading font-medium">Add Profile</h3>
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="input-field sm:w-48"
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.icon} {p.label}
            </option>
          ))}
        </select>
        <input
          type="url"
          placeholder="https://github.com/yourusername"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="input-field flex-1"
          required
        />
      </div>
      <Button type="submit">Add Profile</Button>
    </form>
  );
}

"use client";

import { ProfileLink, PLATFORMS } from "@/types";

interface ProfileListProps {
  profiles: ProfileLink[];
  onDelete: (id: string | number) => void;
  onToggle: (id: string | number, is_active: boolean) => void;
}

function getPlatformInfo(platform: string) {
  return PLATFORMS.find((p) => p.value === platform) || { label: platform, icon: "🔗" };
}

/** Displays profile links with platform icons and toggle */
export default function ProfileList({ profiles, onDelete, onToggle }: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="card text-center text-vscode-text-muted py-6 text-sm">
        No profiles added yet. Add your GitHub, LinkedIn or other profiles below.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {profiles.map((profile) => {
        const info = getPlatformInfo(profile.platform);
        return (
          <div
            key={profile.id}
            className={`card flex items-center gap-4 py-4 ${
              profile.is_active === false ? "opacity-50" : ""
            }`}
          >
            {/* Toggle */}
            <button
              onClick={() => onToggle(profile.id, !profile.is_active)}
              className={`shrink-0 w-10 h-5 rounded-full relative transition-colors ${
                profile.is_active !== false
                  ? "bg-vscode-primary"
                  : "bg-vscode-border"
              }`}
              title={profile.is_active !== false ? "Active — click to deactivate" : "Inactive — click to activate"}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  profile.is_active !== false ? "left-5" : "left-0.5"
                }`}
              />
            </button>

            {/* Icon */}
            <span className="text-2xl shrink-0">{info.icon}</span>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-medium text-sm">{info.label}</h3>
              <a
                href={profile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-vscode-primary text-xs hover:underline truncate block"
              >
                {profile.url}
              </a>
            </div>

            {/* Delete */}
            <button
              onClick={() => onDelete(profile.id)}
              className="text-xs px-3 py-1.5 rounded bg-vscode-hover text-vscode-error hover:bg-vscode-error hover:text-white transition-colors shrink-0"
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}

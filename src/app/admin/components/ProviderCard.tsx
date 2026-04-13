"use client";

import { useTheme } from "@/context/ThemeContext";

interface ApiKeyRow {
  id: number;
  provider: string;
  api_key_masked: string;
  is_active: boolean;
  updated_at: string;
}

interface ProviderInfo {
  value: string;
  label: string;
  sub: string;
  gradient: string;
  shadow: string;
  dot: string;
}

interface Props {
  provider: ProviderInfo;
  existing: ApiKeyRow | undefined;
  isEditing: boolean;
  formKey: string;
  saving: boolean;
  onSetFormKey: (v: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: () => void;
  onActivate: () => void;
  onDelete: () => void;
}

export default function ProviderCard({ provider: p, existing, isEditing, formKey, saving, onSetFormKey, onStartEdit, onCancelEdit, onSave, onActivate, onDelete }: Props) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const isActive = existing?.is_active;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
      isActive
        ? "border-emerald-500/20 bg-emerald-500/[0.04]"
        : isLight
          ? "border-black/[0.06] bg-black/[0.03] hover:border-black/[0.08]"
          : "border-white/[0.06] bg-white/[0.03] hover:border-white/[0.08]"
    }`}>
      {isActive && <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />}

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center shadow-lg ${p.shadow}`}>
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}>{p.label}</p>
              <p className="text-[11px]" style={{ color: isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)" }}>{p.sub}</p>
            </div>
          </div>
          {isActive && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className={`w-1.5 h-1.5 rounded-full ${p.dot} animate-pulse`} />
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Active</span>
            </div>
          )}
        </div>

        {existing && !isEditing ? (
          <div
            className="mb-4 px-3 py-2.5 rounded-xl"
            style={{
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
              border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-xs font-mono" style={{ color: isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)" }}>{existing.api_key_masked}</p>
            <p className="text-[10px] mt-1" style={{ color: isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)" }}>Updated {new Date(existing.updated_at).toLocaleString()}</p>
          </div>
        ) : !existing && !isEditing ? (
          <div
            className="mb-4 px-3 py-2.5 rounded-xl border border-dashed"
            style={{ borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}
          >
            <p className="text-xs" style={{ color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)" }}>No key configured</p>
          </div>
        ) : null}

        {isEditing && (
          <div className="mb-4 space-y-2">
            <input
              type="text"
              value={formKey}
              onChange={(e) => onSetFormKey(e.target.value)}
              className="rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all w-full"
              style={{
                background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
                border: isLight ? "1px solid rgba(0,0,0,0.10)" : "1px solid rgba(255,255,255,0.10)",
                color: isLight ? "#1a1a2e" : "#ffffff",
              }}
              placeholder={`Paste ${p.label} API key...`}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={onSave}
                disabled={saving || !formKey.trim()}
                className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white disabled:opacity-30 transition-all"
              >
                {saving ? "Saving..." : "Save Key"}
              </button>
              <button
                onClick={onCancelEdit}
                className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                style={{
                  color: isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.60)",
                  borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="flex gap-2">
            {existing ? (
              <>
                {!isActive && (
                  <button
                    onClick={onActivate}
                    className="flex-1 px-3 py-2 rounded-xl text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                  >
                    Use This
                  </button>
                )}
                <button
                  onClick={onStartEdit}
                  className="px-3 py-2 rounded-xl text-[11px] font-semibold border transition-all"
                  style={{
                    color: isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.60)",
                    borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                  }}
                >
                  Change
                </button>
                <button
                  onClick={onDelete}
                  className="px-3 py-2 rounded-xl text-[11px] font-medium text-red-400/50 border border-red-500/10 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                >
                  Delete
                </button>
              </>
            ) : (
              <button
                onClick={onStartEdit}
                className="flex-1 px-3 py-2 rounded-xl text-[11px] font-semibold border border-dashed hover:text-amber-400 hover:border-amber-500/30 transition-all"
                style={{
                  color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)",
                  borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)",
                }}
              >
                + Add Key
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

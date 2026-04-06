"use client";

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
  const isActive = existing?.is_active;

  return (
    <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
      isActive
        ? "border-emerald-500/20 bg-emerald-500/[0.04]"
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
              <p className="text-sm font-bold text-white">{p.label}</p>
              <p className="text-[11px] text-white/40">{p.sub}</p>
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
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <p className="text-xs text-white/40 font-mono">{existing.api_key_masked}</p>
            <p className="text-[10px] text-white/25 mt-1">Updated {new Date(existing.updated_at).toLocaleString()}</p>
          </div>
        ) : !existing && !isEditing ? (
          <div className="mb-4 px-3 py-2.5 rounded-xl border border-dashed border-white/[0.08]">
            <p className="text-xs text-white/35">No key configured</p>
          </div>
        ) : null}

        {isEditing && (
          <div className="mb-4 space-y-2">
            <input
              type="text"
              value={formKey}
              onChange={(e) => onSetFormKey(e.target.value)}
              className="bg-white/[0.05] border border-white/[0.10] text-white placeholder:text-white/25 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all w-full"
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
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white/60 border border-white/[0.08] hover:bg-white/[0.05] hover:text-white transition-all"
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
                  className="px-3 py-2 rounded-xl text-[11px] font-semibold text-white/60 border border-white/[0.08] hover:bg-white/[0.05] hover:text-white transition-all"
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
                className="flex-1 px-3 py-2 rounded-xl text-[11px] font-semibold text-white/35 border border-dashed border-white/[0.08] hover:text-amber-400 hover:border-amber-500/30 transition-all"
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

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import CreateAdminForm from "../components/CreateAdminForm";
import PromoteUserSearch from "../components/PromoteUserSearch";
import { useTheme } from "@/context/ThemeContext";

interface UserRow {
  id: number;
  name: string | null;
  email: string;
  role: string;
  proposal_count: number;
}

export default function AdminsPage() {
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [admins, setAdmins] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");
  const [showCreate, setShowCreate] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users?limit=100");
    const data = await res.json();
    setAdmins((data.users || []).filter((u: UserRow) => u.role === "admin"));
    setLoading(false);
  };

  useEffect(() => { fetchAdmins(); }, []);

  const showMsg = (msg: string, type: "success" | "error" = "success") => {
    setMessage(msg); setMsgType(type);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleDemote = async (userId: number) => {
    if (userId === currentUser?.id) { showMsg("You cannot remove yourself", "error"); return; }
    if (!confirm("Remove admin access for this user?")) return;
    await fetch(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user" }),
    });
    showMsg("Admin access removed");
    fetchAdmins();
  };

  const avatarColors = ["from-amber-400 to-orange-500", "from-violet-500 to-purple-600", "from-cyan-500 to-blue-500", "from-rose-500 to-pink-500"];

  const cardBorder = isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)";
  const cardBg = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";
  const dividerColor = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}>Admins</h1>
          <p className="text-sm mt-1" style={{ color: isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)" }}>Manage admin access</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
        >
          {showCreate ? "Cancel" : "+ Create Sub-Admin"}
        </button>
      </div>

      {message && (
        <div className={`rounded-xl px-4 py-3 border text-sm ${
          msgType === "success"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
            : "border-red-500/20 bg-red-500/10 text-red-400"
        }`}>{message}</div>
      )}

      {showCreate && <CreateAdminForm onCreated={fetchAdmins} onClose={() => setShowCreate(false)} showMsg={showMsg} />}

      <div className="rounded-2xl overflow-hidden" style={{ border: cardBorder, background: cardBg }}>
        <div className="px-5 py-4" style={{ borderBottom: cardBorder }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-sm font-semibold" style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}>Active Admins</h2>
            <span
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
              style={{
                color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)",
                background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
              }}
            >{admins.length}</span>
          </div>
        </div>
        <div style={{ borderTop: "none" }}>
          {admins.map((a, i) => (
            <div
              key={a.id}
              className="flex items-center justify-between px-5 py-4 transition-colors"
              style={{ borderBottom: `1px solid ${dividerColor}` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColors[i % avatarColors.length]} flex items-center justify-center text-sm font-bold text-white shadow-sm`}>
                  {(a.name || a.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: isLight ? "#1a1a2e" : "#ffffff" }}>{a.name || "No Name"}</p>
                  <p className="text-[11px]" style={{ color: isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)" }}>{a.email}</p>
                </div>
              </div>
              {a.id === currentUser?.id ? (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold text-amber-400/60 bg-amber-500/5 border border-amber-500/10">You</span>
              ) : (
                <button
                  onClick={() => handleDemote(a.id)}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-medium text-red-400/50 border border-red-500/10 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <PromoteUserSearch onPromoted={fetchAdmins} showMsg={showMsg} />
    </div>
  );
}

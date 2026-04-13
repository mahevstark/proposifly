"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  { href: "/admin/users", label: "Users", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { href: "/admin/api-keys", label: "API Keys", icon: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" },
  { href: "/admin/admins", label: "Admins", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622A11.99 11.99 0 0012 2.714z" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <aside
      className="w-[260px] min-h-screen hidden md:flex flex-col transition-colors duration-200"
      style={{
        background: isLight ? "#ffffff" : "#0a0a0f",
        borderRight: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl blur-md opacity-40" style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }} />
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)" }}>
              <span className="text-[15px] font-black text-white">P</span>
            </div>
          </div>
          <div>
            <h2 className="text-[14px] font-semibold tracking-tight" style={{ color: isLight ? "#1a1a2e" : "#f1f1f3" }}>Proposifly</h2>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#f97316", opacity: 0.7 }}>Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] px-3 mb-2" style={{ color: isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.2)" }}>Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 relative overflow-hidden"
              style={{
                background: isActive ? (isLight ? "rgba(249,115,22,0.08)" : "rgba(249,115,22,0.08)") : "transparent",
                color: isActive ? (isLight ? "#1a1a2e" : "#f1f1f3") : (isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.38)"),
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = isLight ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.68)"; }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.38)"; }}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-5 rounded-full" style={{ background: "linear-gradient(to bottom, #f59e0b, #f97316)" }} />
              )}
              <svg
                className="w-[17px] h-[17px] flex-shrink-0 transition-colors duration-150"
                style={{ color: isActive ? "#f97316" : (isLight ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.28)") }}
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5 px-1 py-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
            {(user?.name || user?.email || "A")[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium truncate" style={{ color: isLight ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.75)" }}>{user?.name || "Admin"}</p>
            <p className="text-[10px] truncate" style={{ color: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.3)" }}>{user?.email}</p>
          </div>
        </div>
        <Link
          href="/app"
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] font-medium transition-all duration-150"
          style={{
            color: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.35)",
            border: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.07)",
            background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          Back to App
        </Link>
      </div>
    </aside>
  );
}

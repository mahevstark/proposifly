"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    if (isLoginPage) {
      if (user && user.role === "admin") router.push("/admin");
      return;
    }
    if (!user) { router.push("/admin/login"); return; }
    if (user.role !== "admin") { router.push("/admin/login"); return; }
    setAuthorized(true);
  }, [user, loading, router, isLoginPage]);

  if (isLoginPage) return <div className="dark">{children}</div>;

  if (loading || !authorized) {
    return (
      <div className="dark">
        <div className="min-h-screen bg-[#060608] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-vscode-accent/20 border-t-vscode-accent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="dark">
      <div className="relative min-h-screen bg-[#060608] flex flex-col md:flex-row overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-vscode-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-40 w-80 h-80 bg-purple-600/4 rounded-full blur-3xl" />
        </div>
        <AdminSidebar />
        <AdminHeader />
        <main className="relative flex-1 overflow-auto z-10">
          <div className="max-w-6xl mx-auto p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

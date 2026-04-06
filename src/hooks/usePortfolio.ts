"use client";

import { useState, useEffect } from "react";
import { PortfolioLink, PortfolioCategory } from "@/types";

export default function usePortfolio(user: { name: string | null; email: string } | null) {
  const [links, setLinks] = useState<PortfolioLink[]>([]);
  const [editing, setEditing] = useState<PortfolioLink | null>(null);
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>("web");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((data) => setLinks(data.links || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const filteredLinks = links.filter((l) => (l.category || "web") === activeCategory);

  const counts = links.reduce((acc, l) => {
    const cat = (l.category || "web") as PortfolioCategory;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<PortfolioCategory, number>);

  const handleSave = async (link: PortfolioLink) => {
    if (editing) {
      const res = await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: link.id, title: link.title, url: link.url }),
      });
      const data = await res.json();
      if (res.ok) setLinks(links.map((l) => (l.id === link.id ? data.link : l)));
    } else {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: link.title, url: link.url, category: link.category || activeCategory }),
      });
      const data = await res.json();
      if (res.ok) setLinks([data.link, ...links]);
    }
    setEditing(null);
  };

  const handleDelete = async (id: string | number) => {
    const res = await fetch("/api/portfolio", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) setLinks(links.filter((l) => l.id !== id));
  };

  const handleToggle = async (id: string | number, is_active: boolean) => {
    const res = await fetch("/api/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active }),
    });
    if (res.ok) setLinks(links.map((l) => (l.id === id ? { ...l, is_active } : l)));
  };

  return {
    links,
    filteredLinks,
    counts,
    editing,
    setEditing,
    activeCategory,
    setActiveCategory,
    loading,
    handleSave,
    handleDelete,
    handleToggle,
  };
}

"use client";

import { useState, useEffect } from "react";
import { PortfolioLink, PortfolioCategory, PORTFOLIO_CATEGORIES } from "@/types";
import { generateId } from "@/lib/storage";
import Button from "./Button";

interface PortfolioFormProps {
  editingLink: PortfolioLink | null;
  onSave: (link: PortfolioLink) => void;
  onCancel: () => void;
  activeCategory?: PortfolioCategory;
}

export default function PortfolioForm({ editingLink, onSave, onCancel, activeCategory = "web" }: PortfolioFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<PortfolioCategory>(activeCategory);

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
      setCategory(editingLink.category || "web");
    } else {
      setTitle("");
      setUrl("");
      setCategory(activeCategory);
    }
  }, [editingLink, activeCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onSave({
      id: editingLink?.id || generateId(),
      title: title.trim(),
      url: url.trim(),
      category,
    });
    setTitle("");
    setUrl("");
  };

  const placeholder = category === "figma"
    ? "https://figma.com/file/..."
    : category === "mobile"
    ? "https://play.google.com/store/apps/..."
    : "https://example.com/project";

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-white font-medium">
        {editingLink ? "Edit Link" : `Add ${PORTFOLIO_CATEGORIES.find((c) => c.value === category)?.label || "Portfolio"} Link`}
      </h3>
      <input
        type="text"
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input-field"
        required
      />
      <input
        type="url"
        placeholder={placeholder}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="input-field"
        required
      />
      {editingLink && (
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as PortfolioCategory)}
          className="input-field"
        >
          {PORTFOLIO_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
          ))}
        </select>
      )}
      <div className="flex gap-3">
        <Button type="submit">{editingLink ? "Update" : "Add Link"}</Button>
        {editingLink && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}

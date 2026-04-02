"use client";

import { useState, useEffect } from "react";
import { PortfolioLink } from "@/types";
import { generateId } from "@/lib/storage";
import Button from "./Button";

interface PortfolioFormProps {
  editingLink: PortfolioLink | null;
  onSave: (link: PortfolioLink) => void;
  onCancel: () => void;
}

/** Form to add or edit a portfolio link */
export default function PortfolioForm({ editingLink, onSave, onCancel }: PortfolioFormProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  /* Populate fields when editing */
  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
    } else {
      setTitle("");
      setUrl("");
    }
  }, [editingLink]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    onSave({
      id: editingLink?.id || generateId(),
      title: title.trim(),
      url: url.trim(),
    });
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <h3 className="text-white font-medium">
        {editingLink ? "Edit Link" : "Add Portfolio Link"}
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
        placeholder="https://example.com/project"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="input-field"
        required
      />
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

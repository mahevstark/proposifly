"use client";

import { useState } from "react";

interface UserSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function UserSearch({ onSearch, placeholder }: UserSearchProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vscode-text-muted"
          fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder || "Search by name or email..."}
          className="input-field pl-10 w-full"
        />
      </div>
      <button type="submit" className="btn-primary px-4 py-2 text-sm">
        Search
      </button>
      {query && (
        <button type="button" onClick={handleClear} className="btn-secondary px-4 py-2 text-sm">
          Clear
        </button>
      )}
    </form>
  );
}

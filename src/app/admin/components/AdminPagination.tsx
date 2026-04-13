"use client";

import { useTheme } from "@/context/ThemeContext";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({ page, totalPages, onPageChange }: AdminPaginationProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const idleColor = isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)";
  const idleHoverBg = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
  const ellipsisColor = isLight ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.20)";

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed"
        style={{ color: idleColor }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = idleHoverBg; (e.currentTarget as HTMLButtonElement).style.color = isLight ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.70)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = ""; (e.currentTarget as HTMLButtonElement).style.color = idleColor; }}
      >
        ← Prev
      </button>
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{ color: idleColor }}
          >1</button>
          {start > 2 && <span className="px-1 text-xs" style={{ color: ellipsisColor }}>···</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150 ${
            p === page ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25" : ""
          }`}
          style={p !== page ? { color: idleColor } : undefined}
        >{p}</button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-xs" style={{ color: ellipsisColor }}>···</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150"
            style={{ color: idleColor }}
          >{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed"
        style={{ color: idleColor }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = idleHoverBg; (e.currentTarget as HTMLButtonElement).style.color = isLight ? "rgba(0,0,0,0.70)" : "rgba(255,255,255,0.70)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = ""; (e.currentTarget as HTMLButtonElement).style.color = idleColor; }}
      >
        Next →
      </button>
    </div>
  );
}

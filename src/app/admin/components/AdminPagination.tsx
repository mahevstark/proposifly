"use client";

interface AdminPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AdminPagination({ page, totalPages, onPageChange }: AdminPaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const btnBase = "w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150";
  const btnIdle = "text-white/40 hover:text-white/80 hover:bg-white/[0.06]";
  const btnNav = "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 text-white/40 hover:text-white/70 hover:bg-white/[0.06] disabled:opacity-20 disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1} className={btnNav}>
        ← Prev
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={`${btnBase} ${btnIdle}`}>1</button>
          {start > 2 && <span className="text-white/20 px-1 text-xs">···</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p} onClick={() => onPageChange(p)}
          className={`${btnBase} ${p === page ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25" : btnIdle}`}
        >{p}</button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-white/20 px-1 text-xs">···</span>}
          <button onClick={() => onPageChange(totalPages)} className={`${btnBase} ${btnIdle}`}>{totalPages}</button>
        </>
      )}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} className={btnNav}>
        Next →
      </button>
    </div>
  );
}

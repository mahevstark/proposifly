interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const btnBase =
    "px-3 py-1.5 rounded-lg text-sm transition-all border";
  const btnActive =
    "bg-vscode-primary/20 border-vscode-primary text-vscode-primary";
  const btnDefault =
    "bg-vscode-bg/80 border-vscode-border text-vscode-text-muted hover:border-vscode-primary/50 hover:text-vscode-heading";
  const btnDisabled =
    "bg-vscode-bg/40 border-vscode-border/50 text-vscode-text-muted/40 cursor-not-allowed";

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`${btnBase} ${currentPage <= 1 ? btnDisabled : btnDefault}`}
      >
        Previous
      </button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-vscode-text-muted/50">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`${btnBase} ${p === currentPage ? btnActive : btnDefault}`}
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`${btnBase} ${currentPage >= totalPages ? btnDisabled : btnDefault}`}
      >
        Next
      </button>
    </div>
  );
}

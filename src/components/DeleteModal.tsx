interface DeleteModalProps {
  title: string;
  message: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteModal({ title, message, deleting, onConfirm, onCancel }: DeleteModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-vscode-overlay/60 z-[60]" onClick={() => !deleting && onCancel()} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-sm bg-vscode-sidebar border border-vscode-border rounded-xl shadow-2xl p-6">
        <h3 className="text-lg font-semibold text-vscode-heading mb-2">{title}</h3>
        <p className="text-vscode-text text-sm mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 rounded text-sm text-vscode-text bg-vscode-hover hover:bg-vscode-border transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 rounded text-sm text-white bg-vscode-error hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </>
  );
}

import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

/** Styled textarea with optional label */
export default function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm text-vscode-text-muted mb-1.5">{label}</label>
      )}
      <textarea
        className={`input-field resize-y min-h-[120px] ${className}`}
        {...props}
      />
    </div>
  );
}

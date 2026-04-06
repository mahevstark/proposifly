interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative bg-vscode-bg-light border border-vscode-border rounded-2xl p-7 hover:border-vscode-primary/50 hover:shadow-xl hover:shadow-vscode-primary/10 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col gap-4 overflow-hidden">
      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-vscode-primary/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-vscode-primary/20 to-blue-500/10 border border-vscode-primary/20 flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
        {icon}
      </div>

      <div className="relative">
        <h3 className="text-vscode-heading font-bold text-lg mb-2">{title}</h3>
        <p className="text-vscode-text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

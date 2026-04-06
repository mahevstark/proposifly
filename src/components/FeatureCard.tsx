interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

/** Single feature highlight card for the landing page */
export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card-hover group text-center p-8">
      <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-vscode-primary/10 border border-vscode-primary/20 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-vscode-primary/20 transition-all duration-300">
        {icon}
      </div>
      <h3 className="text-vscode-heading font-semibold text-lg mb-2 group-hover:text-vscode-primary transition-colors">{title}</h3>
      <p className="text-vscode-text-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

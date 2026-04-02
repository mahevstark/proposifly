interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

/** Single feature highlight card for the landing page */
export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="card text-center hover:border-vscode-primary/50 transition-colors duration-300">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-vscode-text-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

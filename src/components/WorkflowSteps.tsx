const steps = [
  { num: "01", title: "Sign Up Free", desc: "Create your free account in seconds — no credit card needed." },
  { num: "02", title: "Add Your Portfolio", desc: "Save your portfolio links once. They will be auto-attached to every proposal you generate." },
  { num: "03", title: "Paste Job Description", desc: "Copy the job post into Proposifly and choose your tone." },
  { num: "04", title: "Generate & Send", desc: "AI writes a polished proposal with your portfolio included — ready to send." },
];

/** Three-step workflow section for landing page */
export default function WorkflowSteps() {
  return (
    <section className="py-16 px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
        How It Works
      </h2>
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {steps.map((step) => (
          <div key={step.num} className="text-center">
            <div className="text-vscode-accent text-4xl font-bold mb-3">{step.num}</div>
            <h3 className="text-white font-semibold mb-2">{step.title}</h3>
            <p className="text-vscode-text-muted text-sm">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

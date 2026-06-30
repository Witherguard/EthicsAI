const steps = [
  {
    number: "01",
    title: "Ask a real question",
    text: "Start with a concern about bias, privacy, transparency, safety, or responsible design.",
  },
  {
    number: "02",
    title: "Compare perspectives",
    text: "See how different ethical frameworks can reveal different trade-offs.",
  },
  {
    number: "03",
    title: "Decide with clarity",
    text: "Leave with a better understanding of risks, responsibilities, and next steps.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            How it works
          </p>

          <h2 className="text-4xl font-bold md:text-5xl">
            Simple questions. Deeper reasoning.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="glass-card p-8 text-center">
              <p className="gradient-text text-5xl font-bold">{step.number}</p>
              <h3 className="mt-5 text-2xl font-bold">{step.title}</h3>
              <p className="mt-4 leading-7 text-muted-foreground">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
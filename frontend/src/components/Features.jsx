const features = [
  {
    icon: "♙",
    title: "Responsible AI Guidance",
    text: "Grounded answers that help you weigh trade-offs, not just follow rules.",
  },
  {
    icon: "⚖",
    title: "Bias & Fairness Education",
    text: "Understand how bias enters AI systems and the techniques used to mitigate it.",
  },
  {
    icon: "▢",
    title: "Privacy & Data Awareness",
    text: "Explore consent, data minimization, and what private by design really means.",
  },
  {
    icon: "◎",
    title: "Transparency & Explainability",
    text: "Learn why explainable AI matters and how interpretability tools work in practice.",
  },
  {
    icon: "◌",
    title: "Real-Time Ethical Support",
    text: "Get instant, conversational help thinking through ethical scenarios.",
  },
  {
    icon: "▱",
    title: "Beginner-Friendly Explanations",
    text: "Complex ideas explained in plain language without losing the nuance.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Capabilities
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            Everything you need to think{" "}
            <span className="gradient-text">clearly about AI.</span>
          </h2>

          <p className="mt-5 text-lg leading-8 text-muted-foreground">
            Six focused capabilities, one conversational interface, built for
            clarity, depth, and trust.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="glass-card p-8 transition hover:-translate-y-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary text-2xl text-primary-foreground shadow-glow">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-4 leading-7 text-muted-foreground">
                {feature.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
const reasons = [
  {
    icon: "↗",
    title: "AI is everywhere",
    text: "From hiring to healthcare, algorithms now influence decisions that shape lives.",
  },
  {
    icon: "△",
    title: "Risks are real",
    text: "Biased models, opaque systems, and privacy erosion can cause measurable harm.",
  },
  {
    icon: "◎",
    title: "People deserve a voice",
    text: "Ethics gives the public a seat at the table, not just engineers.",
  },
  {
    icon: "◌",
    title: "The stakes are global",
    text: "Decisions made today about AI will shape society for generations.",
  },
];

export default function WhyMatters() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-4xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Why it matters
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            AI is shaping the future.{" "}
            <span className="gradient-text">Ethics decides whose.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            As AI becomes more powerful, the world needs tools that help people
            think critically about fairness, accountability, privacy, and social
            impact, not just performance.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map((reason) => (
            <article key={reason.title} className="glass-card p-7">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-xl text-primary">
                {reason.icon}
              </div>
              <h3 className="text-xl font-bold">{reason.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{reason.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
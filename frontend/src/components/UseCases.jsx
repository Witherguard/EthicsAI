const useCases = [
  {
    icon: "▱",
    title: "Students",
    text: "Build a strong foundation in AI ethics for coursework, papers, and debates.",
  },
  {
    icon: "</>",
    title: "Developers",
    text: "Ship responsibly with practical guidance on bias, evaluation, and deployment.",
  },
  {
    icon: "▣",
    title: "Businesses",
    text: "Stress-test AI decisions before they hit customers, regulators, or the press.",
  },
  {
    icon: "⌬",
    title: "Researchers",
    text: "Explore the ethical edges of your work, from data sourcing to publication.",
  },
  {
    icon: "☷",
    title: "Everyone else",
    text: "Curious about AI? Get clear, honest answers to questions that actually matter.",
  },
];

export default function UseCases() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Who it’s for
            </p>

            <h2 className="text-4xl font-bold leading-tight md:text-6xl">
              Built for{" "}
              <span className="gradient-text">anyone shaping AI’s future.</span>
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-8 text-muted-foreground lg:ml-auto">
            EthicAI Chat meets you where you are, whether you’re writing your
            first essay or shipping your hundredth model.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <article className="glass-card min-h-[260px] p-8 lg:row-span-2">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary text-xl text-primary-foreground">
              {useCases[0].icon}
            </div>
            <h3 className="text-2xl font-bold">{useCases[0].title}</h3>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {useCases[0].text}
            </p>
          </article>

          {useCases.slice(1).map((item) => (
            <article key={item.title} className="glass-card p-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary text-xl text-primary-foreground">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-7 text-muted-foreground">{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
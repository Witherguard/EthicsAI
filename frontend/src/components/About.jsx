const frameworks = [
  ["AI ACT", "Regulatory framework"],
  ["AI RMF", "Risk management"],
  ["AI PRINCIPLES", "Design principles"],
  ["AI STANDARDS", "Management standard"],
];

const points = [
  "Designed for students, developers, businesses, and the curious",
  "Balanced perspectives, never preachy, always nuanced",
  "Cites established frameworks like EU AI Act and NIST AI RMF",
  "Always available, always free to explore",
];

export default function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1fr] lg:items-center">
        <div className="glass-card p-8 md:p-10">
          <div className="grid gap-5 sm:grid-cols-2">
            {frameworks.map(([title, text]) => (
              <div key={title} className="rounded-xl bg-secondary/40 p-6">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-border bg-background/40 p-6 italic leading-8 text-muted-foreground">
            “AI ethics isn’t a checklist, it’s an ongoing conversation. EthicAI
            Chat is here to help you have it.”
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            About
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            Built to <span className="gradient-text">educate</span>
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            EthicAI Chat exists to make ethical reasoning about artificial
            intelligence approachable for everyone, from first-year computer
            science students to senior policy makers. We believe responsible AI
            starts with better questions, not better slogans.
          </p>

          <div className="mt-8 space-y-4">
            {points.map((point) => (
              <div key={point} className="flex gap-3 text-muted-foreground">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary text-xs text-primary">
                  ✓
                </span>
                <p className="font-medium">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
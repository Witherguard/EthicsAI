export default function FinalCTA() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="glass-card mx-auto max-w-7xl overflow-hidden p-10 text-center md:p-16">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Ready when you are
        </p>

        <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
          Start asking better{" "}
          <span className="gradient-text">questions about AI.</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Open the chatbot, pick a topic, and explore the ethics behind the
          technology shaping your world.
        </p>

        <a
          href="#chatbot"
          className="mt-8 inline-flex rounded-xl bg-gradient-primary px-7 py-4 font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
        >
          Open the Chatbot →
        </a>
      </div>
    </section>
  );
}
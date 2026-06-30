export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-6 pb-24 pt-36 md:pt-44">
      <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-gradient-glow opacity-70 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-gradient-glow opacity-50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.95fr]">
        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
            <span className="text-primary">✦</span>
            Trusted AI ethics guidance, powered by responsible AI
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-[1.04] md:text-7xl">
            Navigate AI Ethics with{" "}
            <span className="gradient-text">Confidence.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            EthicAI Chat is your intelligent companion for understanding bias,
            privacy, transparency, and the real-world impact of artificial
            intelligence, so you can make responsible decisions with clarity.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="#chatbot"
              className="rounded-xl bg-gradient-primary px-7 py-4 text-center font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
            >
              Try the Ethics Chatbot →
            </a>

            <a
              href="#about"
              className="rounded-xl border border-border bg-secondary/40 px-7 py-4 text-center font-semibold text-foreground transition hover:bg-secondary"
            >
              Learn More
            </a>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-3 gap-6">
            <div>
              <p className="gradient-text text-2xl font-bold">12+</p>
              <p className="mt-1 text-sm text-muted-foreground">Ethics topics</p>
            </div>
            <div>
              <p className="gradient-text text-2xl font-bold">24/7</p>
              <p className="mt-1 text-sm text-muted-foreground">Available</p>
            </div>
            <div>
              <p className="gradient-text text-2xl font-bold">Free</p>
              <p className="mt-1 text-sm text-muted-foreground">To explore</p>
            </div>
          </div>
        </div>

        <div className="glass-card animate-float p-6">
          <div className="mb-6 flex items-center justify-between border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                ♢
              </div>
              <div>
                <h2 className="font-semibold">EthicAI Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-400">●</span> Online
                </p>
              </div>
            </div>
            <span className="text-primary">✣</span>
          </div>

          <div className="space-y-5">
            <div className="ml-auto max-w-[72%] rounded-2xl bg-gradient-primary px-5 py-4 text-sm font-medium text-primary-foreground">
              What are the ethical risks of facial recognition?
            </div>

            <div className="max-w-[82%] rounded-2xl bg-secondary/70 px-5 py-4 text-sm leading-7 text-foreground">
              Facial recognition raises four key concerns: accuracy disparities
              across demographics, consent and surveillance creep, data retention
              risks, and chilling effects on free assembly.
            </div>

            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="h-2 w-2 rounded-full bg-primary/70" />
              <span className="h-2 w-2 rounded-full bg-primary/40" />
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-background/60 p-3">
              <div className="flex-1 text-sm text-muted-foreground">
                Ask about AI ethics...
              </div>
              <button className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
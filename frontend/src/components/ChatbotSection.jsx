import ChatApp from "../ChatApp";

export default function ChatbotSection() {
  return (
    <section id="chatbot" className="relative px-6 py-24">
      <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-glow opacity-40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
            <span className="text-primary">✣</span>
            Live AI Assistant
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Chatbot
          </p>

          <h2 className="text-4xl font-bold leading-tight md:text-6xl">
            Ask the <span className="gradient-text">Ethics Chatbot</span>
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
            Real conversations with a real model. Explore complex questions about
            responsible AI and get balanced, nuanced answers in seconds.
          </p>
        </div>

        <ChatApp />
      </div>
    </section>
  );
}
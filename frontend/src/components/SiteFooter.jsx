const footerColumns = [
  {
    title: "Product",
    links: ["Chatbot", "Features", "Use Cases"],
  },
  {
    title: "Company",
    links: ["About", "Why It Matters", "Contact"],
  },
  {
    title: "Resources",
    links: ["EU AI Act", "NIST AI RMF", "IEEE EAD"],
  },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <a href="#home" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary font-bold text-primary-foreground">
              ✦
            </span>
            <span className="text-lg font-bold">
              EthicAI <span className="font-normal text-muted-foreground">Chat</span>
            </span>
          </a>

          <p className="mt-5 max-w-sm leading-7 text-muted-foreground">
            An AI-powered companion for navigating the ethics of artificial
            intelligence, built to help everyone think more clearly.
          </p>

          <div className="mt-5 flex gap-3">
            {["⌘", "◌", "▣"].map((icon) => (
              <span
                key={icon}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-secondary/40 text-muted-foreground"
              >
                {icon}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wide">
                {column.title}
              </h3>

              <div className="space-y-3">
                {column.links.map((link) => (
                  <a
                    key={link}
                    href="#home"
                    className="block text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row">
        <p>© 2026 EthicAI Chat. Built for responsible AI exploration.</p>
        <p>Educational tool. Not legal or compliance advice.</p>
      </div>
    </footer>
  );
}
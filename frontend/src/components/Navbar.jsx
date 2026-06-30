const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Chatbot", href: "#chatbot" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-4 pt-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/70 bg-card/70 px-4 py-3 shadow-card backdrop-blur-xl md:px-6">
        <a href="#home" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-lg font-bold text-primary-foreground shadow-glow">
            ✦
          </span>
          <span className="text-lg font-bold">
            EthicAI <span className="font-normal text-muted-foreground">Chat</span>
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#chatbot"
          className="rounded-xl bg-gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition hover:scale-[1.02]"
        >
          Try Chatbot
        </a>
      </div>
    </nav>
  );
}
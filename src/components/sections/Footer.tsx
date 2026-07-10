import { Code2, Linkedin, Twitter } from "@/components/ui/SocialIcons";
import { Logo } from "@/components/ui/Logo";
import { services, navLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--color-border-subtle)] pt-16 pb-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 thread-gradient opacity-40" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-[var(--color-ink-muted)] leading-relaxed max-w-xs">
              Nous transformons vos idées en solutions digitales intelligentes.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { icon: Code2, label: "GitHub" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid place-items-center h-9 w-9 rounded-lg glass text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:border-[var(--color-border-glow)] transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-ink)] mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-brand-cyan)] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-ink)] mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.slice(0, 6).map((s) => (
                <li key={s.title}>
                  <a href="#services" className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-brand-cyan)] transition-colors">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[var(--color-ink)] mb-4">Légal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-brand-cyan)] transition-colors">Mentions légales</a></li>
              <li><a href="#" className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-brand-cyan)] transition-colors">Politique de confidentialité</a></li>
              <li><a href="#contact" className="text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-brand-cyan)] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-ink-faint)]">
            © {new Date().getFullYear()} 221BelCode. Tous droits réservés.
          </p>
          <p className="text-xs text-[var(--color-ink-faint)]">
            Conçu &amp; développé avec soin.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/data/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-300 ${
          scrolled ? "mt-3" : "mt-0"
        }`}
      >
        <div
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 py-3 transition-all duration-300 ${
            scrolled ? "glass shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]" : "bg-transparent"
          }`}
        >
          <a href="#top" aria-label="221BelCode — accueil">
            <Logo />
          </a>
          <ul className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="px-4 py-2 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] rounded-lg hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex items-center gap-2">
            <a
              href="/diagnostic"
              className="px-4 py-2 text-sm font-medium text-[var(--color-brand-cyan)] hover:text-[var(--color-ink)] rounded-lg hover:bg-white/5 transition-colors"
            >
              Diagnostic gratuit
            </a>
            <Button href="#contact">Demander un devis</Button>
          </div>
          <button
            className="lg:hidden grid place-items-center h-10 w-10 rounded-lg text-[var(--color-ink)] hover:bg-white/5"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden mt-2 glass rounded-2xl"
            >
              <ul className="flex flex-col p-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] hover:bg-white/5 rounded-lg"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li className="p-2 space-y-2">
                  <a
                    href="/diagnostic"
                    onClick={() => setOpen(false)}
                    className="block text-center rounded-full px-6 py-3 text-sm font-semibold text-[var(--color-brand-cyan)] border border-[var(--color-border-glow)]"
                  >
                    Diagnostic gratuit
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="block text-center rounded-full px-6 py-3 text-sm font-semibold text-white bg-[var(--color-brand-blue-bright)]"
                  >
                    Demander un devis
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}

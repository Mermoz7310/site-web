"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function DiagnosticCTA() {
  return (
    <section id="diagnostic-cta" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-3xl glass px-6 py-12 sm:px-14 sm:py-16"
        >
          {/* halo décoratif */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(34,211,238,0.18), transparent 70%)" }}
          />

          <div className="relative flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-glow)] bg-white/5 px-4 py-1.5 text-xs font-semibold text-[var(--color-ink-muted)]">
              <Sparkles size={14} className="text-[var(--color-brand-cyan)]" />
              Diagnostic gratuit · 2 minutes
            </div>

            <h2 className="mt-6 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--color-ink)]">
              Combien la gestion manuelle vous coûte-t-elle vraiment&nbsp;?
            </h2>

            <p className="mt-5 max-w-2xl text-base sm:text-lg text-[var(--color-ink-muted)]">
              Décrivez votre activité en quelques mots. Notre assistant identifie votre besoin,
              calcule le temps et l&apos;argent que vous pourriez récupérer, et vous montre
              concrètement ce qu&apos;un outil sur mesure changerait pour vous.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center gap-3">
              <Button href="/diagnostic" className="text-base px-8 py-4">
                Lancer mon diagnostic gratuit
                <ArrowRight size={18} />
              </Button>
              <span className="text-xs text-[var(--color-ink-muted)]">
                Sans engagement · Aucune donnée revendue
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

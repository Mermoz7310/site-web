"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { HeroVisual } from "./HeroVisual";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
      {/* Ambient layers */}
      <div className="absolute inset-0 bg-grid opacity-40" aria-hidden />
      <div className="absolute inset-0 spotlight" aria-hidden />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 thread-gradient opacity-60"
        aria-hidden
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-6"
            >
              <Sparkles size={14} className="text-[var(--color-brand-cyan)]" />
              <span className="text-xs text-[var(--color-ink-muted)]">
                Agence digitale · Belgique &amp; Sénégal
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-balance"
            >
              Nous développons des{" "}
              <span className="gradient-text">solutions digitales</span> qui font grandir
              votre entreprise.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-base sm:text-lg text-[var(--color-ink-muted)] leading-relaxed max-w-xl mx-auto lg:mx-0 text-pretty"
            >
              Applications web, SaaS, applications métiers, automatisation IA,
              plateformes éducatives, dashboards Power BI et solutions sur mesure.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <Button href="#services">
                Découvrir nos services
                <ArrowRight size={16} />
              </Button>
              <Button href="#contact" variant="secondary">
                Demander un devis
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-[var(--color-ink-faint)]"
            >
              <span>+7 plateformes livrées</span>
              <span className="h-1 w-1 rounded-full bg-[var(--color-ink-faint)]" />
              <span>Support continu</span>
            </motion.div>
          </motion.div>

          <div className="relative">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  );
}

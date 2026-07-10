"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { processSteps } from "@/data/site";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export function Process() {
  return (
    <section id="processus" className="relative section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Notre processus"
          title="Une méthode claire, du premier échange à la maintenance"
          description="Sept étapes structurées pour transformer votre idée en produit fiable, sans mauvaise surprise."
        />

        <div className="relative mt-16">
          {/* Central vertical thread (desktop) */}
          <div
            className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[var(--color-brand-blue)]/40 to-transparent"
            aria-hidden
          />

          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-4 lg:space-y-0"
          >
            {processSteps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.li
                  key={step.number}
                  variants={fadeInUp}
                  className={`relative lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center ${
                    isLeft ? "" : "lg:[direction:rtl]"
                  }`}
                >
                  <div className={`lg:[direction:ltr] ${isLeft ? "lg:text-right lg:pr-12" : "lg:pl-12"}`}>
                    <div
                      className={`card-lift rounded-[var(--radius-card)] bg-[var(--color-card)] border border-[var(--color-border-subtle)] p-6 lg:my-6 ${
                        isLeft ? "lg:ml-auto" : ""
                      }`}
                    >
                      <div className={`flex items-center gap-3 mb-2 ${isLeft ? "lg:justify-end" : ""}`}>
                        <span className="font-[family-name:var(--font-display)] text-2xl font-bold text-[var(--color-brand-blue)]/40">
                          {step.number}
                        </span>
                        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Node on the line */}
                  <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="grid place-items-center h-4 w-4 rounded-full bg-[var(--color-canvas)] border-2 border-[var(--color-brand-cyan)] shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                  </div>

                  <div className="hidden lg:block" aria-hidden />
                </motion.li>
              );
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}

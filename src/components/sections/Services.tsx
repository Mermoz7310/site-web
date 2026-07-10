"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { services } from "@/data/site";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export function Services() {
  return (
    <section id="services" className="relative section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Nos services"
          title="Tout ce dont votre projet digital a besoin"
          description="De la première idée à la mise en production, nous couvrons l'ensemble de la chaîne de développement."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.article
                key={service.title}
                variants={fadeInUp}
                className="group card-lift relative rounded-[var(--radius-card)] bg-[var(--color-card)] border border-[var(--color-border-subtle)] p-6 overflow-hidden"
              >
                {/* Hover glow accent */}
                <div
                  className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-[var(--color-brand-blue)] opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500"
                  aria-hidden
                />
                <div className="relative inline-flex items-center justify-center h-11 w-11 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-brand-cyan)] group-hover:border-[var(--color-border-glow)] transition-colors">
                  <Icon size={20} strokeWidth={1.75} />
                </div>
                <h3 className="relative mt-5 font-[family-name:var(--font-display)] text-lg font-semibold text-[var(--color-ink)]">
                  {service.title}
                </h3>
                <p className="relative mt-2 text-sm text-[var(--color-ink-muted)] leading-relaxed">
                  {service.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { advantages } from "@/data/site";
import { staggerContainer, fadeInUp } from "@/lib/motion";

export function WhyUs() {
  return (
    <section id="pourquoi" className="relative section-pad bg-[var(--color-surface)]/40">
      {/* soft top divider */}
      <div className="absolute top-0 inset-x-0 h-px thread-gradient opacity-30" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Pourquoi nous ?"
          title="Une exigence de qualité à chaque étape"
          description="Nous ne livrons pas seulement du code. Nous livrons des produits fiables, sécurisés et pensés pour durer."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {advantages.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="card-lift rounded-[var(--radius-card)] glass p-5"
            >
              <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-[var(--color-brand-blue)]/15 text-[var(--color-brand-cyan)] mb-4">
                <Check size={16} strokeWidth={2.5} />
              </div>
              <h3 className="font-[family-name:var(--font-display)] text-base font-semibold text-[var(--color-ink)]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-[var(--color-ink-muted)] leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

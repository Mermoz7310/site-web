"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { technologies } from "@/data/site";
import { staggerContainer, scaleIn } from "@/lib/motion";

export function TechStack() {
  return (
    <section className="relative section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Technologies"
          title="Un stack moderne, éprouvé et maintenu"
          description="Nous utilisons des outils fiables et largement adoptés, choisis pour la performance et la pérennité."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 flex flex-wrap justify-center gap-3"
        >
          {technologies.map((tech) => (
            <motion.div
              key={tech.name}
              variants={scaleIn}
              whileHover={{ y: -3 }}
              className="group flex items-center gap-2.5 rounded-xl glass px-4 py-3 hover:border-[var(--color-border-glow)] transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand-cyan)] group-hover:shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-shadow" />
              <span className="text-sm font-medium text-[var(--color-ink-muted)] group-hover:text-[var(--color-ink)] transition-colors">
                {tech.name}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
